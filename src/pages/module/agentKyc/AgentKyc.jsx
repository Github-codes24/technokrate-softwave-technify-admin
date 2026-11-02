
import React, { useEffect } from "react";
import { LayoutDashboard, Users, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUserStatus, setKycFilters } from "../../../redux/slice/kycmanagement/agentKycSlice";
import LoaderSpinner from "../../../components/uiElement/LoaderSpinner";

const statusStyles = {
    true: "bg-emerald-100 text-emerald-700 border-emerald-200", // Approved
    false: "bg-rose-100 text-rose-700 border-rose-200",       // Pending/False
};

const AgentKyc = () => {
    const dispatch = useDispatch();
    const { users, loading, pagination, currentFilters } = useSelector((state) => state.userkyc);
    const navigate = useNavigate()
    useEffect(() => {
        dispatch(fetchAllUserStatus());
    }, [dispatch, currentFilters.page]);

    const goToPage = (p) => {
        dispatch(setKycFilters({ page: p }));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // 🔹 1. FULL SCREEN LOADER (Sirf tab jab pehli baar data load ho raha ho)
    if (loading && users.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoaderSpinner />
            </div>
        );
    }

    return (
        <div className="p-6 min-h-screen">
            {/* 🔹 Header Section */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 shadow-xl mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                            <Users className="w-8 h-8" />
                            Agent KYC Management
                        </h1>
                        <div className="text-sm text-orange-100 flex items-center gap-2 mt-5">
                             <NavLink
                                            to="/dashboard"
                                            className="hover:text-white transition-colors"
                                          >
                                            <span className="bg-white/20 px-3 py-1 rounded-lg">
                                              Dashboard
                                            </span>
                                          </NavLink>
                            <span className="text-white/60">›</span>
                            <span className="text-white font-medium">Agent KYC Management</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 🔹 Table Content Card */}
           <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
    <div className="overflow-x-auto">
        <table className="w-full text-center border-collapse">
            <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">SR.NO</th>
                    {/* Yahan text-center add kiya */}
                    <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">User Details</th>
                    <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Phone Number</th>
                    <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Role</th>
                    <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">KYC Status</th>
                    <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
                {loading ? (
                    <tr>
                        {/* colSpan 6 kiya kyunki 6 columns hain */}
                        <td colSpan="6" className="py-24">
                            <div className="flex justify-center items-center w-full">
                                <LoaderSpinner /> 
                            </div>
                        </td>
                    </tr>
                ) : users.length === 0 ? (
                    <tr>
                        <td colSpan="6" className="py-20 text-center text-gray-400 font-medium">
                            No users found
                        </td>
                    </tr>
                ) : (
                    users.map((row, index) => (
                        <tr key={row._id} className="hover:bg-orange-50/30 transition-colors group">
                            <td className="px-6 py-5 text-center text-sm font-semibold text-gray-400">
                                {String((pagination.currentPage - 1) * pagination.limit + (index + 1)).padStart(2, '0')}
                            </td>
                            <td className="px-6 py-5">
                                {/* Name ko center karne ke liye justify-center add kiya */}
                                <div className="flex items-center justify-center gap-3">
                                    <p className="font-bold text-gray-800">{row.name || "N/A"}</p>
                                </div>
                            </td>
                            <td className="px-6 py-5 text-center text-sm font-medium text-gray-600">
                                {row.phone}
                            </td>
                            <td className="px-6 py-5 text-center text-sm font-medium text-gray-500 uppercase">
                                {row.role}
                            </td>
                            <td className="px-6 py-5 text-center">
                                <span className={`px-4 py-1.5 rounded-full text-[11px] font-bold border uppercase tracking-wider ${statusStyles[row.kycStatus]}`}>
                                    {row.kycStatus === "true" || row.kycStatus === true ? "Verified" : "Pending"}
                                </span>
                            </td>
                            <td className="px-6 py-5">
                                {/* Eye icon ko center karne ke liye flex justify-center */}
                                <button
                          onClick={() =>
                            navigate(
                              `/agentkyc/viewkyc/${row._id}`,
                            )
                          }
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-all"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    </div>

    {/* Pagination Bar remains same as it was already handling responsiveness well */}
    {!loading && pagination.totalUsers > 0 && (
        <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-700 font-semibold">
                Showing {Math.min((pagination.currentPage - 1) * pagination.limit + 1, pagination.totalUsers)} to {Math.min(pagination.currentPage * pagination.limit, pagination.totalUsers)} of {pagination.totalUsers} entries
            </p>

            <div className="flex items-center gap-2">
                <button 
                    className="p-2 rounded-lg border border-gray-200 bg-white text-gray-400 hover:text-orange-500 disabled:opacity-50 transition-all"
                    disabled={pagination.currentPage === 1}
                    onClick={() => goToPage(pagination.currentPage - 1)}
                >
                    <ChevronLeft size={18} />
                </button>

                <div className="flex gap-1">
                    {Array.from({ length: pagination.totalPages }).map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => goToPage(idx + 1)}
                            className={`w-9 h-9 rounded-lg font-bold text-sm transition-all shadow-sm ${
                                pagination.currentPage === idx + 1
                                    ? "bg-orange-500 text-white shadow-orange-200"
                                    : "bg-white border border-gray-200 text-gray-600 hover:border-orange-500 hover:text-orange-500"
                            }`}
                        >
                            {idx + 1}
                        </button>
                    ))}
                </div>

                <button 
                    className="p-2 rounded-lg border border-gray-200 bg-white text-gray-400 hover:text-orange-500 disabled:opacity-50 transition-all"
                    disabled={pagination.currentPage === pagination.totalPages}
                    onClick={() => goToPage(pagination.currentPage + 1)}
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    )}
</div>


        </div>
    );
};

export default AgentKyc;