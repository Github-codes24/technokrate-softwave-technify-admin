// import { Bell, LogOut, User, ChevronDown, Menu, Home } from "lucide-react";
// import { NavLink, useNavigate } from "react-router-dom";
// import { useState, useRef, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";

// // ✅ Correct Import: logout action ko curly braces mein import karein
// import { logout } from "../redux/slice/auth/verifySlice"; 

// const Navbar = ({ onToggle }) => {
//   const [open, setOpen] = useState(false);
//   const [notifications, setNotifications] = useState(3);
//   const dropdownRef = useRef(null);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   // 🔹 Redux state se admin data nikalna
//   const { adminData } = useSelector((state) => state.verify);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleLogout = () => {
//     // 1. Redux Action dispatch karein (Ye localStorage se token aur admin delete karega)
//     dispatch(logout()); 
    
//     // 2. Dropdown close karein
//     setOpen(false);
    
//     // 3. Login page par navigate karein
//     navigate("/", { replace: true });
//   };

//   return (
//     <header className="fixed top-0 right-0 w-[82vw] h-18 bg-linear-to-r from-orange-50 to-white text-gray-800 flex items-center justify-between px-6 z-50 border-b border-orange-200 shadow-lg">

//       {/* Left Section - Breadcrumb & Title */}
//       <div className="flex items-center gap-6">
//         <button 
//           onClick={onToggle} 
//           className="md:hidden p-2.5 rounded-lg bg-linear-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white transition-all duration-300 shadow-md hover:shadow-lg"
//         >
//           <Menu className="w-5 h-5" />
//         </button>

//         <div className="flex items-center gap-2 text-sm">
//           <NavLink to="/dashboard" className="flex items-center gap-1 text-orange-500 hover:text-orange-600">
//             <Home className="w-4 h-4" />
//             <span>Dashboard</span>
//           </NavLink>
//           <span className="text-gray-400">/</span>
//           <span className="text-gray-600 font-medium">Admin Panel</span>
//         </div>
//       </div>

//       {/* Right Section */}
//       <div className="flex items-center gap-6 relative" ref={dropdownRef}>

//         {/* Notification Section */}
//         <div className="relative group">
//           <div className="relative p-2.5 rounded-full bg-linear-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 transition-all duration-300 cursor-pointer border border-orange-200 shadow-sm hover:shadow-md">
//             <Bell className="w-5 h-5 text-orange-600 group-hover:text-orange-700 group-hover:scale-110 transition-all duration-300" />
//             {notifications > 0 && (
//               <>
//                 <span className="absolute -top-1 -right-1 w-5 h-5 bg-linear-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md animate-pulse">
//                   {notifications}
//                 </span>
//                 <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-400/50 rounded-full animate-ping"></div>
//               </>
//             )}
//           </div>
//         </div>


//         {/* Profile Pill */}
//         <div onClick={() => setOpen(!open)} className="flex items-center gap-2 cursor-pointer group relative">
//           <div className="absolute inset-0 bg-linear-to-r from-orange-400/20 via-orange-300/10 to-orange-400/20 rounded-full blur-sm group-hover:blur-md transition-all duration-500"></div>
          
//           <div className="relative flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-orange-200 group-hover:border-orange-400 transition-all duration-300">
//             <div className="relative">
//               <img
//                 src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa"
//                 className="w-9 h-9 rounded-full object-cover border-2 border-orange-400 group-hover:border-orange-500 transition-all duration-300 shadow-sm"
//                 alt="profile"
//               />
//               <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
//             </div>

//             {/* User Info - Dynamic Name and Role */}
//             <div className="hidden md:block text-right">
//               <span className="text-sm font-semibold text-gray-800 group-hover:text-orange-600 transition-colors duration-300">
//                 {adminData?.name || "Guest Admin"}
//               </span>
//               <p className="text-xs text-gray-500 capitalize">{adminData?.role || "Subadmin"}</p>
//             </div>

//             <ChevronDown className={`w-4 h-4 text-orange-500 group-hover:text-orange-600 transition-all duration-300 ${open ? "rotate-180" : ""}`} />
//           </div>

//           {/* Dropdown Menu */}
//           {open && (
//             <div className="absolute right-0 top-12 w-56 bg-white text-gray-700 rounded-xl shadow-2xl overflow-hidden border border-orange-200 z-50 animate-in slide-in-from-top-5 duration-300">
//               <div className="p-4 bg-linear-to-r from-orange-50 to-orange-100 border-b border-orange-200">
//                 <div className="flex items-center gap-3">
//                   <div className="relative">
//                     <img
//                       src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa"
//                       className="w-12 h-12 rounded-full object-cover border-3 border-orange-400"
//                       alt="profile"
//                     />
//                     <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
//                   </div>
//                   <div>
//                     <p className="font-semibold text-gray-800 truncate w-32">{adminData?.name || "Guest"}</p>
//                     <p className="text-xs text-orange-600 font-medium capitalize">{adminData?.role}</p>
//                     <p className="text-xs text-gray-500 mt-1 truncate w-32">{adminData?.email}</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="p-3 space-y-1">
//                 <NavLink to="/profile" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-linear-to-r hover:from-orange-50 hover:to-orange-100 hover:text-orange-600 transition-all duration-200 group">
//                   <div className="p-1.5 rounded-lg bg-orange-100 group-hover:bg-orange-200"><User className="w-4 h-4 text-orange-600" /></div>
//                   <span>My Profile</span>
//                 </NavLink>
//                 <div className="h-px bg-linear-to-r from-transparent via-orange-200 to-transparent my-2"></div>
                
//                 {/* 🔴 Logout Button */}
//                 <button 
//                   onClick={handleLogout} 
//                   className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-linear-to-r hover:from-red-50 hover:to-red-100 hover:text-red-700 transition-all duration-200 group"
//                 >
//                   <div className="p-1.5 rounded-lg bg-red-100 group-hover:bg-red-200">
//                     <LogOut className="w-4 h-4 text-red-600" />
//                   </div>
//                   <span>Logout</span>
//                 </button>
//               </div>
//               <div className="p-3 bg-linear-to-r from-orange-50 to-white border-t border-orange-200">
//                 <p className="text-xs text-gray-500 text-center">SoftwaveTechnify • v1.0</p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Navbar;







import { Bell, LogOut, User, ChevronDown, Menu, Home, X } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

// ✅ Correct Import
import { logout } from "../redux/slice/auth/verifySlice"; 

const Navbar = ({ onToggle }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false); // 🔔 Notification state add ki
  const [notifications, setNotifications] = useState(3);
  
  const profileRef = useRef(null);
  const notifRef = useRef(null);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 🔹 Redux state se admin data nikalna
  const { adminData } = useSelector((state) => state.verify);

  // Outside click handle karne ke liye combined logic
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout()); 
    setProfileOpen(false);
    navigate("/", { replace: true });
  };

  return (
    <header className="fixed top-0 right-0 w-[82vw] h-18 bg-linear-to-r from-orange-50 to-white text-gray-800 flex items-center justify-between px-6 z-50 border-b border-orange-200 shadow-lg">

      {/* Left Section - Breadcrumb & Title */}
      <div className="flex items-center gap-6">
        <button 
          onClick={onToggle} 
          className="md:hidden p-2.5 rounded-lg bg-linear-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-sm">
          <NavLink to="/dashboard" className="flex items-center gap-1 text-orange-500 hover:text-orange-600">
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </NavLink>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600 font-medium">Admin Panel</span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">

        {/* 🔔 Notification Section */}
        <div className="relative" ref={notifRef}>
          <div 
            onClick={() => {
                // setNotifOpen(!notifOpen);
                // setProfileOpen(false); // Profile band kar do jab notif khule
                navigate("/notifications")
            }}
            className="relative p-2.5 rounded-full bg-linear-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 transition-all duration-300 cursor-pointer border border-orange-200 shadow-sm hover:shadow-md group"
          >
            <Bell className={`w-5 h-5 transition-all duration-300 ${notifOpen ? "text-orange-700 scale-110" : "text-orange-600 group-hover:text-orange-700 group-hover:scale-110"}`} />
            {notifications > 0 && (
              <>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-linear-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-md animate-pulse">
                  {notifications}
                </span>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-400/50 rounded-full animate-ping"></div>
              </>
            )}
          </div>

          {/* Notification Dropdown UI */}
          {notifOpen && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-orange-100 z-50 overflow-hidden animate-in slide-in-from-top-5 duration-300">
              <div className="p-4 border-b border-orange-50 flex justify-between items-center bg-orange-50/30">
                <h3 className="font-bold text-gray-800">Notifications</h3>
                <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-bold">New {notifications}</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                <div className="p-4 hover:bg-orange-50 cursor-pointer border-b border-gray-50 transition-colors">
                  <p className="text-sm text-gray-700 font-medium">New vendor request received</p>
                  <p className="text-xs text-gray-500 mt-1">Please verify the documents of Rahul Sharma.</p>
                  <span className="text-[10px] text-gray-400 mt-2 block">2 mins ago</span>
                </div>
                <div className="p-4 hover:bg-orange-50 cursor-pointer border-b border-gray-50 transition-colors">
                  <p className="text-sm text-gray-700 font-medium">Policy Updated</p>
                  <p className="text-xs text-gray-500 mt-1">Privacy policy has been updated by Super Admin.</p>
                  <span className="text-[10px] text-gray-400 mt-2 block">1 hour ago</span>
                </div>
              </div>
              <div className="p-3 text-center border-t border-gray-50 bg-gray-50/50">
                <button className="text-xs text-orange-600 font-bold hover:underline">View All Notifications</button>
              </div>
            </div>
          )}
        </div>
        

        {/* 👤 Profile Pill Section */}
        <div className="relative" ref={profileRef}>
          <div onClick={() => {
              setProfileOpen(!profileOpen);
              setNotifOpen(false); // Notif band kar do jab profile khule
          }} className="flex items-center gap-2 cursor-pointer group relative">
            <div className="absolute inset-0 bg-linear-to-r from-orange-400/20 via-orange-300/10 to-orange-400/20 rounded-full blur-sm group-hover:blur-md transition-all duration-500"></div>
            
            <div className="relative flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-orange-200 group-hover:border-orange-400 transition-all duration-300">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa"
                  className="w-9 h-9 rounded-full object-cover border-2 border-orange-400 group-hover:border-orange-500 transition-all duration-300 shadow-sm"
                  alt="profile"
                />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>

              <div className="hidden md:block text-right">
                <span className="text-sm font-semibold text-gray-800 group-hover:text-orange-600 transition-colors duration-300">
                  {adminData?.name || "Guest Admin"}
                </span>
                <p className="text-xs text-gray-500 capitalize">{adminData?.role || "Subadmin"}</p>
              </div>

              <ChevronDown className={`w-4 h-4 text-orange-500 group-hover:text-orange-600 transition-all duration-300 ${profileOpen ? "rotate-180" : ""}`} />
            </div>
          </div>

          {/* Profile Dropdown Menu */}
          {profileOpen && (
            <div className="absolute right-0 top-12 w-56 bg-white text-gray-700 rounded-xl shadow-2xl overflow-hidden border border-orange-200 z-50 animate-in slide-in-from-top-5 duration-300">
              <a href="/profile">
              <div className="p-4 bg-linear-to-r from-orange-50 to-orange-100 border-b border-orange-200">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa"
                      className="w-12 h-12 rounded-full object-cover border-3 border-orange-400"
                      alt="profile"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-semibold text-gray-800 truncate">{adminData?.name || "Guest"}</p>
                    <p className="text-[10px] text-orange-600 font-bold uppercase tracking-wider">{adminData?.role}</p>
                    <p className="text-[11px] text-gray-500 mt-1 truncate">{adminData?.email}</p>
                  </div>
                </div>
              </div>
              </a>

              <div className="p-3 space-y-1">
                <NavLink to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-linear-to-r hover:from-orange-50 hover:to-orange-100 hover:text-orange-600 transition-all duration-200 group">
                  <div className="p-1.5 rounded-lg bg-orange-100 group-hover:bg-orange-200"><User className="w-4 h-4 text-orange-600" /></div>
                  <span className="text-sm font-medium">My Profile</span>
                </NavLink>
                <div className="h-px bg-linear-to-r from-transparent via-orange-200 to-transparent my-2"></div>
                
                <button 
                  onClick={handleLogout} 
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-linear-to-r hover:from-red-50 hover:to-red-100 hover:text-red-700 transition-all duration-200 group"
                >
                  <div className="p-1.5 rounded-lg bg-red-100 group-hover:bg-red-200">
                    <LogOut className="w-4 h-4 text-red-600" />
                  </div>
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
              <div className="p-3 bg-linear-to-r from-orange-50 to-white border-t border-orange-200">
                <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest">v1.0 • Softwave</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;