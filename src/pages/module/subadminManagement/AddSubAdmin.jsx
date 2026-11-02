

import { useState } from "react";
import { Eye, EyeOff,LayoutDashboard } from "lucide-react";
import { NavLink } from "react-router-dom";
const AddSubAdmin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleFormSubmit=(e)=>{
    e.preventDefault();
  }
  return (
    <>
    <div className="p-6">
    {/* HEADER */}
            <div className="bg-gradient-to-r from-[#F7941D] to-[#0072BC]bg-linear-to-r from-orange-500 to-orange-600
                      rounded-2xl p-6 shadow-lg mb-8">
                <h1 className="text-2xl font-semibold text-white">Add Sub-Admin</h1>

                <div className="text-[15px] text-white flex items-center gap-2 mt-3">
                   <NavLink 
          to="/dashboard" 
          className="bg-white/20 px-3 py-1 rounded-lg hover:bg-white/30 hover:text-white transition-all flex items-center gap-2"
        >
          <LayoutDashboard className="w-4 h-4" /> Dashboard
        </NavLink>
                    <span>&gt;</span>
                     <NavLink to="/subadminmanagement">
                     <span className="hover:text-gray-200">SubAdmin Management</span>
                    </NavLink>
                    <span>&gt;</span>
                    <span>Add Sub-Admin</span>
                </div>
            </div>
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      
      <div className="w-full max-w-full bg-white rounded-2xl shadow-lg p-8">
        
     
        {/* Form */}
        <form className="space-y-5" onClick={handleFormSubmit}>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter Full Name"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Number
            </label>
            <input
              type="tel"
              placeholder="Enter Contact Number"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter Email Address"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Select Role</option>
              <option>Manager</option>
              <option>Agent</option>
              <option>Support</option>
            </select>
          </div>

          {/* Permissions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Permissions
            </label>
            <select className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Select Permission</option>
              <option>View Leads</option>
              <option>Manage Users</option>
              <option>Full Access</option>
            </select>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-6 py-3 rounded-xl text-white font-semibold text-lg 
                       bg-gradient-to-r from-[#0B1C2D] to-[#0E5FD8]
                       shadow-md hover:opacity-90 active:scale-[0.98] transition"
          >
            Save Sub-Account
          </button>

        </form>
      </div>
    </div>
    </div>
    </>
  );
};

export default AddSubAdmin;
