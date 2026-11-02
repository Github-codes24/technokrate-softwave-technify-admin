// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams, NavLink } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import {
//   User,
//   Mail,
//   Phone,
//   MapPin,
//   Save,
//   X,
//   Percent,
//   ArrowLeft,
// } from "lucide-react";
// import { fetchVendorById } from "../../../redux/slice/vendors/getVendorDetailsSlice";
// import {
//   updateVendor,
//   resetUpdateState,
// } from "../../../redux/slice/vendors/updateVendor";
// import LoaderSpinner from "../../../components/uiElement/LoaderSpinner";

// const EditVendor = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   // Redux State
//   const { vendor, loading: fetchLoading } = useSelector(
//     (state) => state.vendorDetails,
//   );
//   const {
//     loading: updateLoading,
//     success,
//     error: updateError,
//   } = useSelector((state) => state.updateVendor);

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     occupation: "",
//     gender: "male",
//     teamCode: "",
//     commissionRate: "",
//     state: "",
//     city: "",
//   });

//   // 1. Fetch data on mount
//   useEffect(() => {
//     dispatch(fetchVendorById(id));
//   }, [id, dispatch]);

//   // 2. Sync vendor data to local state
//   useEffect(() => {
//     if (vendor) {
//       setFormData({
//         name: vendor.name || "",
//         email: vendor.email || "",
//         phone: vendor.phone || "",
//         occupation: vendor.occupation || "",
//         gender: vendor.gender || "male",
//         teamCode: vendor.teamCode || "",
//         commissionRate: vendor.commissionRate || "",
//         state: vendor.state || "",
//         city: vendor.city || "",
//       });
//     }
//   }, [vendor]);

//   // 3. Handle Success & Redirect
//   useEffect(() => {
//     if (success) {
//       toast.success("Vendor updated successfully!");
//       setTimeout(() => {
//         dispatch(resetUpdateState());
//         navigate("/vendor");
//       }, 1500);
//     }
//     if (updateError) {
//       toast.error(updateError);
//       dispatch(resetUpdateState());
//     }
//   }, [success, updateError, navigate, dispatch]);

//   // 🛡️ Validation Logic inside handleChange
//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     // A. Text Only Fields (Name, Occupation, State, City)
//     if (["name", "occupation", "state", "city"].includes(name)) {
//       const textOnly = value.replace(/[^a-zA-Z\s]/g, ""); // Allow only letters and spaces
//       setFormData((prev) => ({ ...prev, [name]: textOnly }));
//       return;
//     }

//     // B. Phone Number (Digits Only, Max 10)
//     // if (name === "phone") {
//     //   const numbersOnly = value.replace(/\D/g, ""); // Allow only digits
//     //   if (numbersOnly.length <= 10) {
//     //     setFormData((prev) => ({ ...prev, [name]: numbersOnly }));
//     //   }
//     //   return;
//     // }

//     // C. Commission Rate (0 to 100)
//     // if (name === "commissionRate") {
//     //   if (value === "" || (Number(value) >= 0 && Number(value) <= 100)) {
//     //     setFormData((prev) => ({ ...prev, [name]: value }));
//     //   }
//     //   return;
//     // }

//     if (name === "commissionRate") {
//       // 1. Sirf numbers aur ek single dot allow karne ke liye Regex
//       const regex = /^[0-9]*\.?[0-9]*$/;

//       if (value === "" || regex.test(value)) {
//         // 2. Check ki value 100 se zyada na ho
//         if (value === "" || Number(value) <= 100) {
//           setFormData((prev) => ({ ...prev, [name]: value }));
//         }
//       }
//       return;
//     }

//     // Default for Email and Select fields
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // // Final Checks before dispatch
//     // if (formData.phone.length !== 10) {
//     //   toast.error("Phone number must be exactly 10 digits");
//     //   return;
//     // }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(formData.email)) {
//       toast.error("Please enter a valid email address");
//       return;
//     }

//     // Convert commission to Number before sending
//     const finalData = {
//       ...formData,
//       commissionRate: Number(formData.commissionRate),
//     };

//     dispatch(updateVendor({ id, vendorData: finalData }));
//   };

//   if (fetchLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <LoaderSpinner />
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 min-h-screen">
//       <ToastContainer position="top-right" autoClose={1500} />

//       {/* Header Section */}
//       <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 shadow-xl mb-6 text-white">
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//           <div>
//             <h1 className="text-2xl font-bold flex items-center gap-3">
//               <User className="w-7 h-7" />
//               Edit Vendor
//             </h1>

//             <div className="text-sm text-orange-100 mt-5 flex flex-wrap items-center gap-2">
//               <NavLink
//                 to="/dashboard"
//                 className="hover:text-white transition-colors"
//               >
//                 <span className="bg-white/20 px-3 py-1 rounded-lg">
//                   Dashboard
//                 </span>
//               </NavLink>
//               <span className="text-white/60">›</span>
//               <NavLink
//                 to="/vendor"
//                 className="hover:text-white transition-colors"
//               >
//                 Vendor Management
//               </NavLink>
//               <span className="text-white/60">›</span>
//               <span className="text-white font-medium">Edit Vendor</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       <button
//         onClick={() => navigate("/vendor")}
//         className="mb-4 flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold transition"
//       >
//         <ArrowLeft className="w-5 h-5" />
//         Back to All Vendors
//       </button>

//       <div className="max-w-full mx-auto">
//         <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
//           <form onSubmit={handleSubmit} className="space-y-8">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* Name */}
//               <div className="space-y-2">
//                 <label className="block text-sm font-semibold text-gray-700">
//                   Name
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 outline-none"
//                 />
//               </div>

//               {/* Email */}
//               <div className="space-y-2">
//                 <label className="block text-sm font-semibold text-gray-700">
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 outline-none"
//                 />
//               </div>

//               {/* Phone */}
//               <div className="space-y-2">
//                 <label className="block text-sm font-semibold text-gray-700">
//                   Phone
//                 </label>
//                 <input
//                   type="text"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 outline-none"
//                 />
//               </div>

//               {/* Occupation */}
//               <div className="space-y-2">
//                 <label className="block text-sm font-semibold text-gray-700">
//                   Occupation
//                 </label>
//                 <input
//                   type="text"
//                   name="occupation"
//                   value={formData.occupation}
//                   onChange={handleChange}
//                   placeholder="e.g. Distributor"
//                   className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 outline-none"
//                 />
//               </div>

//               {/* Commission Rate */}
//               <div className="space-y-2">
//                 <label className="block text-sm font-semibold text-gray-700">
//                   Commission Rate (%) <span className="text-orange-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="number"
//                     name="commissionRate"
//                     value={formData.commissionRate}
//                     onChange={handleChange}
//                     placeholder="e.g. 10"
//                     step="0.01"
//                     required
//                     className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 outline-none"
//                   />
//                   <Percent className="absolute right-4 top-3.5 text-gray-400 w-4 h-4" />
//                 </div>
//               </div>

//               {/* Gender */}
//               <div className="space-y-2">
//                 <label className="block text-sm font-semibold text-gray-700">
//                   Gender <span className="text-orange-500">*</span>
//                 </label>
//                 <select
//                   name="gender"
//                   value={formData.gender}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 outline-none bg-white"
//                 >
//                   <option value="male">Male</option>
//                   <option value="female">Female</option>
//                   <option value="other">Other</option>
//                 </select>
//               </div>

//               {/* State */}
//               <div className="space-y-2">
//                 <label className="block text-sm font-semibold text-gray-700">
//                   State
//                 </label>
//                 <input
//                   type="text"
//                   name="state"
//                   value={formData.state}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 outline-none"
//                 />
//               </div>

//               {/* City */}
//               <div className="space-y-2">
//                 <label className="block text-sm font-semibold text-gray-700">
//                   City
//                 </label>
//                 <input
//                   type="text"
//                   name="city"
//                   value={formData.city}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 outline-none"
//                 />
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex justify-end gap-4 pt-8 border-t border-gray-200">
//               <button
//                 type="button"
//                 onClick={() => navigate("/vendor")}
//                 className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all font-medium"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={updateLoading}
//                 className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 disabled:opacity-50"
//               >
//                 {updateLoading ? (
//                   <>
//                     <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                     Updating...
//                   </>
//                 ) : (
//                   <>
//                     <Save className="w-5 h-5" />
//                     Update Vendor
//                   </>
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditVendor;


import React, { useEffect, useState } from "react";
import { useNavigate, useParams, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  User,
  Save,
  Percent,
  ArrowLeft,
} from "lucide-react";
import { fetchVendorById } from "../../../redux/slice/vendors/getVendorDetailsSlice";
import {
  updateVendor,
  resetUpdateState,
} from "../../../redux/slice/vendors/updateVendor";
import LoaderSpinner from "../../../components/uiElement/LoaderSpinner";

const EditVendor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { vendor, loading: fetchLoading } = useSelector(
    (state) => state.vendorDetails
  );
  const {
    loading: updateLoading,
    success,
    error: updateError,
  } = useSelector((state) => state.updateVendor);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    occupation: "",
    gender: "male",
    teamCode: "",
    commissionRate: "",
    state: "",
    city: "",
  });

  // 1. Fetch vendor data on mount
  useEffect(() => {
    dispatch(fetchVendorById({ id, agentPage: 1, leadPage: 1, agentLimit: 5, leadLimit: 5 }));
  }, [id, dispatch]);

  // 2. Autofill form from vendor data
  useEffect(() => {
    const vendorData = vendor?.data || vendor;
    if (vendorData) {
      setFormData({
        name: vendorData.name || "",
        email: vendorData.email || "",
        phone: vendorData.phone || "",
        occupation: vendorData.occupation || "",
        gender: vendorData.gender || "male",
        teamCode: vendorData.teamCode || "",
        commissionRate: vendorData.commissionRate ?? "",
        state: vendorData.state || "",
        city: vendorData.city || "",
      });
    }
  }, [vendor]);

  // 3. Handle success/error
  useEffect(() => {
    if (success) {
      toast.success("Vendor updated successfully!");
      setTimeout(() => {
        dispatch(resetUpdateState());
        navigate("/vendor");
      }, 1500);
    }
    if (updateError) {
      toast.error(updateError);
      dispatch(resetUpdateState());
    }
  }, [success, updateError, navigate, dispatch]);

  // Only commissionRate is editable
  const handleCommissionChange = (e) => {
    const value = e.target.value;
    const regex = /^[0-9]*\.?[0-9]*$/;
    if (value === "" || (regex.test(value) && Number(value) <= 100)) {
      setFormData((prev) => ({ ...prev, commissionRate: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      updateVendor({
        id,
        vendorData: { commissionRate: Number(formData.commissionRate) },
      })
    );
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoaderSpinner />
      </div>
    );
  }

  // Reusable read-only field
  const ReadOnlyField = ({ label, value }) => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">{label}</label>
      <input
        type="text"
        value={value}
        readOnly
        disabled
        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 outline-none cursor-not-allowed"
      />
    </div>
  );

  return (
    <div className="p-6 min-h-screen">
      <ToastContainer position="top-right" autoClose={1500} />

      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 shadow-xl mb-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <User className="w-7 h-7" />
              Edit Vendor
            </h1>
            <div className="text-sm text-orange-100 mt-5 flex flex-wrap items-center gap-2">
              <NavLink to="/dashboard" className="hover:text-white transition-colors">
                <span className="bg-white/20 px-3 py-1 rounded-lg">Dashboard</span>
              </NavLink>
              <span className="text-white/60">›</span>
              <NavLink to="/vendor" className="hover:text-white transition-colors">
                Vendor Management
              </NavLink>
              <span className="text-white/60">›</span>
              <span className="text-white font-medium">Edit Vendor</span>
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
          {/* Info banner */}
        

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ReadOnlyField label="Name" value={formData.name} />
              <ReadOnlyField label="Email" value={formData.email} />
              <ReadOnlyField label="Phone" value={formData.phone} />
              <ReadOnlyField label="Occupation" value={formData.occupation} />

              {/* Commission Rate — ONLY EDITABLE FIELD */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Commission Rate (%) <span className="text-orange-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="commissionRate"
                    value={formData.commissionRate}
                    onChange={handleCommissionChange}
                    placeholder="e.g. 10"
                    step="0.01"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-orange-300 focus:ring-2 focus:ring-orange-400 outline-none bg-white"
                  />
                  <Percent className="absolute right-4 top-3.5 text-orange-400 w-4 h-4" />
                </div>
              </div>

              <ReadOnlyField label="Gender" value={formData.gender} />
              <ReadOnlyField label="State" value={formData.state} />
              <ReadOnlyField label="City" value={formData.city} />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/vendor")}
                className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateLoading}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 disabled:opacity-50"
              >
                {updateLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Update Vendor
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditVendor;