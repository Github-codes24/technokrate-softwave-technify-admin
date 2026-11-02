import React, { useState, useRef } from "react";
import { ShieldCheck, ArrowRight, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminVerifyOtp = ({ email = "admin@softwave.co.in", onVerify }) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  const navigate = useNavigate();
  // Handle Input Change
  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  // Handle Backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalOtp = otp.join("");
    if (finalOtp.length < 6) return alert("Please enter full OTP");

    setLoading(true);
    // Simulating API delay
    setTimeout(() => {
      setLoading(false);
      navigate("/edit-profile")
      if (onVerify) onVerify(finalOtp);
    }, 2000);
  };

  return (
    <div className="mt-10 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        
        {/* Top Accent Bar */}
        <div className="h-2 bg-[#FDB913]"></div>

        <div className="p-8 md:p-10">
          {/* Icon & Heading */}
          <div className="flex flex-col items-center mb-8">
            <div className="bg-[#004A97]/10 p-4 rounded-2xl mb-4">
              <Lock className="w-10 h-10 text-[#004A97]" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#004A97]">Verify OTP</h2>
            <p className="text-gray-500 text-sm text-center mt-2">
              We've sent a 6-digit code to <br />
              <span className="font-semibold text-gray-700">{email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* OTP Inputs */}
            <div className="flex justify-between gap-2">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  ref={(el) => (inputRefs.current[index] = el)}
                  value={data}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-14 border-2 rounded-xl text-center text-xl font-bold text-[#004A97] focus:border-[#FDB913] focus:ring-0 outline-none transition-all bg-slate-50 border-gray-200"
                />
              ))}
            </div>

            {/* Action Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg ${
                loading ? "bg-gray-400" : "bg-[#004A97] hover:bg-[#003670] active:scale-95"
              }`}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Verify Account <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Brand */}
        <div className="bg-slate-50 py-4 border-t border-gray-100 flex justify-center items-center gap-2">
          <ShieldCheck size={16} className="text-[#FDB913]" />
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            Secure Admin Access - Softwave Technify
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminVerifyOtp;