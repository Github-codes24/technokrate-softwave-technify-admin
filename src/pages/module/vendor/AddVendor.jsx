// import { LayoutDashboard, PlusCircle, User, Phone, Mail, MapPin, Briefcase, Users, Loader2, Percent, Building } from "lucide-react";
// import React, { useState, useEffect } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { useDispatch, useSelector } from "react-redux";
// import { createVendor, resetState } from "../../../redux/slice/vendors/addVendorSlice";
// const AddVendor = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { loading, success, error } = useSelector((state) => state.addVendor);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     occupation: "",
//     gender: "male",
//     // teamCode: "",
//     state: "",
//     city: "",
//     commissionRate: "", // New required field for API
//   });

//   useEffect(() => {
//     if (success) {
//       toast.success("Vendor Created Successfully!", {
//         autoClose: 2000,
//       });

//       const timer = setTimeout(() => {
//         dispatch(resetState());
//         navigate("/vendor");
//       }, 2000);

//       return () => clearTimeout(timer);
//     }
//     if (error) {
//       toast.error(error);
//       dispatch(resetState());
//     }
//   }, [success, error, navigate, dispatch]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     dispatch(createVendor(formData));
//   };

//   return (
//     <div className="p-6">
//       <div className="bg-linear-to-r from-orange-500 to-orange-600 rounded-2xl p-6 shadow-xl mb-8">
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//           <div>
//             <h1 className="text-2xl font-bold text-white flex items-center gap-3">
//                <PlusCircle className="w-7 h-7" /> Add New Vendor
//             </h1>
//             <div className="text-sm text-orange-100 flex items-center gap-2 mt-3">
//               <NavLink to="/dashboard" className="bg-white/20 px-3 py-1 rounded-lg hover:text-white">Dashboard</NavLink>
//               <span className="text-white/60">›</span>
//               <span className="text-white font-medium">Add Vendor</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-6xl mx-auto">
//         <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
//           <form onSubmit={handleSubmit} className="space-y-8">
//             <div className="space-y-6">
//               <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//                 <User className="w-5 h-5 text-orange-500" /> Basic Information
//               </h3>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <label className="block text-sm font-semibold text-gray-700">Full Name *</label>
//                   <div className="relative">
//                     <input type="text" name="name" value={formData.name} onChange={handleChange} required
//                       className="w-full px-4 py-3 pl-11 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:outline-none transition-all" />
//                     <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <label className="block text-sm font-semibold text-gray-700">Email *</label>
//                   <div className="relative">
//                     <input type="email" name="email" value={formData.email} onChange={handleChange} required
//                       className="w-full px-4 py-3 pl-11 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:outline-none transition-all" />
//                     <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <label className="block text-sm font-semibold text-gray-700">Phone *</label>
//                   <div className="relative">
//                     <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required
//                       className="w-full px-4 py-3 pl-11 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:outline-none transition-all" />
//                     <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//                   </div>
//                 </div>

//                 {/* Commission Rate Field Added Here */}
//                 <div className="space-y-2">
//                   <label className="block text-sm font-semibold text-gray-700">Commission Rate (%) *</label>
//                   <div className="relative">
//                     <input type="number" name="commissionRate" value={formData.commissionRate} onChange={handleChange} required
//                       placeholder="e.g. 10"
//                       className="w-full px-4 py-3 pl-11 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:outline-none transition-all" />
//                     <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <label className="block text-sm font-semibold text-gray-700">Occupation</label>
//                   <div className="relative">
//                     <input type="text" name="occupation" placeholder="enter occupation" value={formData.occupation} onChange={handleChange}
//                       className="w-full px-4 py-3 pl-11 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:outline-none transition-all" />
//                     <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <label className="block text-sm font-semibold text-gray-700">Gender</label>
//                   <select name="gender" value={formData.gender} onChange={handleChange}
//                     className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:outline-none transition-all">
//                     <option value="male">Male</option>
//                     <option value="female">Female</option>
//                     <option value="other">Other</option>
//                   </select>
//                 </div>

//                 {/* <div className="space-y-2">
//                   <label className="block text-sm font-semibold text-gray-700">Team Code</label>
//                   <div className="relative">
//                     <input type="text" name="teamCode" value={formData.teamCode} onChange={handleChange}
//                       className="w-full px-4 py-3 pl-11 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:outline-none transition-all" />
//                     <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//                   </div>
//                 </div> */}

//                 <div className="space-y-2">
//                   <label className="block text-sm font-semibold text-gray-700">State</label>
//                   <div className="relative">
//                     <input type="text" name="state" value={formData.state} onChange={handleChange}
//                       className="w-full px-4 py-3 pl-11 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:outline-none transition-all" />
//                     <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <label className="block text-sm font-semibold text-gray-700">City</label>
//                   <div className="relative">
//                     <input type="text" name="city" value={formData.city} onChange={handleChange}
//                       className="w-full px-4 py-3 pl-11 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:outline-none transition-all" />
//                     <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="flex justify-end gap-4 pt-8 border-t border-gray-200">
//               <button type="button" onClick={() => navigate("/vendor")}
//                 className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all">
//                 Cancel
//               </button>
//               <button type="submit" disabled={loading}
//                 className="px-8 py-3 bg-linear-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg disabled:opacity-50 flex items-center gap-2 transition-all">
//                 {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <PlusCircle className="w-5 h-5" />}
//                 Add Vendor
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddVendor;

// input validation code
import {
  LayoutDashboard,
  PlusCircle,
  User,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Users,
  Loader2,
  Percent,
  Building,
  ArrowLeft,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  createVendor,
  resetState,
} from "../../../redux/slice/vendors/addVendorSlice";

const AddVendor = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.addVendor);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    occupation: "",
    gender: "male",
    state: "",
    city: "",
    commissionRate: "",
  });

  useEffect(() => {
    if (success) {
      toast.success("Vendor Created Successfully!", { autoClose: 2000 });
      const timer = setTimeout(() => {
        dispatch(resetState());
        navigate("/vendor");
      }, 2000);
      return () => clearTimeout(timer);
    }
    if (error) {
      toast.error(error);
      dispatch(resetState());
    }
  }, [success, error, navigate, dispatch]);

  // 🛡️ Enhanced Validation Logic
  const handleChange = (e) => {
    const { name, value } = e.target;

    // 1. Text Only Validation (Name, Occupation, State, City)
    if (["name", "occupation", "state", "city"].includes(name)) {
      const textOnly = value.replace(/[^a-zA-Z\s]/g, ""); // Sirf letters allow honge
      setFormData((prev) => ({ ...prev, [name]: textOnly }));
      return;
    }

    // 2. Number Only Validation (Phone)
    if (name === "phone") {
      const numbersOnly = value.replace(/\D/g, ""); // Sirf digits allow honge
      if (numbersOnly.length <= 10) {
        // Max 10 digits
        setFormData((prev) => ({ ...prev, [name]: numbersOnly }));
      }
      return;
    }

    // 3. Commission Rate Validation (0 to 100)
    if (name === "commissionRate") {
      const val = value === "" ? "" : Number(value);
      if (val === "" || (val >= 0 && val <= 100)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
      return;
    }

    // Default for others (Email, Gender)
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Final Validation before dispatch
    if (formData.phone.length !== 10) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Dispatching with formatted data
    dispatch(
      createVendor({
        ...formData,
        commissionRate: Number(formData.commissionRate),
      }),
    );
  };

  return (
    <div className="p-6">
      <div className="bg-linear-to-r from-orange-500 to-orange-600 rounded-2xl p-6 shadow-xl mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <PlusCircle className="w-7 h-7" /> Add New Vendor
            </h1>
            <div className="text-sm text-orange-100 flex items-center gap-2 mt-3">
              <NavLink
                to="/dashboard"
                className="bg-white/20 px-3 py-1 rounded-lg hover:text-white transition-all"
              >
                Dashboard
              </NavLink>
              <span className="text-white/60">›</span>
              <span className="text-white font-medium">Add Vendor</span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate("/vendor")}
        className="mb-4 flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold transition"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to All Vendors
      </button>

      <div className="max-w-full mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <User className="w-5 h-5 text-orange-500" /> Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Full Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter full name"
                      className="w-full px-4 py-3 pl-11 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:outline-none transition-all"
                    />
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Email *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="example@mail.com"
                      className="w-full px-4 py-3 pl-11 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:outline-none transition-all"
                    />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Phone *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="10 digit number"
                      className="w-full px-4 py-3 pl-11 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:outline-none transition-all"
                    />
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Commission Rate (%) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="commissionRate"
                      value={formData.commissionRate}
                      onChange={handleChange}
                      required
                      placeholder="e.g 10"
                      className="w-full px-4 py-3 pl-11 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:outline-none transition-all"
                    />
                    <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Occupation
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleChange}
                      placeholder="Enter occupation"
                      className="w-full px-4 py-3 pl-11 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:outline-none transition-all"
                    />
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:outline-none transition-all"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    State
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Enter state"
                      className="w-full px-4 py-3 pl-11 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:outline-none transition-all"
                    />
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    City
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Enter city"
                      className="w-full px-4 py-3 pl-11 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:outline-none transition-all"
                    />
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/vendor")}
                className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-linear-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg disabled:opacity-50 flex items-center gap-2 transition-all"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <PlusCircle className="w-5 h-5" />
                )}
                Add Vendor
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddVendor;
