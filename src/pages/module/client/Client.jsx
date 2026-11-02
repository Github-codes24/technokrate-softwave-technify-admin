// import {
//   ChevronLeft,
//   ChevronRight,
//   Eye,
//   Search,
//   Trash,
//   Loader2,
// } from "lucide-react";
// import React, { useState, useEffect } from "react";
// import { FaUserTie } from "react-icons/fa";
// import { NavLink, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchClientLeads } from "../../../redux/slice/client/clientSlice";
// import LoaderSpinner from "../../../components/uiElement/LoaderSpinner";

// const Client = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { leads, loading, error } = useSelector((state) => state.clients);

//   const [search, setSearch] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   useEffect(() => {
//     dispatch(fetchClientLeads());
//   }, [dispatch]);

//   const filtered = leads.filter(
//     (item) =>
//       item.client?.name?.toLowerCase().includes(search.toLowerCase()) ||
//       item.client?.email?.toLowerCase().includes(search.toLowerCase()),
//   );

//   const totalPages = Math.ceil(filtered.length / itemsPerPage);
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);

//   const goToPage = (pageNumber) => {
//     if (pageNumber >= 1 && pageNumber <= totalPages) {
//       setCurrentPage(pageNumber);
//     }
//   };

//   const handleDelete = (id) => {
//     if (!window.confirm("Are you sure you want to delete this client?")) return;
//     console.log("Delete client:", id);
//     // dispatch(deleteClient(id)); // apna delete action yahan add karo
//   };

//   return (
//     <div className="min-h-screen p-6">
//       {/* Header Banner */}
//       <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 shadow-xl mb-8">
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//           <div>
//             <h1 className="text-2xl font-bold text-white flex items-center gap-3">
//               <FaUserTie className="w-7 h-7" />
//               Client Analytics
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
//               <span className="text-white font-medium">Client Analytics</span>
//             </div>
//           </div>
//           <div className="bg-white/20 px-4 py-2 rounded-lg text-center min-w-[100px]">
//             <p className="text-white text-xs uppercase tracking-wider opacity-80">
//               Total Client
//             </p>
//             <p className="text-white text-xl font-bold">
//               {leads?.count || filtered.length || 0}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Search Bar */}
//       <div className="mt-5 flex items-center gap-4">
//         <div className="flex-1 relative">
//           <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//           <input
//             type="text"
//             placeholder="Search clients by name or email..."
//             value={search}
//             onChange={(e) => {
//               setSearch(e.target.value);
//               setCurrentPage(1);
//             }}
//             className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-100 bg-white shadow-sm transition-all"
//           />
//         </div>
//       </div>

//       {/* Table Card */}
//       <div className="mt-5 bg-white rounded-xl shadow overflow-hidden mb-8">
//         <div className="px-6 py-4 border-b border-gray-100 flex justify-center items-center">
//           <h2 className="text-gray-800 text-xl font-bold">
//             Client Referral Analytics
//           </h2>
//         </div>

//         <div className="overflow-x-auto">
//           {loading ? (
//             <div className="flex justify-center py-20">
//               <LoaderSpinner />
//             </div>
//           ) : (
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-b border-gray-100 bg-gray-50">
//                   <th className="px-6 py-3 text-gray-500 font-semibold text-center">Sr.No</th>
//                   {/* ✅ Lead ID Column */}
//                   <th className="px-6 py-3 text-gray-500 font-semibold text-center">Lead ID</th>
//                   <th className="px-6 py-3 text-gray-500 font-semibold text-center">Name</th>
//                   <th className="px-6 py-3 text-gray-500 font-semibold text-center">Phone</th>
//                   <th className="px-6 py-3 text-gray-500 font-semibold text-center">Email</th>
//                   <th className="px-6 py-3 text-gray-500 font-semibold text-center">Project Name</th>
//                   <th className="px-6 py-3 text-gray-500 font-semibold text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentItems.length === 0 ? (
//                   <tr>
//                     <td colSpan={7} className="text-center py-12 text-gray-400">
//                       {error
//                         ? `Error: ${error.message || "Failed to load"}`
//                         : "No clients found."}
//                     </td>
//                   </tr>
//                 ) : (
//                   currentItems.map((item, idx) => (
//                     <tr
//                       key={item._id}
//                       className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
//                     >
//                       <td className="px-6 py-4 text-gray-400 font-medium text-center">
//                         {indexOfFirstItem + idx + 1}
//                       </td>

//                       {/* ✅ Lead ID */}
//                       <td className="px-6 py-4 text-center">
//                         <span className="bg-gray-100 text-gray-600 border border-gray-200 px-3 py-1 rounded-full text-xs font-mono font-semibold inline-block">
//                           {item.leadId || "—"}
//                         </span>
//                       </td>

//                       <td className="px-6 py-4 font-semibold text-gray-800 text-center">
//                         {item.client?.name}
//                       </td>
//                       <td className="px-6 py-4 text-gray-600 text-center">
//                         {item.client?.phone}
//                       </td>
//                       <td className="px-6 py-4 text-blue-500 text-center">
//                         {item.client?.email}
//                       </td>
//                       <td className="px-6 py-4 text-center">
//                         <span className="bg-orange-50 text-orange-600 border border-orange-200 px-3 py-1 rounded-full text-xs font-medium inline-block">
//                           {item.projectName}
//                         </span>
//                       </td>

//                       {/* ✅ Actions - View + Delete */}
//                       <td className="px-6 py-4">
//                         <div className="flex items-center justify-center gap-3">
//                           <button
//                             onClick={() => navigate(`/client/viewclient/${item._id}`)}
//                             className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
//                           >
//                             <Eye className="w-5 h-5" />
//                           </button>
//                           <button
//                             onClick={() => handleDelete(item._id)}
//                             className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
//                           >
//                             <Trash className="w-5 h-5" />
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

//         {/* Pagination */}
//         {!loading && filtered.length > 0 && (
//           <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
//             <p className="text-sm text-gray-700 font-semibold">
//               Showing {indexOfFirstItem + 1} to{" "}
//               {Math.min(indexOfLastItem, filtered.length)} of {filtered.length}{" "}
//               entries
//             </p>

//             <div className="flex items-center gap-2">
//               <button
//                 className="p-2 rounded-lg border border-gray-200 bg-white disabled:opacity-50"
//                 disabled={currentPage === 1}
//                 onClick={() => goToPage(currentPage - 1)}
//               >
//                 <ChevronLeft size={18} />
//               </button>

//               <div className="flex gap-1">
//                 {Array.from({ length: totalPages }).map((_, idx) => (
//                   <button
//                     key={idx}
//                     onClick={() => goToPage(idx + 1)}
//                     className={`w-9 h-9 rounded-lg font-bold text-sm transition-all ${
//                       currentPage === idx + 1
//                         ? "bg-orange-500 text-white"
//                         : "bg-white border border-gray-200 text-gray-600"
//                     }`}
//                   >
//                     {idx + 1}
//                   </button>
//                 ))}
//               </div>

//               <button
//                 className="p-2 rounded-lg border border-gray-200 bg-white disabled:opacity-50"
//                 disabled={currentPage === totalPages}
//                 onClick={() => goToPage(currentPage + 1)}
//               >
//                 <ChevronRight size={18} />
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Client;

import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Search,
  Trash,
  Loader2,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { FaUserTie } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchClientLeads,
  deleteClientLead,
} from "../../../redux/slice/client/clientSlice";
import LoaderSpinner from "../../../components/uiElement/LoaderSpinner";

const Client = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { leads, loading, error, deleteLoading } = useSelector(
    (state) => state.clients,
  );

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchClientLeads());
  }, [dispatch]);

  const filtered = leads.filter(
    (item) =>
      item.client?.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.client?.email?.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // ✅ Delete Handler with Toast
  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    dispatch(deleteClientLead(id))
      .unwrap()
      .then(() => {
        toast.success("Lead deleted successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      })
      .catch(() => {
        toast.error("Failed to delete lead. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      });
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 shadow-xl mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <FaUserTie className="w-7 h-7" />
              Client Analytics
            </h1>
            <div className="text-sm text-orange-100 flex items-center gap-2 mt-3">
              <NavLink
                to="/dashboard"
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                <span className="bg-white/20 px-3 py-1 rounded-lg">
                  Dashboard
                </span>
              </NavLink>
              <span className="text-white/60">›</span>
              <span className="text-white font-medium">Client Analytics</span>
            </div>
          </div>
          <div className="bg-white/20 px-4 py-2 rounded-lg text-center min-w-[100px]">
            <p className="text-white text-xs uppercase tracking-wider opacity-80">
              Total Client
            </p>
            <p className="text-white text-xl font-bold">
              {leads?.count || filtered.length || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mt-5 flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search clients by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-100 bg-white shadow-sm transition-all"
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="mt-5 bg-white rounded-xl shadow overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-center items-center">
          <h2 className="text-gray-800 text-xl font-bold">
            Client Referral Analytics
          </h2>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-20">
              <LoaderSpinner />
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-6 py-3 text-gray-500 font-semibold text-center">
                    Sr.No
                  </th>
                  <th className="px-6 py-3 text-gray-500 font-semibold text-center">
                    Lead ID
                  </th>
                  <th className="px-6 py-3 text-gray-500 font-semibold text-center">
                    Name
                  </th>
                  <th className="px-6 py-3 text-gray-500 font-semibold text-center">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-gray-500 font-semibold text-center">
                    Email
                  </th>
                  <th className="px-6 py-3 text-gray-500 font-semibold text-center">
                    Project Name
                  </th>
                  <th className="px-6 py-3 text-gray-500 font-semibold text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-400">
                      {error
                        ? `Error: ${error.message || "Failed to load"}`
                        : "No clients found."}
                    </td>
                  </tr>
                ) : (
                  currentItems.map((item, idx) => (
                    <tr
                      key={item._id}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-gray-400 font-medium text-center">
                        {indexOfFirstItem + idx + 1}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span className="bg-gray-100 text-gray-600 border border-gray-200 px-3 py-1 rounded-full text-xs font-mono font-semibold inline-block">
                          {item.leadId || "—"}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-semibold text-gray-800 text-center">
                        {item.client?.name}
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-center">
                        {item.client?.phone}
                      </td>
                      <td className="px-6 py-4 text-blue-500 text-center">
                        {item.client?.email}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="bg-orange-50 text-orange-600 border border-orange-200 px-3 py-1 rounded-full text-xs font-medium inline-block">
                          {item.projectName}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() =>
                              navigate(`/client/viewclient/${item._id}`)
                            }
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Eye className="w-5 h-5" />
                          </button>

                          <button
                            onClick={() => handleDelete(item._id)}
                            disabled={deleteLoading === item._id}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {deleteLoading === item._id ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <Trash className="w-5 h-5" />
                            )}
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

        {/* Pagination */}
        {!loading && filtered.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-700 font-semibold">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, filtered.length)} of {filtered.length}{" "}
              entries
            </p>

            <div className="flex items-center gap-2">
              <button
                className="p-2 rounded-lg border border-gray-200 bg-white disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => goToPage(currentPage - 1)}
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToPage(idx + 1)}
                    className={`w-9 h-9 rounded-lg font-bold text-sm transition-all ${
                      currentPage === idx + 1
                        ? "bg-orange-500 text-white"
                        : "bg-white border border-gray-200 text-gray-600"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              <button
                className="p-2 rounded-lg border border-gray-200 bg-white disabled:opacity-50"
                disabled={currentPage === totalPages}
                onClick={() => goToPage(currentPage + 1)}
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

export default Client;
