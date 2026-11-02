// import {
//   Edit,
//   Eye,
//   PlusCircle,
//   Search,
//   ChevronLeft,
//   ChevronRight,
//   Landmark,
// } from "lucide-react";
// import React, { useState, useEffect, useMemo } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchAllVendors,
//   setVendorFilters,
// } from "../../../redux/slice/vendors/getallVendorsSlice";
// import LoaderSpinner from "../../../components/uiElement/LoaderSpinner";
// import debounce from "lodash/debounce";

// const Vendor = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   // Redux State
//   const { vendors, loading, error, pagination, currentFilters } = useSelector(
//     (state) => state.allVendors,
//   );

//   // Local state for instant UI input feel
//   const [searchTerm, setSearchTerm] = useState(currentFilters.search);

//   // 1. Initial & Filter change Fetch
//   useEffect(() => {
//     dispatch(fetchAllVendors());
//   }, [
//     dispatch,
//     currentFilters.page,
//     currentFilters.limit,
//     currentFilters.search,
//   ]);

//   // 2. Debounced Search Function (Server-side)
//   const debouncedSearch = useMemo(
//     () =>
//       debounce((value) => {
//         // Search karte waqt hamesha page 1 se start karein
//         dispatch(setVendorFilters({ search: value, page: 1 }));
//       }, 500),
//     [dispatch],
//   );

//   const handleSearchChange = (e) => {
//     const value = e.target.value;
//     setSearchTerm(value);
//     debouncedSearch(value);
//   };

//   const goToPage = (p) => {
//     dispatch(setVendorFilters({ page: p }));
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   // Note: Ab vendors data API se filter hokar aa raha hai, isliye client-side filter ki zaroorat nahi
//   const displayVendors = vendors;

//   return (
//     <div className="p-6 min-h-screen">
//       {/* Header - UI remains same */}
//       <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 shadow-xl mb-8">
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//           <div>
//             <h1 className="text-2xl font-bold text-white flex items-center gap-3">
//               <Landmark className="w-7 h-7" />
//               Vendor Management
//             </h1>
//             <div className="text-sm text-orange-100 flex items-center gap-2 mt-3">
//               <NavLink
//                 to="/dashboard"
//                 className="flex items-center gap-1 hover:text-white transition-colors"
//               >
//                 <span className="bg-white/20 px-3 py-1 rounded-lg">
//                   Dashboard
//                 </span>
//               </NavLink>
//               <span className="text-white/60">›</span>
//               <span className="text-white font-medium">Vendor Analytics</span>
//             </div>
//           </div>
//           <div className="bg-white/20 px-4 py-2 rounded-lg border border-white/10">
//             <p className="text-white text-sm font-medium">
//               {pagination.totalVendors} Total Vendors
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Controls Bar */}
//       <div className="flex flex-col md:flex-row gap-4 mb-8 mt-5">
//         <div className="flex-1 relative">
//           <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//           <input
//             type="text"
//             placeholder="Search vendors by name (Global)..."
//             value={searchTerm}
//             onChange={handleSearchChange}
//             className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white shadow-sm"
//           />
//         </div>

//         <button
//           className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
//           onClick={() => navigate("/vendor/addvendor")}
//         >
//           <PlusCircle className="w-5 h-5" />
//           Add Vendor
//         </button>
//       </div>

//       {/* Table Section - UI remains same */}
//       <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 relative">
//         <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white text-center">
//           <h2 className="text-xl font-bold text-gray-800">
//             Vendor Referral Analytics
//           </h2>
//         </div>

//         <div className="overflow-x-auto min-h-[400px]">
//           {loading ? (
//             <div className="py-20 flex justify-center items-center">
//               <LoaderSpinner />
//             </div>
//           ) : (
//             <table className="w-full">
//               <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
//                 <tr className="text-sm text-gray-700">
//                   <th className="px-6 py-4 text-left font-semibold">
//                     Vendor Name
//                   </th>
//                   <th className="px-3 py-4 text-left font-semibold">
//                     Total Agents
//                   </th>
//                   <th className="px-3 py-4 text-left font-semibold">
//                     Pending Leads
//                   </th>
//                   <th className="px-3 py-4 text-left font-semibold">
//                     Total Leads
//                   </th>
//                   <th className="px-3 py-4 text-left font-semibold">
//                     Approved
//                   </th>
//                   <th className="px-3 py-4 text-left font-semibold">
//                     Rejected
//                   </th>
//                   <th className="px-6 py-4 text-left font-semibold">
//                     Commission Rate
//                   </th>
//                   <th className="px-10 py-4 text-left font-semibold">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-gray-200">
//                 {displayVendors.length === 0 ? (
//                   <tr>
//                     <td colSpan="8" className="px-6 py-12 text-center">
//                       <div className="flex flex-col items-center justify-center">
//                         <Search className="w-12 h-12 text-gray-300 mb-4" />
//                         <h3 className="text-lg font-semibold text-gray-400">
//                           {error ||
//                             (searchTerm
//                               ? `No results found for "${searchTerm}"`
//                               : "No vendors found")}
//                         </h3>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   displayVendors.map((vendor, index) => (
//                     <tr
//                       key={vendor._id || index}
//                       className="hover:bg-gray-50 transition-colors"
//                     >
//                       <td className="px-6 py-4">
//                         <p className="font-semibold text-gray-800">
//                           {vendor.name}
//                         </p>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
//                           {vendor.totalAgents}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm font-medium">
//                           {vendor.submittedLeads}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 font-semibold text-gray-800">
//                         {vendor.totalLeads}
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
//                           {vendor.approvedLeads}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm font-medium">
//                           {vendor.rejectedLeads}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4">
//                         <p className="text-center font-bold text-emerald-700">
//                           {vendor.commissionRate
//                             ? `${vendor.commissionRate}%`
//                             : "0%"}
//                         </p>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-3">
//                           <button
//                             onClick={() =>
//                               navigate(`/vendor/view/${vendor._id}`)
//                             }
//                             className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
//                           >
//                             <Eye className="w-5 h-5" />
//                           </button>
//                           <button
//                             onClick={() =>
//                               navigate(`/vendor/edit/${vendor._id}`)
//                             }
//                             className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg"
//                           >
//                             <Edit className="w-5 h-5" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           )}
//         </div>

//         {/* Pagination Footer - UI remains same */}
//         <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
//           <p className="text-sm text-gray-700 font-semibold">
//             Showing{" "}
//             {Math.min(
//               (pagination.currentPage - 1) * pagination.limit + 1,
//               pagination.totalVendors,
//             )}{" "}
//             to{" "}
//             {Math.min(
//               pagination.currentPage * pagination.limit,
//               pagination.totalVendors,
//             )}{" "}
//             of {pagination.totalVendors} entries
//           </p>

//           <div className="flex items-center gap-2">
//             <button
//               className="p-2 rounded-lg border border-gray-200 bg-white text-gray-400 hover:text-orange-500 hover:border-orange-500 disabled:opacity-50 transition-all shadow-sm"
//               disabled={pagination.currentPage === 1 || loading}
//               onClick={() => goToPage(pagination.currentPage - 1)}
//             >
//               <ChevronLeft size={18} />
//             </button>

//             <div className="flex gap-1">
//               {Array.from({ length: pagination.totalPages }).map((_, idx) => (
//                 <button
//                   key={idx}
//                   disabled={loading}
//                   onClick={() => goToPage(idx + 1)}
//                   className={`w-9 h-9 rounded-lg font-bold text-sm transition-all shadow-sm ${
//                     pagination.currentPage === idx + 1
//                       ? "bg-orange-500 text-white shadow-orange-200"
//                       : "bg-white border border-gray-200 text-gray-600 hover:border-orange-500 hover:text-orange-500"
//                   }`}
//                 >
//                   {idx + 1}
//                 </button>
//               ))}
//             </div>

//             <button
//               className="p-2 rounded-lg border border-gray-200 bg-white text-gray-400 hover:text-orange-500 hover:border-orange-500 disabled:opacity-50 transition-all shadow-sm"
//               disabled={
//                 pagination.currentPage === pagination.totalPages || loading
//               }
//               onClick={() => goToPage(pagination.currentPage + 1)}
//             >
//               <ChevronRight size={18} />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Vendor;


import {
  Edit,
  Eye,
  PlusCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  Landmark,
  Calendar,
  Filter,
  X,
  Trash2,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  fetchAllVendors,
  setVendorFilters,
  updateVendorStatus,
  deleteVendor,
} from "../../../redux/slice/vendors/getallVendorsSlice";
import LoaderSpinner from "../../../components/uiElement/LoaderSpinner";
import debounce from "lodash/debounce";

const Vendor = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const statusFilter = searchParams.get("status") || "all";

  const { vendors, loading, error, pagination, currentFilters, statusUpdating, deleteLoading } = useSelector(
    (state) => state.allVendors
  );

  const [searchTerm, setSearchTerm] = useState(currentFilters.search || "");
  const [dateFilter, setDateFilter] = useState(currentFilters.dateFilter || "All");

  useEffect(() => {
    dispatch(fetchAllVendors());
  }, [
    dispatch,
    currentFilters.page,
    currentFilters.limit,
    currentFilters.search,
    currentFilters.dateFilter,
    currentFilters.status,
  ]);

  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        dispatch(setVendorFilters({ search: value, page: 1 }));
      }, 500),
    [dispatch]
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const parseDate = (val) => {
    if (!val) return null;
    if (val instanceof Date) return isNaN(val.getTime()) ? null : val;
    if (typeof val === "number") return new Date(val);
    if (typeof val === "string") {
      const ddmmyyyyMatch = val.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
      if (ddmmyyyyMatch) {
        const day = parseInt(ddmmyyyyMatch[1], 10);
        const month = parseInt(ddmmyyyyMatch[2], 10) - 1;
        const year = parseInt(ddmmyyyyMatch[3], 10);
        return new Date(year, month, day);
      }
      const parsed = new Date(val);
      return isNaN(parsed.getTime()) ? null : parsed;
    }
    return null;
  };

  const matchesDateFilter = (itemDate, filterType) => {
    if (filterType === "All" || !filterType) return true;

    const d = parseDate(itemDate);
    if (!d) return false;

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    if (filterType === "Today") {
      return d >= todayStart && d <= todayEnd;
    }

    if (filterType === "Yesterday") {
      const yesterdayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 0, 0, 0);
      const yesterdayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59, 999);
      return d >= yesterdayStart && d <= yesterdayEnd;
    }

    if (filterType === "In Week") {
      const dayOfWeek = now.getDay();
      const distanceToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - distanceToMonday, 0, 0, 0, 0);
      return d >= weekStart && d <= todayEnd;
    }

    if (filterType === "In Month") {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      return d >= monthStart && d <= monthEnd;
    }

    return true;
  };

  const goToPage = (p) => {
    dispatch(setVendorFilters({ page: p }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const checkIsActive = (vendor) => {
    if (vendor.isActive !== undefined && vendor.isActive !== null) {
      return vendor.isActive;
    }
    if (vendor.status) {
      return vendor.status.toLowerCase() === "active";
    }
    return false;
  };

  const handleDateFilterChange = (e) => {
    const value = e.target.value;
    setDateFilter(value);
    dispatch(setVendorFilters({ dateFilter: value, page: 1 }));
  };

  const handleStatusChange = (e) => {
    const status = e.target.value;
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (status === "all") {
        newParams.delete("status");
      } else {
        newParams.set("status", status);
      }
      return newParams;
    });
    dispatch(setVendorFilters({ status, page: 1 }));
  };

  const handleToggleStatus = (vendorId) => {
    dispatch(updateVendorStatus(vendorId));
  };

  const [vendorToDelete, setVendorToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const openDeleteModal = (vendor) => {
    setVendorToDelete(vendor);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setVendorToDelete(null);
  };

  const confirmDeleteVendor = async () => {
    if (!vendorToDelete) return;
    const result = await dispatch(deleteVendor(vendorToDelete._id));
    if (deleteVendor.fulfilled.match(result)) {
      toast.success("Vendor deleted successfully!");
      closeDeleteModal();
    } else {
      toast.error(result.payload || "Failed to delete vendor.");
    }
  };

  const checkVendorLeadDate = (vendor, filterType) => {
    if (!filterType || filterType === "All") return true;

    // 1. If vendor contains leads array, check if any lead was created/submitted on that date
    if (vendor.leads && Array.isArray(vendor.leads) && vendor.leads.length > 0) {
      const hasLeadOnDate = vendor.leads.some((lead) => {
        const leadDate = lead.createdAt || lead.date || lead.updatedAt || lead.dateOfTransfer;
        return matchesDateFilter(leadDate, filterType);
      });
      if (hasLeadOnDate) return true;
    }

    // 2. Otherwise check vendor lead activity date fields or registration date
    const d = vendor.lastLeadDate || vendor.leadCreatedAt || vendor.createdAt || vendor.date || vendor.joiningDate || vendor.updatedAt;
    return matchesDateFilter(d, filterType);
  };

  const dateFilteredVendors = useMemo(() => {
    if (!Array.isArray(vendors)) return [];
    if (!dateFilter || dateFilter === "All") return vendors;
    return vendors.filter((vendor) => checkVendorLeadDate(vendor, dateFilter));
  }, [vendors, dateFilter]);

  const getVendorLatestTimestamp = (vendor) => {
    let maxTime = 0;
    if (vendor.leads && Array.isArray(vendor.leads) && vendor.leads.length > 0) {
      vendor.leads.forEach((l) => {
        const leadDateStr = l.createdAt || l.date || l.updatedAt || l.dateOfTransfer;
        const d = parseDate(leadDateStr);
        if (d && d.getTime() > maxTime) maxTime = d.getTime();
      });
    }
    const vendorDateStr = vendor.lastLeadDate || vendor.leadCreatedAt || vendor.createdAt || vendor.date || vendor.joiningDate || vendor.updatedAt;
    const vd = parseDate(vendorDateStr);
    if (vd && vd.getTime() > maxTime) maxTime = vd.getTime();
    return maxTime;
  };

  const displayVendors = useMemo(() => {
    let list = Array.isArray(vendors) ? [...vendors] : [];

    if (statusFilter && statusFilter.toLowerCase() === "active") {
      list = list.filter((vendor) => checkIsActive(vendor));
    } else if (statusFilter && (statusFilter.toLowerCase() === "blocked" || statusFilter.toLowerCase() === "inactive")) {
      list = list.filter((vendor) => !checkIsActive(vendor));
    }

    if (dateFilter && dateFilter !== "All") {
      list = list.filter((vendor) => checkVendorLeadDate(vendor, dateFilter));
    }

    return list.sort((a, b) => {
      const timeA = getVendorLatestTimestamp(a);
      const timeB = getVendorLatestTimestamp(b);
      return timeB - timeA;
    });
  }, [vendors, statusFilter, dateFilter]);

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 shadow-xl mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Landmark className="w-7 h-7" />
              Vendor Management
            </h1>
            <div className="text-sm text-orange-100 flex items-center gap-2 mt-3">
              <NavLink
                to="/dashboard"
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                <span className="bg-white/20 px-3 py-1 rounded-lg">Dashboard</span>
              </NavLink>
              <span className="text-white/60">›</span>
              <span className="text-white font-medium">Vendor Analytics</span>
            </div>
          </div>
          <div className="bg-white/20 px-4 py-2 rounded-lg border border-white/10">
            <p className="text-white text-sm font-medium">
              {pagination.totalVendors} Total Vendors
            </p>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8 mt-5">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search vendors by name (Global)..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white shadow-sm"
          />
        </div>

        {/* Date Filter Dropdown */}
        <div className="relative">
          <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          <select
            value={dateFilter}
            onChange={handleDateFilterChange}
            className="w-full lg:w-48 pl-11 pr-8 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white shadow-sm appearance-none cursor-pointer text-sm font-medium text-gray-700"
          >
            <option value="All">All Dates</option>
            <option value="Today">Today</option>
            <option value="Yesterday">Yesterday</option>
            <option value="In Week">In Week</option>
            <option value="In Month">In Month</option>
          </select>
        </div>

        {/* Vendor Status Filter Dropdown */}
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          <select
            value={statusFilter === "inactive" ? "blocked" : statusFilter}
            onChange={handleStatusChange}
            className="w-full lg:w-60 pl-11 pr-8 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white shadow-sm appearance-none cursor-pointer text-sm font-semibold text-gray-700"
          >
            <option value="all">Total Vendors ({dateFilter === "All" && pagination.totalVendors ? pagination.totalVendors : dateFilteredVendors.length})</option>
            <option value="active">Active Vendors ({dateFilteredVendors.filter((v) => checkIsActive(v)).length})</option>
            <option value="blocked">Blocked Vendors ({dateFilteredVendors.filter((v) => !checkIsActive(v)).length})</option>
          </select>
        </div>

        {/* Add Vendor Button */}
        <button
          className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all whitespace-nowrap cursor-pointer"
          onClick={() => navigate("/vendor/addvendor")}
        >
          <PlusCircle className="w-5 h-5" />
          Add Vendor
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 relative">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white text-center">
          <h2 className="text-xl font-bold text-gray-800">Vendor Referral Analytics</h2>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="py-20 flex justify-center items-center">
              <LoaderSpinner />
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr className="text-sm text-gray-700">
                  <th className="px-6 py-4 text-left font-semibold">Vendor Name</th>
                  <th className="px-3 py-4 text-left font-semibold">Total Agents</th>
                  <th className="px-3 py-4 text-left font-semibold">Pending Leads</th>
                  <th className="px-3 py-4 text-left font-semibold">Total Leads</th>
                  <th className="px-3 py-4 text-left font-semibold">Approved</th>
                  <th className="px-3 py-4 text-left font-semibold">Rejected</th>
                  <th className="px-6 py-4 text-left font-semibold">Commission Rate</th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>
                  <th className="px-10 py-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {displayVendors.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Search className="w-12 h-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-400">
                          {error ||
                            (searchTerm || dateFilter !== "All"
                              ? `No results found for applied filters`
                              : "No vendors found")}
                        </h3>
                      </div>
                    </td>
                  </tr>
                ) : (
                  displayVendors.map((vendor, index) => (
                    <tr
                      key={vendor._id || index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-800">{vendor.name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                          {vendor.totalAgents}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm font-medium">
                          {vendor.submittedLeads}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-800">
                        {vendor.totalLeads}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                          {vendor.approvedLeads}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm font-medium">
                          {vendor.rejectedLeads}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-center font-bold text-emerald-700">
                          {vendor.commissionRate ? `${vendor.commissionRate}%` : "0%"}
                        </p>
                      </td>

                      {/* ✅ Status Toggle Column */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStatus(vendor._id)}
                          disabled={statusUpdating === vendor._id}
                          className={`relative inline-flex items-center gap-2 px-3 py-1.5 cursor-pointer rounded-full text-xs font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed ${
                            vendor.isActive
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-red-100 text-red-700 hover:bg-red-200"
                          }`}
                        >
                          {statusUpdating === vendor._id ? (
                            <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <span
                              className={`w-2 h-2 rounded-full ${
                                vendor.isActive ? "bg-green-500" : "bg-red-500"
                              }`}
                            />
                          )}
                          {vendor.isActive ? "Active" : "Blocked"}
                        </button>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => navigate(`/vendor/view/${vendor._id}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="View Vendor Details"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => navigate(`/vendor/edit/${vendor._id}`)}
                            className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Vendor"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(vendor)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Vendor"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-700 font-semibold">
            Showing{" "}
            {Math.min(
              (pagination.currentPage - 1) * pagination.limit + 1,
              pagination.totalVendors
            )}{" "}
            to{" "}
            {Math.min(
              pagination.currentPage * pagination.limit,
              pagination.totalVendors
            )}{" "}
            of {pagination.totalVendors} entries
          </p>

          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-lg border border-gray-200 bg-white text-gray-400 hover:text-orange-500 hover:border-orange-500 disabled:opacity-50 transition-all shadow-sm"
              disabled={pagination.currentPage === 1 || loading}
              onClick={() => goToPage(pagination.currentPage - 1)}
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex gap-1">
              {Array.from({ length: pagination.totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  disabled={loading}
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
              className="p-2 rounded-lg border border-gray-200 bg-white text-gray-400 hover:text-orange-500 hover:border-orange-500 disabled:opacity-50 transition-all shadow-sm"
              disabled={pagination.currentPage === pagination.totalPages || loading}
              onClick={() => goToPage(pagination.currentPage + 1)}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal Overlay */}
      {isDeleteModalOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={closeDeleteModal}
        >
          <div
            className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl flex flex-col items-center justify-center gap-6 animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-orange-500">
              Delete
            </h3>
            <p className="text-gray-800 font-bold text-base md:text-lg">
              Are You Sure Want To Delete?
            </p>
            <div className="flex items-center justify-center gap-4 w-full mt-2">
              <button
                type="button"
                onClick={closeDeleteModal}
                className="flex-1 py-2.5 px-6 border border-black text-black font-semibold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer text-base"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteVendor}
                disabled={deleteLoading === vendorToDelete?._id}
                className="flex-1 py-2.5 px-6 bg-[#FF3B30] hover:bg-[#E03126] text-white font-semibold rounded-xl transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 text-base shadow-sm"
              >
                {deleteLoading === vendorToDelete?._id ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={1500} />
    </div>
  );
};

export default Vendor;