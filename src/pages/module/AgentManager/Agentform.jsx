import {
  LayoutDashboard,
  Loader2,
  User,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Percent,
  PlusCircle,
  ArrowLeft,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

export default function AgentForm({
  form,
  setForm,
  onSubmit,
  title,
  loading,
  vendors,
  vendorsLoading,
}) {
  const navigate = useNavigate();
  return (
    <div className="w-full min-h-screen p-6 bg-gray-50/50 pb-10">
      {/* Header / Breadcrumb */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 shadow-xl mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <PlusCircle className="w-7 h-7" />
              Add Agent
            </h1>
            <div className="text-sm text-orange-100 flex items-center gap-2 mt-3">
              <NavLink
                to="/dashboard"
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                <span className="bg-white/20 px-3 py-1 rounded-lg">
                  Dashboard management
                </span>
              </NavLink>
              <span className="text-white/60">›</span>
              <span className="text-white font-medium">Agent Management</span>
            </div>
          </div>
        </div>
      </div>

      {/* back button */}
      <button
        onClick={() => navigate("/agent")}
        className="mb-4 flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold transition"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Agent Management
      </button>

      <div className="max-w-full mx-auto">
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
            className="p-8 space-y-8"
          >
            {/* Section 1: Basic Information */}
            <div>
              <h3 className="text-sm font-bold text-orange-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                <User size={16} /> Personal Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <input
                    required
                    className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none bg-gray-50/30"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                {/* <div className="relative">
                  <Phone className="absolute left-4 top-4 text-gray-400" size={18} />
                  <input
                    required
                    className="w-full pl-12 pr-5 py-3.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none bg-gray-50/30"
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div> */}

                {/* <div className="relative">
                  <Phone
                    className="absolute left-4 top-4 text-gray-400"
                    size={18}
                  />
                  <input
                    required
                    type="tel" // 'tel' use karna mobile keyboards ke liye behtar hai
                    className="w-full pl-12 pr-5 py-3.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none bg-gray-50/30"
                    placeholder="Phone Number (10 digits)"
                    value={form.phone}
                    onChange={(e) => {
                      const val = e.target.value;
                      // Sirf numbers allow karein aur length 10 tak restrict karein
                      if (/^\d*$/.test(val) && val.length <= 10) {
                        setForm({ ...form, phone: val });
                      }
                    }}
                  />
                </div> */}

                <div className="relative group">
  <Phone className="absolute left-4 top-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={18} />
  
  {/* UI mein +91 dikhane ke liye */}
  <span className="absolute left-11 top-4 text-gray-500 font-semibold border-r border-gray-300 pr-2">
    +91
  </span>

  <input
    required
    type="tel"
    className="w-full pl-24 pr-5 py-3.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none bg-gray-50/30 font-medium"
    placeholder="Enter 10 digit number"
    // Input box mein sirf 10 digits dikhenge (state se +91 hata kar)
    value={form.phone.startsWith("+91") ? form.phone.slice(3) : form.phone} 
    onChange={(e) => {
      const val = e.target.value.replace(/\D/g, ""); // Sirf numbers allow honge
      if (val.length <= 10) {
        // Body (State) mein +91 ke saath save hoga
        setForm({ ...form, phone: val ? `+91${val}` : "" });
      }
    }}
  />
</div>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-4 text-gray-400"
                    size={18}
                  />
                  <input
                    required
                    type="email"
                    className="w-full pl-12 pr-5 py-3.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none bg-gray-50/30"
                    placeholder="Email Address"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Location & Team */}
            <div className="pt-2 border-t border-gray-50">
              <h3 className="text-sm font-bold text-orange-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                <MapPin size={16} /> Location & Assignment
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input
                  className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none bg-gray-50/30"
                  placeholder="State"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                />
                <input
                  className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none bg-gray-50/30"
                  placeholder="City"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-400 ml-1">
                    Gender
                  </label>
                  <select
                    required
                    className="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50/30 focus:ring-4 focus:ring-blue-500/10 outline-none"
                    value={form.gender}
                    onChange={(e) =>
                      setForm({ ...form, gender: e.target.value })
                    }
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                {/* <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-400 ml-1">Team Assignment</label>
                  <input
                    className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-500/10 outline-none bg-gray-50/30"
                    placeholder="Team Code (e.g. TEAM01)"
                    value={form.teamCode}
                    onChange={(e)=> setForm({ ...form, teamCode: e.target.value })}
                  />
                </div> */}
              </div>
            </div>

            {/* Section 3: Professional Details */}
            <div className="pt-2 border-t border-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* --- LEFT COLUMN: Professional Details & Commission --- */}
                <div className="flex flex-col gap-5">
                  <div>
                    <h3 className="text-sm font-bold text-orange-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Briefcase size={16} /> Professional Details
                    </h3>
                    <select
                      required
                      className="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50/30 focus:ring-4 focus:ring-orange-500/10 outline-none"
                      value={form.occupation}
                      onChange={(e) =>
                        setForm({ ...form, occupation: e.target.value })
                      }
                    >
                      <option value="">Select Occupation</option>
                      <option value="Freelancer">Freelancer</option>
                      <option value="Sales Agent">Sales Agent</option>
                      <option value="DSA">DSA</option>
                      <option value="Credit Insurance Agent">
                        Credit/Insurance Agent
                      </option>
                      <option value="Loan Agent">Loan Agent</option>
                      <option value="Stock Trader">Stock Trader</option>
                      <option value="Retail Shop">Retail Shop</option>
                      <option value="Salaried">Salaried</option>
                      <option value="Housewife">Housewife</option>
                      <option value="Retail Telecom Outlet">
                        Retail/Telecom Outlet
                      </option>
                      <option value="Influencer">Influencer</option>
                      <option value="CSC Suvidha Kendra">
                        CSC/Suvidha Kendra
                      </option>
                      <option value="Telecom Sales Agent">
                        Telecom Sales Agent
                      </option>
                      <option value="BDM">BDM</option>
                      <option value="BDE">BDE</option>
                      <option value="Student">Student</option>
                      <option value="Lead Generation">Lead Generation</option>
                      <option value="Digital Marketing">
                        Digital Marketing
                      </option>
                      <option value="Others">Others</option>
                    </select>
                  </div>

                  {/* Commission Rate - Ab ye Left side mein hai */}
                  <div className="relative group">
                    <Percent
                      className="absolute left-4 top-4 text-gray-500 group-focus-within:scale-110 transition-transform"
                      size={18}
                    />
                    <input
                      required
                      type="number"
                      className="w-full pl-12 pr-5 py-3.5 rounded-xl border-2 border-blue-100 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none bg-blue-50/30 font-semibold text-orange-700 placeholder:text-gray-400"
                      placeholder="Commission Rate (%)"
                      value={form.commissionRate}
                      onChange={(e) =>
                        setForm({ ...form, commissionRate: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-orange-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Briefcase size={16} /> Vendor Details
                  </h3>
                  <select
                    className="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50/30 focus:ring-4 focus:ring-blue-500/10 outline-none"
                    value={form.assignedToId || ""} // assignedToId use karein
                    onChange={(e) =>
                      setForm({ ...form, assignedToId: e.target.value || null})
                    }
                  >
                    <option value="">
                      {vendorsLoading
                        ? "Loading Vendors..."
                        : "Select Vendor (Optional)"}
                    </option>

                    {/* Dynamic Options from API */}
                    {vendors.map((vendor) => (
                      <option key={vendor._id} value={vendor._id}>
                        {vendor.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                disabled={loading}
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98]"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={22} />
                ) : (
                  "Finalize & Save Agent"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
