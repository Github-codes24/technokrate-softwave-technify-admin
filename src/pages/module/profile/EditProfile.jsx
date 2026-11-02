// import { useNavigate, NavLink } from "react-router-dom";
// import { Upload, LayoutDashboard } from "lucide-react";
// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { updateAdminProfile,resetStatus } from "../../../redux/slice/profile/editProfileSlice";

// const EditProfile = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   // Redux state
//   const { loading, success, error } = useSelector((state) => state.editProfile);

//   // Local state for form inputs
//   const [profileData, setProfileData] = useState({
//     name: "Lokesh Khetade",
//     phone: "9970365262",
//     email: "lokeshkhetade@gmail.com",
//     password: "",
//   });

//   // Profile image state
//   const [image, setImage] = useState(
//     "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa"
//   );

//   // Handle input change
//   const handleInputChange = (e) => {
//     const { id, value } = e.target;
//     // Map visual IDs to API keys if necessary
//     const keyMap = {
//       fullName: "name",
//       phone: "phone",
//       email: "email",
//       password: "password",
//     };
//     setProfileData((prev) => ({ ...prev, [keyMap[id] || id]: value }));
//   };

//   // Handle API Success/Error
//   useEffect(() => {
//     if (success) {
//       alert("Profile updated successfully!");
//       dispatch(resetStatus());
//       navigate("/profile");
//     }
//     if (error) {
//       alert(error);
//       dispatch(resetStatus());
//     }
//   }, [success, error, navigate, dispatch]);

//   const handleSave = () => {
//     // API body format as per your requirement
//     const body = {
//       name: profileData.name,
//       phone: profileData.phone,
//     };
//     dispatch(updateAdminProfile(body));
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const preview = URL.createObjectURL(file);
//       setImage(preview);
//     }
//   };

//   return (
//     <div className="p-6">
//       <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 shadow-xl mb-8">
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//           <div>
//             <h1 className="text-2xl font-bold text-white flex items-center gap-3">
//               <LayoutDashboard className="w-7 h-7" />
//               Edit Profile
//             </h1>
//             <div className="text-sm text-orange-100 flex items-center gap-2 mt-3">
//               <NavLink to="/dashboard" className="flex items-center gap-1 hover:text-white transition-colors">
//                 <span className="bg-white/20 px-3 py-1 rounded-lg">Dashboard</span>
//               </NavLink>
//               <span className="text-white/60">›</span>
//               <NavLink to="/profile" className="flex items-center gap-1 hover:text-white transition-colors">
//                 <span className="bg-white/20 px-3 py-1 rounded-lg">Profile</span>
//               </NavLink>
//               <span className="text-white font-medium">Edit Profile</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white rounded-xl shadow-md p-8 max-w-full mx-auto">
//         <div className="flex justify-center mb-10 relative">
//           <div className="relative">
//             <img src={image} alt="profile" className="w-32 h-32 rounded-full object-cover shadow-lg" />
//             <label className="absolute bottom-1 right-1 bg-gradient-to-r from-[#0B1C2D] to-[#0E5FD8] p-3 rounded-full cursor-pointer hover:bg-blue-700 transition">
//               <Upload className="text-white w-5 h-5" />
//               <input type="file" accept="image/*" hidden onChange={handleImageChange} />
//             </label>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="text-blue-600 font-medium">Full Name</label>
//             <input
//               id="fullName"
//               value={profileData.name}
//               onChange={handleInputChange}
//               className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//             />
//           </div>

//           <div>
//             <label className="text-blue-600 font-medium">Phone Number</label>
//             <input
//               id="phone"
//               value={profileData.phone}
//               onChange={handleInputChange}
//               className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//             />
//           </div>

//           <div>
//             <label className="text-blue-600 font-medium">Email Address</label>
//             <input
//               id="email"
//               value={profileData.email}
//               onChange={handleInputChange}
//               className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
//             />
//           </div>

//           <div>
//             <label className="text-blue-600 font-medium">Password</label>
//             <input
//               id="password"
//               type="password"
//               placeholder="********"
//               onChange={handleInputChange}
//               className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 "
//             />
//             <p className="text-sm text-gray-400 mt-1">Leave empty to keep current password</p>
//           </div>
//         </div>

//         <div className="flex justify-center gap-6 mt-12">
//           <button
//             onClick={() => navigate("/profile")}
//             className="px-10 py-3 rounded-lg border-2 border-blue-500 text-blue-600 hover:bg-gradient-to-r hover:text-white from-[#205081] to-[#1a62cf] transition transition-all duration-150 ease-in-out hover:shadow-xl active:scale-95 active:shadow-md focus:outline-none"
//           >
//             Cancel
//           </button>

//           <button
//             onClick={handleSave}
//             disabled={loading}
//             className="px-10 py-3 rounded-lg bg-gradient-to-r from-[#0B1C2D] to-[#0E5FD8] text-white font-medium shadow-lg transition-all duration-150 ease-in-out hover:shadow-xl active:scale-95 active:shadow-md focus:outline-none disabled:opacity-50"
//           >
//             {loading ? "Saving..." : "Save Profile"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditProfile;






// in this api also have existing data jo admin ka existing data rahega vo bhi aayega if verify otp
import { useNavigate, NavLink } from "react-router-dom";
import { Upload, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateAdminProfile, resetStatus } from "../../../redux/slice/profile/editProfileSlice";

const EditProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentAdmin = useSelector((state) => state.auth?.user || state.editProfile?.adminData);
  const { loading, success, error } = useSelector((state) => state.editProfile);

  // Local state for form inputs
  const [profileData, setProfileData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  // 2. Default data ko form mein load karna
  useEffect(() => {
    if (currentAdmin) {
      setProfileData({
        name: currentAdmin.name || "",
        phone: currentAdmin.phone || "",
        email: currentAdmin.email || "",
        password: "", // Password hamesha empty rakhein security ke liye
      });
      if (currentAdmin.profileImage) {
        setImage(currentAdmin.profileImage);
      }
    }
  }, [currentAdmin]);

  // Profile image state
  const [image, setImage] = useState(
    "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa"
  );

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    const keyMap = {
      fullName: "name",
      phone: "phone",
      email: "email",
      password: "password",
    };
    setProfileData((prev) => ({ ...prev, [keyMap[id] || id]: value }));
  };

  useEffect(() => {
    if (success) {
      alert("Profile updated successfully!");
      dispatch(resetStatus());
      navigate("/profile");
    }
    if (error) {
      alert(error);
      dispatch(resetStatus());
    }
  }, [success, error, navigate, dispatch]);

  const handleSave = () => {
    const body = {
      name: profileData.name,
      phone: profileData.phone,
      // email: profileData.email, // Agar backend email update allow karta hai
    };
    dispatch(updateAdminProfile(body));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setImage(preview);
    }
  };

  return (
    <div className="p-6">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 shadow-xl mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <LayoutDashboard className="w-7 h-7" />
              Edit Profile
            </h1>
            {/* NavLink section same as before */}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-8 max-w-full mx-auto">
        <div className="flex justify-center mb-10 relative">
          <div className="relative">
            <img src={image} alt="profile" className="w-32 h-32 rounded-full object-cover shadow-lg" />
            <label className="absolute bottom-1 right-1 bg-gradient-to-r from-[#0B1C2D] to-[#0E5FD8] p-3 rounded-full cursor-pointer hover:bg-blue-700 transition">
              <Upload className="text-white w-5 h-5" />
              <input type="file" accept="image/*" hidden onChange={handleImageChange} />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-blue-600 font-medium">Full Name</label>
            <input
              id="fullName"
              value={profileData.name}
              onChange={handleInputChange}
              placeholder="Enter your name"
              className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="text-blue-600 font-medium">Phone Number</label>
            <input
              id="phone"
              value={profileData.phone}
              onChange={handleInputChange}
              placeholder="Enter phone number"
              className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="text-blue-600 font-medium">Email Address</label>
            <input
              id="email"
              value={profileData.email}
              readOnly // Email aksar read-only hota hai admin panels mein
              className="w-full mt-2 p-3 border rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-blue-600 font-medium">Password</label>
            <input
              id="password"
              type="password"
              placeholder="********"
              value={profileData.password}
              onChange={handleInputChange}
              className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <p className="text-sm text-gray-400 mt-1">Leave empty to keep current password</p>
          </div>
        </div>

        <div className="flex justify-center gap-6 mt-12">
          <button
            onClick={() => navigate("/profile")}
            className="px-10 py-3 rounded-lg border-2 border-blue-500 text-blue-600 hover:bg-gradient-to-r hover:text-white from-[#205081] to-[#1a62cf] transition-all duration-150 active:scale-95"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="px-10 py-3 rounded-lg bg-gradient-to-r from-[#0B1C2D] to-[#0E5FD8] text-white font-medium shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;