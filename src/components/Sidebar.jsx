// import { NavLink } from "react-router-dom";
// import {
//   Folder,
//   Users,
//   FileText,
//   DollarSign,
//   Activity,
//   UserCheck,
//   UserCog,
//   BarChart2,
//   LayoutDashboard,
//   Settings,
//   FileQuestionIcon,
//   Landmark,
//   ChevronRight,
// } from "lucide-react";
// import aryoLogo from "../assets/softwaveLogo.png";

// const Sidebar = ({ isOpen }) => {
//   const baseLink =
//     "flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-300 group";

//   const inactive =
//     "text-gray-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 hover:text-orange-700 hover:shadow-lg hover:border-l-4 hover:border-orange-400";

//   const active =
//     "bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 font-semibold shadow-md border-l-4 border-orange-500";

//   return (
// <aside
//   className={`fixed top-0 left-0 w-[17vw] h-screen
//   bg-linear-to-b from-white to-gray-50 text-gray-800
//   transform ${isOpen ? "translate-x-0" : "-translate-x-full"}
//   transition-all duration-300 ease-in-out
//   md:translate-x-0 z-40
//   flex flex-col shadow-xl border-r border-orange-200`}
// >
//       {/* LOGO */}
//       <div className="h-20 flex items-center justify-center px-6 
//         border-b border-orange-100 shrink-0 bg-linear-to-r from-white to-orange-50">
//         <div className="relative">
//           <img
//             src={aryoLogo}
//             alt="Softwave Tecnify Logo"
//             className="w-33 object-contain drop-shadow-lg"
//           />
//           <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-linear-to-r from-orange-400 via-orange-500 to-orange-400 rounded-full"></div>
//         </div>
//       </div>

//       {/* NAV */}
//       <nav className="flex-1 overflow-y-auto px-4 mt-6 space-y-1 pb-8">

//         <NavLink to="/dashboard" end
//           className={({ isActive }) =>
//             `${baseLink} ${isActive ? active : inactive}`
//           }>
//           <div className="relative">
//             <LayoutDashboard size={20} className="text-orange-500 group-hover:text-orange-600 group-hover:scale-110 transition-transform" />
//             <div className="absolute -inset-1 bg-orange-400/10 rounded-full blur-sm group-hover:blur-md transition-all"></div>
//           </div>
//           <span className="flex-1 text-sm font-medium">Dashboard</span>
//           <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 text-orange-500 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
//         </NavLink>

//         <NavLink to="/services"
//           className={({ isActive }) =>
//             `${baseLink} ${isActive ? active : inactive}`
//           }>
//           <div className="relative">
//             <Folder size={20} className="text-orange-500 group-hover:text-orange-600 group-hover:scale-110 transition-transform" />
//             <div className="absolute -inset-1 bg-orange-400/10 rounded-full blur-sm group-hover:blur-md transition-all"></div>
//           </div>
//           <span className="flex-1 text-sm font-medium">Projects</span>
//           <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 text-orange-500 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
//         </NavLink>

//         <NavLink to="/vendor"
//           className={({ isActive }) =>
//             `${baseLink} ${isActive ? active : inactive}`
//           }>
//           <div className="relative">
//             <Landmark size={20} className="text-orange-500 group-hover:text-orange-600 group-hover:scale-110 transition-transform" />
//             <div className="absolute -inset-1 bg-orange-400/10 rounded-full blur-sm group-hover:blur-md transition-all"></div>
//           </div>
//           <span className="flex-1 text-sm font-medium">Vendor Management</span>
//           <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 text-orange-500 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
//         </NavLink>

//         <NavLink to="/agent"
//           className={({ isActive }) =>
//             `${baseLink} ${isActive ? active : inactive}`
//           }>
//           <div className="relative">
//             <Users size={20} className="text-orange-500 group-hover:text-orange-600 group-hover:scale-110 transition-transform" />
//             <div className="absolute -inset-1 bg-orange-400/10 rounded-full blur-sm group-hover:blur-md transition-all"></div>
//           </div>
//           <span className="flex-1 text-sm font-medium">Agent Management</span>
//           <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 text-orange-500 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
//         </NavLink>

//         <NavLink to="/leadmanagement"
//           className={({ isActive }) =>
//             `${baseLink} ${isActive ? active : inactive}`
//           }>
//           <div className="relative">
//             <FileText size={20} className="text-orange-500 group-hover:text-orange-600 group-hover:scale-110 transition-transform" />
//             <div className="absolute -inset-1 bg-orange-400/10 rounded-full blur-sm group-hover:blur-md transition-all"></div>
//           </div>
//           <span className="flex-1 text-sm font-medium">Lead Management</span>
//           <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 text-orange-500 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
//         </NavLink>

//         <NavLink to="/commision"
//           className={({ isActive }) =>
//             `${baseLink} ${isActive ? active : inactive}`
//           }>
//           <div className="relative">
//             <DollarSign size={20} className="text-orange-500 group-hover:text-orange-600 group-hover:scale-110 transition-transform" />
//             <div className="absolute -inset-1 bg-orange-400/10 rounded-full blur-sm group-hover:blur-md transition-all"></div>
//           </div>
//           <span className="flex-1 text-sm font-medium">Commission Management</span>
//           <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 text-orange-500 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
//         </NavLink>

//         <NavLink to="/payout"
//           className={({ isActive }) =>
//             `${baseLink} ${isActive ? active : inactive}`
//           }>
//           <div className="relative">
//             <Activity size={20} className="text-orange-500 group-hover:text-orange-600 group-hover:scale-110 transition-transform" />
//             <div className="absolute -inset-1 bg-orange-400/10 rounded-full blur-sm group-hover:blur-md transition-all"></div>
//           </div>
//           <span className="flex-1 text-sm font-medium">Payout Management</span>
//           <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 text-orange-500 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
//         </NavLink>

//         <NavLink to="/agentkyc"
//           className={({ isActive }) =>
//             `${baseLink} ${isActive ? active : inactive}`
//           }>
//           <div className="relative">
//             <UserCheck size={20} className="text-orange-500 group-hover:text-orange-600 group-hover:scale-110 transition-transform" />
//             <div className="absolute -inset-1 bg-orange-400/10 rounded-full blur-sm group-hover:blur-md transition-all"></div>
//           </div>
//           <span className="flex-1 text-sm font-medium">KYC Management</span>
//           <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 text-orange-500 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
//         </NavLink>

//         <NavLink to="/reportanalysis"
//           className={({ isActive }) =>
//             `${baseLink} ${isActive ? active : inactive}`
//           }>
//           <div className="relative">
//             <BarChart2 size={20} className="text-orange-500 group-hover:text-orange-600 group-hover:scale-110 transition-transform" />
//             <div className="absolute -inset-1 bg-orange-400/10 rounded-full blur-sm group-hover:blur-md transition-all"></div>
//           </div>
//           <span className="flex-1 text-sm font-medium">Report & Analysis</span>
//           <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 text-orange-500 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
//         </NavLink>

//         <NavLink to="/subadminmanagement"
//           className={({ isActive }) =>
//             `${baseLink} ${isActive ? active : inactive}`
//           }>
//           <div className="relative">
//             <UserCog size={20} className="text-orange-500 group-hover:text-orange-600 group-hover:scale-110 transition-transform" />
//             <div className="absolute -inset-1 bg-orange-400/10 rounded-full blur-sm group-hover:blur-md transition-all"></div>
//           </div>
//           <span className="flex-1 text-sm font-medium">Sub-Admin Management</span>
//           <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 text-orange-500 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
//         </NavLink>

//         <NavLink to="/faqs"
//           className={({ isActive }) =>
//             `${baseLink} ${isActive ? active : inactive}`
//           }>
//           <div className="relative">
//             <FileQuestionIcon size={20} className="text-orange-500 group-hover:text-orange-600 group-hover:scale-110 transition-transform" />
//             <div className="absolute -inset-1 bg-orange-400/10 rounded-full blur-sm group-hover:blur-md transition-all"></div>
//           </div>
//           <span className="flex-1 text-sm font-medium">FAQs</span>
//           <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 text-orange-500 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
//         </NavLink>

//         {/* terms and conditions */}
//          <NavLink to="/termconditions"
//           className={({ isActive }) =>
//             `${baseLink} ${isActive ? active : inactive}`
//           }>
//           <div className="relative">
//             <FileText size={20} className="text-orange-500 group-hover:text-orange-600 group-hover:scale-110 transition-transform" />
//             <div className="absolute -inset-1 bg-orange-400/10 rounded-full blur-sm group-hover:blur-md transition-all"></div>
//           </div>
//           <span className="flex-1 text-sm font-medium">Terms and Conditions</span>
//           <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 text-orange-500 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
//         </NavLink>

//         <NavLink to="/setting"
//           className={({ isActive }) =>
//             `${baseLink} ${isActive ? active : inactive}`
//           }>
//           <div className="relative">
//             <Settings size={20} className="text-orange-500 group-hover:text-orange-600 group-hover:scale-110 transition-transform" />
//             <div className="absolute -inset-1 bg-orange-400/10 rounded-full blur-sm group-hover:blur-md transition-all"></div>
//           </div>
//           <span className="flex-1 text-sm font-medium">Settings</span>
//           <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 text-orange-500 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
//         </NavLink>

//       </nav>

//       {/* Version Info at Bottom */}
//       <div className="mt-auto p-4 border-t border-orange-100">
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-xs text-gray-500">SoftwaveTechnify</p>
//             <p className="text-xs text-orange-500 font-medium">v1.0.0</p>
//           </div>
//           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
//         </div>
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;







import { NavLink } from "react-router-dom";
import {
  Folder,
  Users,
  FileText,
  DollarSign,
  Activity,
  UserCheck,
  UserCog,
  BarChart2,
  LayoutDashboard,
  Settings,
  FileQuestionIcon,
  Landmark,
  ChevronRight,
} from "lucide-react";
import aryoLogo from "../assets/softwaveLogo.png";
import { FaUserTie } from "react-icons/fa";

const Sidebar = ({ isOpen }) => {
  const baseLink =
    "flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-300 group";

  const inactive =
    "text-gray-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 hover:text-orange-700 hover:shadow-lg hover:border-l-4 hover:border-orange-400";

  const active =
    "bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 font-semibold shadow-md border-l-4 border-orange-500";

  return (
    <aside
      className={`fixed top-0 left-0 w-[18vw] h-screen
  bg-linear-to-b from-white to-gray-50 text-gray-800
  transform ${isOpen ? "translate-x-0" : "-translate-x-full"}
  transition-all duration-300 ease-in-out
  md:translate-x-0 z-40
  flex flex-col shadow-xl border-r border-orange-200`}
    >
      {/* LOGO */}
      <div
        className="h-18 flex items-center justify-center px-6 
      border-b border-orange-100 shrink-0 bg-linear-to-r from-white to-orange-50"
      >
        <div className="relative">
          <img
            src={aryoLogo}
            alt="Softwave Tecnify Logo"
            className="w-30 object-contain drop-shadow-lg"
          />
          <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-linear-to-r from-orange-400 via-orange-500 to-orange-400 rounded-full"></div>
        </div>
      </div>

      {/* NAV - Updated with Scrollbar Hiding Styles */}
      <nav
        className="flex-1 overflow-y-auto no-scrollbar px-4 mt-6 space-y-1 pb-8"
        style={{
          scrollbarWidth: "none", // For Firefox
          msOverflowStyle: "none", // For Internet Explorer and Edge
        }}
      >
        {/* Hide scrollbar for Chrome, Safari and Opera */}
        <style>
          {`
            nav::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>

        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            `${baseLink} ${isActive ? active : inactive}`
          }
        >
          <div className="relative">
            <LayoutDashboard
              size={20}
              className="text-orange-500 group-hover:text-orange-600 group-hover:scale-110 transition-transform"
            />
            <div className="absolute -inset-1 bg-orange-400/10 rounded-full blur-sm group-hover:blur-md transition-all"></div>
          </div>
          <span className="flex-1 text-sm font-medium">Dashboard</span>
          <ChevronRight
            size={16}
            className="opacity-0 group-hover:opacity-100 text-orange-500 transform -translate-x-2 group-hover:translate-x-0 transition-all"
          />
        </NavLink>

        <NavLink
          to="/services"
          className={({ isActive }) =>
            `${baseLink} ${isActive ? active : inactive}`
          }
        >
          <div className="relative">
            <Folder
              size={20}
              className="text-orange-500 group-hover:text-orange-600 group-hover:scale-110 transition-transform"
            />
            <div className="absolute -inset-1 bg-orange-400/10 rounded-full blur-sm group-hover:blur-md transition-all"></div>
          </div>
          <span className="flex-1 text-sm font-medium">Projects</span>
          <ChevronRight
            size={16}
            className="opacity-0 group-hover:opacity-100 text-orange-500 transform -translate-x-2 group-hover:translate-x-0 transition-all"
          />
        </NavLink>

        <NavLink
          to="/vendor"
          className={({ isActive }) =>
            `${baseLink} ${isActive ? active : inactive}`
          }
        >
          <div className="relative">
            <Landmark
              size={20}
              className="text-orange-500 group-hover:text-orange-600 group-hover:scale-110 transition-transform"
            />
            <div className="absolute -inset-1 bg-orange-400/10 rounded-full blur-sm group-hover:blur-md transition-all"></div>
          </div>
          <span className="flex-1 text-sm font-medium">Vendor Management</span>
          <ChevronRight
            size={16}
            className="opacity-0 group-hover:opacity-100 text-orange-500 transform -translate-x-2 group-hover:translate-x-0 transition-all"
          />
        </NavLink>

        <NavLink
          to="/agent"
          className={({ isActive }) =>
            `${baseLink} ${isActive ? active : inactive}`
          }
        >
          <div className="relative">
            <Users
              size={20}
              className="text-orange-500 group-hover:text-orange-600 group-hover:scale-110 transition-transform"
            />
            <div className="absolute -inset-1 bg-orange-400/10 rounded-full blur-sm group-hover:blur-md transition-all"></div>
          </div>
          <span className="flex-1 text-sm font-medium">Agent Management</span>
          <ChevronRight
            size={16}
            className="opacity-0 group-hover:opacity-100 text-orange-500 transform -translate-x-2 group-hover:translate-x-0 transition-all"
          />
        </NavLink>

        <NavLink
          to="/leadmanagement"
          className={({ isActive }) =>
            `${baseLink} ${isActive ? active : inactive}`
          }
        >
          <div className="relative">
            <FileText
              size={20}
              className="text-orange-500 group-hover:text-orange-600 group-hover:scale-110 transition-transform"
            />
            <div className="absolute -inset-1 bg-orange-400/10 rounded-full blur-sm group-hover:blur-md transition-all"></div>
          </div>
          <span className="flex-1 text-sm font-medium">Lead Management</span>
          <ChevronRight
            size={16}
            className="opacity-0 group-hover:opacity-100 text-orange-500 transform -translate-x-2 group-hover:translate-x-0 transition-all"
          />
        </NavLink>

        <NavLink
          to="/commision"
          className={({ isActive }) =>
            `${baseLink} ${isActive ? active : inactive}`
          }
        >
          <div className="relative">
            <DollarSign
              size={20}
              className="text-orange-500 group-hover:text-orange-600 group-hover:scale-110 transition-transform"
            />
            <div className="absolute -inset-1 bg-orange-400/10 rounded-full blur-sm group-hover:blur-md transition-all"></div>
          </div>
          <span className="flex-1 text-sm font-medium">
            Commission Management
          </span>
          <ChevronRight
            size={16}
            className="opacity-0 group-hover:opacity-100 text-orange-500 transform -translate-x-2 group-hover:translate-x-0 transition-all"
          />
        </NavLink>

         {/* Client */}
         <NavLink
          to="/client"
          className={({ isActive }) =>
            `${baseLink} ${isActive ? active : inactive}`
          }
        >
          <div className="relative">
            <FaUserTie
              size={20}
              className="text-orange-500 group-hover:text-orange-600 group-hover:scale-110 transition-transform"
            />
            <div className="absolute -inset-1 bg-orange-400/10 rounded-full blur-sm group-hover:blur-md transition-all"></div>
          </div>
          <span className="flex-1 text-sm font-medium">Client Management</span>
          <ChevronRight
            size={16}
            className="opacity-0 group-hover:opacity-100 text-orange-500 transform -translate-x-2 group-hover:translate-x-0 transition-all"
          />
        </NavLink>

        <NavLink
          to="/payout"
          className={({ isActive }) =>
            `${baseLink} ${isActive ? active : inactive}`
          }
        >
          <div className="relative">
            <Activity
              size={20}
              className="text-orange-500 group-hover:text-orange-600 group-hover:scale-110 transition-transform"
            />
            <div className="absolute -inset-1 bg-orange-400/10 rounded-full blur-sm group-hover:blur-md transition-all"></div>
          </div>
          <span className="flex-1 text-sm font-medium">Payout Management</span>
          <ChevronRight
            size={16}
            className="opacity-0 group-hover:opacity-100 text-orange-500 transform -translate-x-2 group-hover:translate-x-0 transition-all"
          />
        </NavLink>

        <NavLink
          to="/agentkyc"
          className={({ isActive }) =>
            `${baseLink} ${isActive ? active : inactive}`
          }
        >
          <div className="relative">
            <UserCheck
              size={20}
              className="text-orange-500 group-hover:text-orange-600 group-hover:scale-110 transition-transform"
            />
            <div className="absolute -inset-1 bg-orange-400/10 rounded-full blur-sm group-hover:blur-md transition-all"></div>
          </div>
          <span className="flex-1 text-sm font-medium">KYC Management</span>
          <ChevronRight
            size={16}
            className="opacity-0 group-hover:opacity-100 text-orange-500 transform -translate-x-2 group-hover:translate-x-0 transition-all"
          />
        </NavLink>

        <NavLink
          to="/reportanalysis"
          className={({ isActive }) =>
            `${baseLink} ${isActive ? active : inactive}`
          }
        >
          <div className="relative">
            <BarChart2
              size={20}
              className="text-orange-500 group-hover:text-orange-600 group-hover:scale-110 transition-transform"
            />
            <div className="absolute -inset-1 bg-orange-400/10 rounded-full blur-sm group-hover:blur-md transition-all"></div>
          </div>
          <span className="flex-1 text-sm font-medium">Report & Analysis</span>
          <ChevronRight
            size={16}
            className="opacity-0 group-hover:opacity-100 text-orange-500 transform -translate-x-2 group-hover:translate-x-0 transition-all"
          />
        </NavLink>

        <NavLink
          to="/subadminmanagement"
          className={({ isActive }) =>
            `${baseLink} ${isActive ? active : inactive}`
          }
        >
          <div className="relative">
            <UserCog
              size={20}
              className="text-orange-500 group-hover:text-orange-600 group-hover:scale-110 transition-transform"
            />
            <div className="absolute -inset-1 bg-orange-400/10 rounded-full blur-sm group-hover:blur-md transition-all"></div>
          </div>
          <span className="flex-1 text-sm font-medium">
            Sub-Admin Management
          </span>
          <ChevronRight
            size={16}
            className="opacity-0 group-hover:opacity-100 text-orange-500 transform -translate-x-2 group-hover:translate-x-0 transition-all"
          />
        </NavLink>

        <NavLink
          to="/faqs"
          className={({ isActive }) =>
            `${baseLink} ${isActive ? active : inactive}`
          }
        >
          <div className="relative">
            <FileQuestionIcon
              size={20}
              className="text-orange-500 group-hover:text-orange-600 group-hover:scale-110 transition-transform"
            />
            <div className="absolute -inset-1 bg-orange-400/10 rounded-full blur-sm group-hover:blur-md transition-all"></div>
          </div>
          <span className="flex-1 text-sm font-medium">FAQs</span>
          <ChevronRight
            size={16}
            className="opacity-0 group-hover:opacity-100 text-orange-500 transform -translate-x-2 group-hover:translate-x-0 transition-all"
          />
        </NavLink>

     

        {/* terms and conditions */}
        <NavLink
          to="/termconditions"
          className={({ isActive }) =>
            `${baseLink} ${isActive ? active : inactive}`
          }
        >
          <div className="relative">
            <FileText
              size={20}
              className="text-orange-500 group-hover:text-orange-600 group-hover:scale-110 transition-transform"
            />
            <div className="absolute -inset-1 bg-orange-400/10 rounded-full blur-sm group-hover:blur-md transition-all"></div>
          </div>
          <span className="flex-1 text-sm font-medium">
            Terms and Conditions
          </span>
          <ChevronRight
            size={16}
            className="opacity-0 group-hover:opacity-100 text-orange-500 transform -translate-x-2 group-hover:translate-x-0 transition-all"
          />
        </NavLink>

        <NavLink
          to="/setting"
          className={({ isActive }) =>
            `${baseLink} ${isActive ? active : inactive}`
          }
        >
          <div className="relative">
            <Settings
              size={20}
              className="text-orange-500 group-hover:text-orange-600 group-hover:scale-110 transition-transform"
            />
            <div className="absolute -inset-1 bg-orange-400/10 rounded-full blur-sm group-hover:blur-md transition-all"></div>
          </div>
          <span className="flex-1 text-sm font-medium">Settings</span>
          <ChevronRight
            size={16}
            className="opacity-0 group-hover:opacity-100 text-orange-500 transform -translate-x-2 group-hover:translate-x-0 transition-all"
          />
        </NavLink>
      </nav>

      {/* Version Info at Bottom */}
      <div className="mt-auto p-4 border-t border-orange-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">SoftwaveTechnify</p>
            <p className="text-xs text-orange-500 font-medium">v1.0.0</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;