import { useNavigate, NavLink } from "react-router-dom";
import { LayoutDashboard, Plus, Edit, Eye, Users } from "lucide-react";
import { useState } from "react";

const SubAdminManagement = () => {
  const navigate = useNavigate();

  const [mode, setMode] = useState("create");
  const [editId, setEditId] = useState(null);

  const [subAdmins, setSubAdmins] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      contact: "9876543210",
      email: "rahul@gmail.com",
      role: "Sub Admin",
      permissions: "View Leads",
      status: "Active",
    },
    {
      id: 2,
      name: "Neha Verma",
      contact: "9123456789",
      email: "neha@gmail.com",
      role: "Manager",
      permissions: "Manage Users",
      status: "Inactive",
    },
  ]);

  // 👁 VIEW CLICK
  const handleViewClick = (admin) => {
    navigate("/subadminmanagement/view-subadmin", {
      state: admin,
    });
  };

  const handleEditClick = (admin) => {
    navigate("/subadminmanagement/update-subadmin", {
      state: admin,
    });
  };
  // STATUS TOGGLE
  const handleToggleStatus = (id) => {
    setSubAdmins(
      subAdmins.map((admin) =>
        admin.id === id
          ? {
            ...admin,
            status: admin.status === "Active" ? "Inactive" : "Active",
          }
          : admin
      )
    );
  };

  // EDIT


  return (
    <div className="p-6">
      {/* HEADER */}
    <div className="bg-linear-to-r from-orange-500 to-orange-600 rounded-2xl p-6 shadow-xl mb-8">
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div>
      <h1 className="text-2xl font-bold text-white flex items-center gap-3">
        <Users className="w-7 h-7" /> Sub-Admin Management
      </h1>
      <div className="text-sm text-blue-50 flex items-center gap-2 mt-3">
        <NavLink 
          to="/dashboard" 
          className="bg-white/20 px-3 py-1 rounded-lg hover:bg-white/30 hover:text-white transition-all flex items-center gap-2"
        >
          <LayoutDashboard className="w-4 h-4" /> Dashboard
        </NavLink>
        <span className="text-white/60">›</span>
        <span className="text-white font-medium">Sub-Admin Management</span>
      </div>
    </div>
  </div>
</div>
      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-semibold">Sub Admin List</h2>
          <button
            onClick={() => navigate("/subadminmanagement/add-subadmin")}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0b1c2df4] to-[#0E5FD8] text-white rounded-lg"
          >
            <Plus size={16} /> Add Sub Admin
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#1d476e33]">
              <tr className="uppercase text-black text-sm ">
                {[
                  "Name",
                  "Contact",
                  "Email",
                  "Role",
                  "Permissions",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th key={h} className="px-6 py-3 text-left">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {subAdmins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50 transition border-b border-gray-200">
                  <td className="px-6 py-4">{admin.name}</td>
                  <td className="px-6 py-4">{admin.contact}</td>
                  <td className="px-6 py-4">{admin.email}</td>
                  <td className="px-6 py-4">{admin.role}</td>
                  <td className="px-6 py-4">{admin.permissions}</td>

                  {/* STATUS */}
                  <td className="px-6 py-4">
                    <div
                      onClick={() => handleToggleStatus(admin.id)}
                      className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition ${admin.status === "Active"
                        ? "bg-green-500"
                        : "bg-gray-300"
                        }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${admin.status === "Active"
                          ? "translate-x-6"
                          : "translate-x-0"
                          }`}
                      />
                    </div>
                  </td>

                  {/* ACTION */}
                  <td className="px-6 py-4 flex gap-4">
                    <button onClick={() => handleViewClick(admin)}>
                      <Eye
                        size={18}
                        className="text-gray-600 hover:text-green-600"
                      />
                    </button>

                    <button onClick={() => handleEditClick(admin)}>
                      <Edit
                        onClick={() => handleEditClick(admin)}
                        size={18}
                        className="text-blue-600 hover:text-blue-800"
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubAdminManagement;
