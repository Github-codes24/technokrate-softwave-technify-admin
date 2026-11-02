import { NavLink, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import PayoutDashboard from "./PayoutDashboard";
import { LayoutDashboard } from "lucide-react";
import LoaderSpinner from "../../../components/uiElement/LoaderSpinner";
const PayoutManagement = () => {
  const [loading, setLoading] = useState(true);

  // for loader
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const tabClass =
    "px-4 py-2 rounded-lg text-sm font-medium transition border border-gray-300";

  const activeTab =
    "bg-gradient-to-r from-[#0b1c2df4] to-[#0E5FD8] text-white border-0";

  const inactiveTab =
    "bg-white text-gray-700 hover:bg-gray-100 ";
  
  // for Loader
  if (loading) {
    return (
      <div className="mt-10">
        <LoaderSpinner />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div
        className="bg-gradient-to-r from-[#F7941D] to-[#0072BC]
                   rounded-2xl p-6 shadow-lg mb-6 "
      >
        <h1 className="text-2xl font-semibold text-white">
          Payout Management
        </h1>

        <div className="text-[15px] text-white flex items-center gap-2 mt-2">
          <NavLink
            to="/dashboard"
            className="flex items-center gap-1 hover:text-blue-600 transition"
          >
            <LayoutDashboard size={16} />
          </NavLink>

          <span>&gt;</span>

          <NavLink to="/payout" className="hover:text-blue-600 transition">
            Payout Dashboard
          </NavLink>
        </div>
      </div>

      {/* dashboard */}
      <PayoutDashboard />

      {/* tabs */}
      <div className="mt-6 bg-white rounded-xl p-4 shadow">
        <div className="flex gap-3 mb-6">
          <NavLink
            to="/payout/eligible-agents"
            end
            className={({ isActive }) =>
              `${tabClass} ${isActive ? activeTab : inactiveTab}`
            }
          >
            Eligible Agents
          </NavLink>

          <NavLink
            to="/payout/history"
            className={({ isActive }) =>
              `${tabClass} ${isActive ? activeTab : inactiveTab}`
            }
          >
            Payout History
          </NavLink>
        </div>

        {/* tab content */}
        <Outlet />
      </div>
    </div>
  );
};

export default PayoutManagement;
