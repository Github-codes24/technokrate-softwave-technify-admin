


import { Eye, EyeOff, ArrowLeft, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ResetpasswordImg from "../../assets/Reset password-bro (1).png";
import { useFormik } from "formik";

export default function ResetPassword() {
    const navigate = useNavigate();

    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    const formik = useFormik({
        initialValues: {
            password: "",
            confirmPassword: "",
        },

        validate: (values) => {
            const errors = {};

            if (!values.password) {
                errors.password = "Password is required";
            } else if (values.password.length < 6) {
                errors.password = "Password must be at least 6 characters";
            }

            if (!values.confirmPassword) {
                errors.confirmPassword = "Confirm password is required";
            } else if (values.password !== values.confirmPassword) {
                errors.confirmPassword = "Passwords do not match";
            }

            return errors;
        },

        onSubmit: (values) => {
            // Simulated Success
            toast.success("Password reset successfully 🎉");
            setTimeout(() => {
                navigate("/"); // Adjust path to login if needed
            }, 1000);
        },
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-orange-50 px-4">
            <div className="flex w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-orange-100">

                {/* 🔹 LEFT IMAGE SECTION (Orange Gradient) */}
                <div className="hidden md:flex w-1/2 p-12 items-center justify-center bg-gradient-to-br from-orange-400 to-orange-600">
                    <div className="text-center">
                        <img
                            src={ResetpasswordImg}
                            alt="reset password"
                            className="w-full max-w-sm drop-shadow-2xl brightness-110"
                        />
                        <h3 className="text-white text-2xl font-bold mt-8">Secure Your Account</h3>
                        <p className="text-orange-100 mt-2 font-medium text-sm">Almost there! Just set your new password.</p>
                    </div>
                </div>

                {/* 🔹 RIGHT FORM SECTION */}
                <div className="w-full md:w-1/2 px-8 py-16 md:px-16 flex flex-col justify-center bg-white">
                    <div className="mb-10 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                            <ShieldCheck className="text-orange-500 w-8 h-8" />
                            <h2 className="text-4xl font-black text-orange-500">
                                Reset Password
                            </h2>
                        </div>
                        <p className="text-gray-500 font-semibold">
                            Create a new strong password for your account
                        </p>
                    </div>

                    <form onSubmit={formik.handleSubmit} className="space-y-6">
                        {/* NEW PASSWORD */}
                        <div>
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                                New Password
                            </label>
                            <div className={`flex items-center border-2 rounded-2xl px-4 mt-2 transition-all duration-300 focus-within:ring-4 focus-within:ring-orange-100 ${formik.touched.password && formik.errors.password ? 'border-red-300' : 'border-gray-100 focus-within:border-orange-400'}`}>
                                <input
                                    type={showPass ? "text" : "password"}
                                    name="password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Enter new password"
                                    className="w-full py-4 outline-none font-medium text-gray-700 bg-transparent"
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="text-gray-400 hover:text-orange-500">
                                    {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {formik.touched.password && formik.errors.password && (
                                <p className="text-red-500 text-xs mt-2 font-bold ml-2 italic">
                                    {formik.errors.password}
                                </p>
                            )}
                        </div>

                        {/* CONFIRM PASSWORD */}
                        <div>
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                                Confirm Password
                            </label>
                            <div className={`flex items-center border-2 rounded-2xl px-4 mt-2 transition-all duration-300 focus-within:ring-4 focus-within:ring-orange-100 ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-300' : 'border-gray-100 focus-within:border-orange-400'}`}>
                                <input
                                    type={showConfirmPass ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formik.values.confirmPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Confirm your password"
                                    className="w-full py-4 outline-none font-medium text-gray-700 bg-transparent"
                                />
                                <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="text-gray-400 hover:text-orange-500">
                                    {showConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                <p className="text-red-500 text-xs mt-2 font-bold ml-2 italic">
                                    {formik.errors.confirmPassword}
                                </p>
                            )}
                        </div>

                        {/* SUBMIT BUTTON */}
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-orange-200 hover:shadow-orange-300 transition-all active:scale-95 flex items-center justify-center gap-3"
                        >
                            Update Password
                        </button>

                        {/* BACK BUTTON */}
                        <div className="flex justify-center mt-6">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="group flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-orange-500 transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                                    <ArrowLeft size={16} />
                                </div>
                                Go Back
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}