

import { Mail, Lock, ArrowLeft, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
// Note: Make sure the path to your image is correct
import ForgotImg from "../../assets/Forgot password-bro.png";

export default function ForgetPassword() {
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();

    const generateOtp = () => {
        return Math.floor(1000 + Math.random() * 9000);
    };

    const formik = useFormik({
        initialValues: {
            email: "",
        },

        validate: (values) => {
            const errors = {};

            if (!values.email) {
                errors.email = "Email is required";
            } else if (!/\S+@\S+\.\S+/.test(values.email)) {
                errors.email = "Invalid email address";
            }

            return errors;
        },

        onSubmit: async (values) => {
            const generatedOtp = generateOtp();
            setOtp(generatedOtp);

            localStorage.setItem("resetOtp", generatedOtp.toString());
            localStorage.setItem("resetEmail", values.email);

            const toastId = toast.loading("Sending OTP to email...");

            try {
                setLoading(true);
                await new Promise((resolve) => setTimeout(resolve, 1500));

                toast.update(toastId, {
                    render: "OTP sent successfully",
                    type: "success",
                    isLoading: false,
                    autoClose: 1500,
                });

                setTimeout(() => setOtpSent(true), 1600);
            } catch {
                toast.update(toastId, {
                    render: "Failed to send OTP",
                    type: "error",
                    isLoading: false,
                });
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-orange-50 px-4">
            {otpSent ? (
                /* 🔹 OTP SUCCESS UI (Orange Theme) */
                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-10 text-center border border-orange-100">
                    <div className="w-20 h-20 mx-auto rounded-2xl bg-orange-500 flex items-center justify-center mb-6 shadow-lg shadow-orange-200">
                        <Lock className="text-white w-10 h-10" />
                    </div>

                    <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
                        OTP Sent!
                    </h2>

                    <p className="text-gray-500 mb-8 font-medium">
                        Use the code below to verify your email
                    </p>

                    <div className="bg-orange-50 rounded-2xl p-6 mb-8 border border-orange-100">
                        <p className="text-xs text-orange-600 font-bold uppercase tracking-widest mb-2">Your OTP Code</p>
                        <p className="text-5xl font-black text-orange-600 tracking-[0.5em] ml-2">
                            {otp}
                        </p>
                        <p className="text-xs text-gray-500 mt-4 italic font-medium">
                            Sent to: {formik.values.email}
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/verify-otp")}
                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-orange-200 hover:scale-[1.02] transition-transform active:scale-95"
                    >
                        Continue to Verification
                    </button>
                    
                    <button 
                        onClick={() => setOtpSent(false)}
                        className="mt-6 text-sm font-bold text-orange-600 flex items-center justify-center gap-2 mx-auto hover:underline"
                    >
                        <ArrowLeft size={16} /> Use different email
                    </button>
                </div>
            ) : (
                /* 🔹 EMAIL FORM UI (Orange Theme) */
                <div className="flex w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-orange-50">

                    {/* LEFT IMAGE SECTION */}
                    <div className="hidden md:flex w-1/2 p-12 items-center justify-center bg-gradient-to-br from-orange-400 to-orange-600">
                        <div className="text-center">
                           <img
                                src={ForgotImg}
                                alt="forget password"
                                className="w-full max-w-sm drop-shadow-2xl brightness-110"
                            />
                            <h3 className="text-white text-2xl font-bold mt-8">Don't worry!</h3>
                            <p className="text-orange-100 mt-2">We'll help you get back to your account.</p>
                        </div>
                    </div>

                    {/* RIGHT FORM SECTION */}
                    <div className="w-full md:w-1/2 px-8 py-16 md:px-16 flex flex-col justify-center bg-white">
                        <div className="mb-10 text-center md:text-left">
                            <h2 className="text-4xl font-black text-orange-500 mb-3">
                                Forget Password?
                            </h2>
                            <p className="text-gray-500 font-semibold">
                                Enter your email address to receive a 4-digit security code.
                            </p>
                        </div>

                        <form onSubmit={formik.handleSubmit} className="space-y-8">
                            <div>
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                                    Email Address
                                </label>

                                <div className={`flex items-center border-2 rounded-2xl px-4 mt-2 transition-all duration-300 focus-within:ring-4 focus-within:ring-orange-100 ${formik.touched.email && formik.errors.email ? 'border-red-300' : 'border-gray-100 focus-within:border-orange-400'}`}>
                                    <Mail className="text-orange-500 w-5 h-5" />
                                    <input
                                        type="email"
                                        name="email"
                                        className="w-full px-4 py-4 outline-none font-medium text-gray-700 bg-transparent"
                                        placeholder="name@example.com"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </div>

                                {formik.touched.email && formik.errors.email && (
                                    <p className="text-red-500 text-xs mt-2 font-bold ml-2 italic">
                                        {formik.errors.email}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-orange-200 hover:shadow-orange-300 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Sending...
                                    </span>
                                ) : (
                                    <>
                                        Get OTP <Send size={18} />
                                    </>
                                )}
                            </button>

                            <button 
                                type="button"
                                onClick={() => navigate(-1)}
                                className="w-full text-center text-sm font-bold text-gray-400 hover:text-orange-500 transition-colors"
                            >
                                Back to Login
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}