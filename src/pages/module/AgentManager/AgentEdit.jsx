import { useEffect, useState } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  LayoutDashboard,
  User,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  CheckCircle,
  ChevronLeft,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Redux Actions
import { fetchSingleAgent } from "../../../redux/slice/agentManagement/getSingleAgentSlice";
import {
  updateAgent,
  resetUpdateState,
} from "../../../redux/slice/agentManagement/updateAgentSlice";
import LoaderSpinner from "../../../components/uiElement/LoaderSpinner";

const AgentEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux States
  const {
    agent,
    loading: viewLoading,
    error: viewError,
  } = useSelector((state) => state.singleAgent);
  const {
    loading: updateLoading,
    success: updateSuccess,
    error: updateError,
  } = useSelector((state) => state.updateAgent);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    occupation: "",
    gender: "",
    state: "",
    city: "",
    // teamCode: "TEAM01", // Default as per requirement
  });

  // 1. Fetch Agent Data on Mount
  useEffect(() => {
    if (id) {
      dispatch(fetchSingleAgent(id));
    }
    return () => dispatch(resetUpdateState());
  }, [id, dispatch]);

  // 2. Set Form Data when agent is fetched
  useEffect(() => {
    if (agent) {
      setFormData({
        name: agent.name || "",
        phone: agent.phone || "",
        email: agent.email || "",
        occupation: agent.occupation || "",
        gender: agent.gender || "",
        state: agent.state || "",
        city: agent.city || "",
        // teamCode: agent.teamCode || "TEAM01",
      });
    }
  }, [agent]);

  // 3. Handle Success/Error of Update
  useEffect(() => {
    if (updateSuccess) {
      toast.success("Agent updated successfully!");
      setTimeout(() => {
        navigate("/agent");
        dispatch(resetUpdateState());
      }, 1500);
    }
    if (updateError) {
      toast.error(updateError);
      dispatch(resetUpdateState());
    }
  }, [updateSuccess, updateError, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateAgent({ id, formData }));
  };

  if (viewLoading) {
    return (
      <div className="flex flex-col items-center justify-start mt-55 min-h-screen">
        <LoaderSpinner />
      </div>
    );
  }

  if (viewError) {
    return (
      <div className="p-6 text-center text-red-500 font-bold">{viewError}</div>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} limit={1} />

      <div className="p-6 min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 shadow-xl mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              {/* Fixed Heading: Flex aur Items-center se icon aur text ek line mein aa jayenge */}
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <User className="w-7 h-7" />
                Edit Agent
              </h1>

              {/* Breadcrumbs Section */}
              <div className="text-sm text-orange-100 flex flex-wrap items-center gap-2 mt-4">
                <NavLink
                  to="/dashboard"
                  className="hover:text-white transition-colors"
                >
                  <span className="bg-white/20 px-3 py-1 rounded-lg">
                    Dashboard
                  </span>
                </NavLink>

                <span className="text-white/60">›</span>

                <NavLink
                  to="/agent"
                  className="hover:text-white transition-colors"
                >
                  Agent Management
                </NavLink>

                <span className="text-white/60">›</span>

                <span className="text-white font-medium">Edit Agent</span>
              </div>
            </div>
          </div>
        </div>

        {/* back button */}
         <button
        onClick={() => navigate("/agent")}
        className="mb-4 flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold transition"
      >
        <ArrowLeft   className="w-5 h-5" />
        Back to Agent Management
      </button>

        {/* Main Content */}
        <div className="max-w-full mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {formData.name}
                </h2>
                <p className="text-gray-600 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  {formData.occupation || "Not Specified"}
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Left Column */}
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                      placeholder="Enter full name"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-emerald-100 rounded-lg flex-shrink-0">
                    <Mail className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-pink-100 rounded-lg flex-shrink-0">
                    <Briefcase className="w-5 h-5 text-pink-600" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Occupation
                    </label>
                    <input
                      type="text"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white"
                      placeholder="Enter occupation"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-indigo-100 rounded-lg flex-shrink-0">
                    <MapPin className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="grid grid-cols-2 gap-3 flex-1">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-amber-100 rounded-lg flex-shrink-0">
                    <User className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm appearance-none"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    {/* <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Team Code
                      </label>
                      <input
                        type="text"
                        name="teamCode"
                        value={formData.teamCode}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                      />
                    </div> */}
                  </div>
                </div>
              </div>
            </form>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200 mt-8">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300"
              >
                <ChevronLeft size={18} /> Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={updateLoading}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
              >
                {updateLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <CheckCircle size={18} /> Update Agent
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AgentEdit;
