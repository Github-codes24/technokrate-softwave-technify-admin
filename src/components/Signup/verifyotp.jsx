
import { ShieldCheck } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import verifyotpImg from "../../assets/Verified-rafiki.png";
import { verifyAdminOtp } from "../../redux/slice/auth/verifySlice";

export default function VerifyOtp() {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputsRef = useRef([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // 🔹 Select email and received OTP from Login Slice
    const { email, receivedOtp } = useSelector((state) => state.login);
    const { loading } = useSelector((state) => state.verify);

    const otpToastIdRef = useRef(null);

    // 🔹 Show OTP toast from API Response
    useEffect(() => {
        if (receivedOtp) {
            otpToastIdRef.current = toast.success(
                `${receivedOtp}`,
                {
                    position: "top-right",
                    autoClose: 10000, 
                }
            );
        }
    }, [receivedOtp]);

    const handleChange = (value, index) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < otp.length - 1) {
            inputsRef.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputsRef.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0, 6);
        if (!/^\d+$/.test(pastedData)) return;
        const newOtp = [...otp];
        pastedData.split("").forEach((char, i) => {
            if (i < 6) newOtp[i] = char;
        });
        setOtp(newOtp);
        inputsRef.current[Math.min(pastedData.length, 5)].focus();
    };

    const handleVerifyOtp = async () => {
        if (otpToastIdRef.current) {
            toast.dismiss(otpToastIdRef.current);
        }

        const enteredOtp = otp.join("");

        if (enteredOtp.length < 6) {
            toast.error("Please enter complete 6 digit OTP");
            return;
        }

        // 🔹 Dispatch API Call using email
        const resultAction = await dispatch(verifyAdminOtp({ email, otp: enteredOtp }));
        
        if (verifyAdminOtp.fulfilled.match(resultAction)) {
            navigate("/dashboard");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-50 via-white to-blue-50">
            <div className="flex w-full h-screen overflow-hidden bg-white transition-transform duration-300">
                
                <div className="hidden md:flex w-1/2 p-10 items-center justify-center bg-linear-to-br from-orange-400 via-orange-500 to-blue-500">
                    <img src={verifyotpImg} alt="verify otp" className="w-full max-w-2xl drop-shadow-2xl" />
                </div>

                <div className="w-full md:w-1/2 px-10 bg-white flex flex-col justify-center items-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center">
                            <ShieldCheck className="text-blue-600 w-7 h-7" />
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-orange-500 mb-2 text-center">Verify OTP</h2>

                    <p className="text-gray-600 text-center mb-8">
                        Please enter the 6 digit OTP sent to <span className="font-bold text-orange-400">{email || "your email"}</span>
                    </p>

                    <div className="flex justify-center gap-3 mb-8">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputsRef.current[index] = el)}
                                type="text"
                                inputMode="numeric"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(e.target.value, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                onPaste={handlePaste}
                                className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl font-bold rounded-xl border-2 border-orange-300 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-150"
                            />
                        ))}
                    </div>

                    <button
                        onClick={handleVerifyOtp}
                        disabled={loading}
                        className="w-full max-w-xs py-3 rounded-full font-semibold text-white bg-orange-500 shadow-lg hover:bg-orange-600 hover:shadow-xl active:scale-95 transition-all duration-200 disabled:opacity-60"
                    >
                        {loading ? "Verifying..." : "Verify OTP"}
                    </button>

                    <p className="text-xs text-gray-400 text-center mt-4">OTP will expire in 10 minutes</p>
                    
                    <button className="mt-6 text-sm font-bold text-orange-500 hover:underline" onClick={() => setOtp(["", "", "", "", "", ""])}>
                        Resend OTP
                    </button>
                </div>
            </div>
        </div>
    );
}