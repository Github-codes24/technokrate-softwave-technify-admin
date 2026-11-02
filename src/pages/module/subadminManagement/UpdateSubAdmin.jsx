import { useLocation, useNavigate, NavLink } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";
import { useState } from "react";

const UpdateSubAdmin = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [formData, setFormData] = useState({
    id: state.id,
    name: state.name,
    contact: state.contact,
    email: state.email,
    role: state.role,
    permissions: state.permissions,
    status: state.status,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = () => {
    navigate(-1, {
      state: {
        updatedAdmin: formData,
      },
    });
  };

  return (
    <>
      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#F7941D] to-[#0072BC] rounded-2xl p-6 shadow-lg mb-6 mt-6">
        <h1 className="text-2xl font-semibold text-white">
          Update Sub-Admin
        </h1>

        <div className="text-[15px] text-white flex items-center gap-2 mt-2">
          <NavLink to="/dashboard">
            <LayoutDashboard size={16} />
          </NavLink>
          <span>&gt;</span>
          <NavLink to="/subadminmanagement">
            <span className="hover:text-blue-300">
              Sub-Admin Management
            </span>
          </NavLink>
          <span>&gt;</span>
          <span>Update Sub-Admin</span>
        </div>
      </div>

      {/* FORM */}
      <div className="max-w-full mx-auto bg-white p-8 rounded-xl shadow-lg mt-8">
        <h2 className="text-xl font-semibold mb-6">
          Update Sub Admin
        </h2>

        <div className="grid grid-cols-2 gap-6">
          {/* NAME */}
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="border p-3 rounded"
          />

          {/* CONTACT */}
          <input
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            placeholder="Contact"
            className="border p-3 rounded"
          />

          {/* EMAIL */}
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="border p-3 rounded"
          />

          {/* ROLE SELECT */}
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="border p-3 rounded bg-white"
          >
            <option value="">Select Role</option>
            <option value="Sub Admin">Sub Admin</option>
            <option value="Manager">Manager</option>
            <option value="Supervisor">Supervisor</option>
          </select>

          {/* PERMISSIONS SELECT */}
          <select
            name="permissions"
            value={formData.permissions}
            onChange={handleChange}
            className="border p-3 rounded bg-white"
          >
            <option value="">Select Permission</option>
            <option value="View Leads">View Leads</option>
            <option value="Manage Users">Manage Users</option>
            <option value="Full Access">Full Access</option>
          </select>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-center gap-4 mt-10">
          <button
  onClick={() => navigate(-1)}
  className="
    px-6 py-2 border rounded
    transition-all duration-150
    hover:bg-blue-100
    active:scale-95 active:shadow-inner
    focus:outline-none focus:ring-2 focus:ring-gray-300
  "
>
  Cancel
</button>

          <button
  onClick={handleUpdate}
  className="
    px-6 py-2 bg-gradient-to-r from-[#0B1C2D] to-[#0E5FD8] text-white rounded
    transition-all duration-150
    hover:bg-[#0c52c2]
    active:scale-95 active:shadow-inner
    focus:outline-none focus:ring-2 focus:ring-[#0E5FD8]/50
  "
>
  Update
</button>

        </div>
      </div>
    </>
  );
};

export default UpdateSubAdmin;
