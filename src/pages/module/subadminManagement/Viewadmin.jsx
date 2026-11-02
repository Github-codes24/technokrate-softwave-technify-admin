import { useLocation, NavLink,useNavigate } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";

const ViewAdmin = () => {
  const navigate = useNavigate();
  const { state: admin } = useLocation();

  if (!admin) {
    return (
      <div className="p-6 text-center">
        <p>No data found</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#F7941D] to-[#0072BC] rounded-2xl p-6 shadow-lg mb-8 mt-6">
        <h1 className="text-2xl font-semibold text-white">
          View Sub-Admin
        </h1>

        <div className="text-[15px] text-white flex items-center gap-2 mt-2">
          <NavLink to="/dashboard">
            <LayoutDashboard size={16} />
          </NavLink>
          <span>&gt;</span>
           <NavLink to="/subadminmanagement">
           <span className="hover:text-blue-400">Sub-Admin Management</span>
          </NavLink>
          <span>&gt;</span>
          <span>View Sub-Admin</span>
        </div>
      </div>

      {/* DETAILS CARD */}
     
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full mx-auto">
  <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b border-gray-300 pb-3">
    Sub Admin Details
  </h2>

  {/* 🔹 Always 2 Columns */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <Detail label="Full Name" value={admin.name} />
    <Detail label="Contact Number" value={admin.contact} />
    <Detail label="Email" value={admin.email} />
    <Detail label="Role" value={admin.role} />
    <Detail label="Permissions" value={admin.permissions} />

    <Detail
      label="Status"
      value={admin.status}
      status={admin.status}
    />
  </div>
</div>

    </div>
  );
};

const Detail = ({ label, value, status }) => (
  <div>
    <p className="text-sm text-gray-500 mb-1">{label}</p>
    <p
      className={`font-medium ${
        status === "Active"
          ? "text-green-600"
          : status === "Inactive"
          ? "text-red-500"
          : "text-gray-800"
      }`}
    >
      {value}
    </p>
  </div>
);

export default ViewAdmin;
