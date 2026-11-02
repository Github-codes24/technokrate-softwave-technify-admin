import { useNavigate, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Loader2,
  Calendar,
  Shield,
  Activity,
  Clock,
} from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../../../redux/slice/profile/getProfile";
import LoaderSpinner from "../../../components/uiElement/LoaderSpinner";
const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { adminData, loading, error } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="mt-55">
        <LoaderSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center mt-10 font-bold p-10 bg-red-50 rounded-xl mx-6">
        Error: {error}
      </div>
    );
  }

  // Date Formatter Helper
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6  min-h-screen">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 shadow-xl mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <LayoutDashboard className="w-7 h-7" />
          Admin Profile
        </h1>
        <div className="text-sm text-orange-100 flex items-center gap-2 mt-3">
          <NavLink
            to="/dashboard"
            className="bg-white/20 px-3 py-1 rounded-lg hover:text-white transition-colors"
          >
            Dashboard
          </NavLink>
          <span className="text-white/60">›</span>
          <span className="text-white font-medium">Profile</span>
        </div>
      </div>

      {/* MAIN PROFILE CARD */}
      <div className="max-w-full mx-auto bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-10">
          <div className="flex flex-col md:flex-row items-center gap-10">
            {/* Profile Image */}
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa"
                alt="profile"
                className="w-40 h-40 rounded-full object-cover shadow-xl border-4 border-orange-100 transition-transform duration-300 hover:scale-105"
              />
              <div
                className={`absolute bottom-2 right-4 w-6 h-6 rounded-full border-4 border-white ${adminData?.isActive ? "bg-green-500" : "bg-red-500"}`}
              ></div>
            </div>

            <div className="flex-1 w-full">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 capitalize">
                    {adminData?.name || "N/A"}
                  </h2>
                  <p className="text-gray-700 font-medium flex items-center gap-2 mt-2">
                    <Shield size={16} /> {adminData?.role?.toUpperCase()}
                  </p>
                </div>
                <button
                  onClick={() => navigate("/edit-profile")}
                  className="px-6 py-2 rounded-xl border-2 border-orange-400 text-orange-600 font-bold hover:bg-orange-400 hover:text-white transition-all active:scale-95 shadow-sm"
                >
                  Edit Profile
                </button>
              </div>

              <hr className="my-6 border-gray-100" />

              {/* Data Grid: Showing all fields from API */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Phone Number
                  </p>
                  <p className="text-gray-800 font-semibold text-lg mt-1">
                    +91 {adminData?.phone || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Email ID
                  </p>
                  <p className="text-gray-800 font-semibold text-lg mt-1">
                    {adminData?.email || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Account Status
                  </p>
                  <p
                    className={`font-bold text-lg mt-1 ${adminData?.isActive ? "text-green-600" : "text-red-600"}`}
                  >
                    {adminData?.isActive ? "Active" : "Inactive"}
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="text-orange-500 mt-1" size={18} />
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Last Login
                    </p>
                    <p className="text-gray-700 font-medium">
                      {formatDate(adminData?.lastLoginAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="text-orange-500 mt-1" size={18} />
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Created On
                    </p>
                    <p className="text-gray-700 font-medium">
                      {formatDate(adminData?.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Activity className="text-orange-500 mt-1" size={18} />
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Verification Status
                    </p>
                    <p className="text-gray-700 font-medium">
                      {adminData?.verifiedReq
                        ? "Verified"
                        : "Pending Verification"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-12 pt-8 border-t border-gray-50">
            <button
              onClick={() => navigate("/adminverify")}
              className="px-12 py-4 bg-gradient-to-r from-orange-500 to-orange-600 
               text-white font-bold rounded-2xl shadow-lg shadow-orange-200 
               hover:shadow-orange-300 hover:-translate-y-1 transition-all 
               duration-300 active:scale-95"
            >
              Update Information
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
