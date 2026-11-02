

import React from "react";
import { Mail } from "lucide-react"; // Changed Phone to Mail icon
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendLoginOtp } from "../../redux/slice/auth/loginSlice";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { loading } = useSelector((state) => state.login);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const formik = useFormik({
    initialValues: {
      email: "", // 1. Changed field name to email
    },

    validate: (values) => {
      const errors = {};
      // 2. Updated validation for Email
      if (!values.email) {
        errors.email = "Email address is required";
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = "Invalid email address";
      }
      return errors;
    },

    onSubmit: async (values) => {
      // 3. Passing email to the action
      const resultAction = await dispatch(sendLoginOtp(values.email));
      
      if (sendLoginOtp.fulfilled.match(resultAction)) {
        navigate("/verify-otp");
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-50 via-white to-blue-50">
      <div className="flex w-full h-screen overflow-hidden bg-white transition-transform duration-300">

        {/* LEFT SECTION */}
        <div className="hidden md:flex w-1/2 p-10 items-center justify-center bg-linear-to-br from-orange-400 via-orange-500 to-blue-500 animate-gradient">
          <img
            src="https://olx-admin.netlify.app/assets/Tablet%20login-rafiki-CPRoiH2-.png"
            alt="login"
            className="w-full max-w-2xl drop-shadow-2xl"
          />
        </div>

        {/* RIGHT SECTION */}
        <div className="w-full md:w-1/2 p-8 md:p-12 bg-white flex flex-col justify-center items-center">
          <h2 className="text-3xl font-bold text-orange-500 mb-2 text-center">
            Welcome Back
          </h2>

          <p className="text-gray-500 font-medium mb-8 text-center">
            Login with your registered email address
          </p>

          <form onSubmit={formik.handleSubmit} className="space-y-6 w-full max-w-md">
            
            {/* EMAIL INPUT */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email Address
              </label>

              <div className={`flex items-center border rounded-lg px-3 py-2 transition-all duration-200 
                ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-orange-400'}
                focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-200`}>

                {/* Updated Icon */}
                <Mail className="text-orange-500 w-5 h-5" />

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full px-3 outline-none text-gray-700 placeholder-gray-400"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>

              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-xs mt-1 italic ml-1">
                  {formik.errors.email}
                </p>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full font-semibold text-white bg-orange-500 shadow-lg hover:bg-orange-600 active:scale-95 transition-all duration-200 disabled:opacity-60 flex justify-center items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending OTP...
                </>
              ) : "Send OTP"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}