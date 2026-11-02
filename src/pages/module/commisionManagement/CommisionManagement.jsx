

// import React, { useState, useEffect } from "react";
// import { NavLink } from "react-router-dom";
// import { LayoutDashboard } from "lucide-react";

// // Redux imports hata diye gaye hain
// import LoaderSpinner from "../../../components/uiElement/LoaderSpinner";

// // Mock Data
// const INITIAL_AGENTS = [
//   {
//     id: "1",
//     name: "Rahul Sharma",
//     approvedLeads: 12,
//     commissionPerLead: 500,
//     totalCommission: 6000,
//     adjustment: 0,
//     locked: false,
//   },
//   {
//     id: "2",
//     name: "Amit Kumar",
//     approvedLeads: 25,
//     commissionPerLead: 600,
//     totalCommission: 15000,
//     adjustment: 500,
//     locked: false,
//   },
// ];

// export default function CommissionManagement() {
//   const [agents, setAgents] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Loading simulate karne ke liye useEffect
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setAgents(INITIAL_AGENTS);
//       setLoading(false);
//     }, 800);
//     return () => clearTimeout(timer);
//   }, []);

//   // Static Adjustment handler
//   const handleAdjustment = (id, value) => {
//     setAgents((prev) =>
//       prev.map((agent) =>
//         agent.id === id ? { ...agent, adjustment: Number(value) } : agent
//       )
//     );
//   };

//   // Static Lock handler
//   const lockCommission = (id) => {
//     setAgents((prev) =>
//       prev.map((agent) =>
//         agent.id === id ? { ...agent, locked: true } : agent
//       )
//     );
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center mt-20">
//         <LoaderSpinner />
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 min-h-screen">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 shadow-xl mb-8">
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//           <div>
//             <h1 className="text-2xl font-bold text-white flex items-center gap-3">
//               <LayoutDashboard className="w-7 h-7" />
//               Commission Management
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
//               <span className="text-white font-medium">
//                 Commission Management
//               </span>
//             </div>
//           </div>
//           <div className="bg-white/20 px-4 py-2 rounded-lg">
//             <p className="text-white text-sm">{agents.length} Total Agents</p>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
//         {/* Table Header */}
//         <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
//           <h2 className="text-xl font-bold text-gray-800">
//             Agent Commission Analytics
//           </h2>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
//               <tr className="text-sm text-gray-700">
//                 <th className="px-6 py-4 text-center font-semibold">Sr. No</th>
//                 <th className="px-6 py-4 text-center font-semibold">
//                   Agent Name
//                 </th>
//                 <th className="px-6 py-4 text-center font-semibold">
//                   Approved Leads
//                 </th>
//                 <th className="px-6 py-4 text-center font-semibold">
//                   Commission/Lead
//                 </th>
//                 <th className="px-6 py-4 text-center font-semibold">
//                   Total Commission
//                 </th>
//                 <th className="px-6 py-4 text-center font-semibold">
//                   Adjustment
//                 </th>
//                 <th className="px-6 py-4 text-center font-semibold">
//                   Final Amount
//                 </th>
//                 <th className="px-6 py-4 text-center font-semibold">Status</th>
//                 <th className="px-6 py-4 text-center font-semibold">Action</th>
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-gray-200">
//               {agents.length === 0 ? (
//                 <tr>
//                   <td colSpan="9" className="px-6 py-12 text-center">
//                     <div className="flex flex-col items-center justify-center">
//                       <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
//                         <div className="w-6 h-6 text-gray-400">!</div>
//                       </div>
//                       <h3 className="text-lg font-semibold text-gray-700 mb-2">
//                         No commission data found
//                       </h3>
//                       <p className="text-gray-500">
//                         No agent commission records available
//                       </p>
//                     </div>
//                   </td>
//                 </tr>
//               ) : (
//                 agents.map((agent, index) => {
//                   const total = agent.totalCommission;
//                   const finalAmount = total + agent.adjustment;

//                   return (
//                     <tr
//                       key={agent.id}
//                       className={`hover:bg-gray-50 transition-colors ${
//                         agent.locked ? "opacity-70" : ""
//                       }`}
//                     >
//                       <td className="px-6 py-4 text-center">
//                         <span className="font-semibold text-gray-800">
//                           {index + 1}
//                         </span>
//                       </td>

//                       <td className="px-6 py-4 text-center">
//                         <p className="font-semibold text-gray-800">
//                           {agent.name}
//                         </p>
//                       </td>

//                       <td className="px-6 py-4 text-center">
//                         <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
//                           {agent.approvedLeads}
//                         </span>
//                       </td>

//                       <td className="px-6 py-4 text-center">
//                         <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
//                           ₹{agent.commissionPerLead}
//                         </span>
//                       </td>

//                       <td className="px-6 py-4 text-center">
//                         <span className="font-semibold text-gray-800">
//                           {total.toLocaleString()}
//                         </span>
//                       </td>

//                       <td className="px-6 py-4 text-center">
//                         <input
//                           type="number"
//                           disabled={agent.locked}
//                           value={agent.adjustment}
//                           onChange={(e) =>
//                             handleAdjustment(agent.id, e.target.value)
//                           }
//                           className="w-24 px-3 py-2 rounded-xl text-center bg-white border border-gray-300 focus:ring-2 focus:ring-orange-400 outline-none disabled:bg-gray-100 disabled:text-gray-500 shadow-sm"
//                         />
//                       </td>

//                       <td className="px-6 py-4 text-center">
//                         <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-2 rounded-lg inline-block">
//                           <p className="font-bold text-emerald-700">
//                             ₹{finalAmount.toLocaleString()}
//                           </p>
//                         </div>
//                       </td>

//                       <td className="px-6 py-4 text-center">
//                         <span
//                           className={`px-3 py-1 rounded-full text-sm font-medium ${
//                             agent.locked
//                               ? "bg-red-100 text-red-800"
//                               : "bg-orange-100 text-orange-800"
//                           }`}
//                         >
//                           {agent.locked ? "Locked" : "Editable"}
//                         </span>
//                       </td>

//                       <td className="px-6 py-4 text-center">
//                         {!agent.locked && (
//                           <button
//                             onClick={() => lockCommission(agent.id)}
//                             className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 whitespace-nowrap"
//                           >
//                             Approve & Lock
//                           </button>
//                         )}
//                       </td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Table Footer */}
//         <div className="px-6 py-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
//           <div className="flex items-center justify-between text-sm text-gray-600">
//             <span>Showing {agents.length} commission records</span>
//             <div className="flex items-center gap-4">
//               <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
//                 Previous
//               </button>
//               <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg">
//                 1
//               </span>
//               <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
//                 Next
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { DollarSign, Target } from "lucide-react";
import { fetchApproveLeadsCommission } from "../../../redux/slice/commisionManagement/commissionSlice";
import LoaderSpinner from "../../../components/uiElement/LoaderSpinner";

export default function CommissionManagement() {
  const dispatch = useDispatch();
  const { leads, stats, loading, error } = useSelector((state) => state.commission);

  useEffect(() => {
    dispatch(fetchApproveLeadsCommission());
  }, [dispatch]);

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 shadow-xl mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-white">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <DollarSign className="w-8 h-8" />
              Commission Management
            </h1>
            <div className="text-sm text-orange-100 flex items-center gap-2 mt-4">
              <NavLink to="/dashboard" className="hover:text-white transition-colors">
                <span className="bg-white/20 px-3 py-1 rounded-lg">Dashboard</span>
              </NavLink>
              <span>›</span>
              <span className="font-medium">Approve Leads Commission</span>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10">
              <p className="text-xs opacity-80 uppercase font-bold tracking-wider">Total Amount</p>
              {/* <p className="text-xl font-bold">₹{stats.totalAmount.toLocaleString()}</p> */}
              <p className="text-xl font-bold">₹{stats.totalAmount}</p>
            </div>
            <div className="bg-white/20 px-4 text-center py-2 rounded-xl backdrop-blur-sm border border-white/10">
              <p className="text-xs opacity-80 uppercase font-bold tracking-wider">Total Leads</p>
              <p className="text-xl font-bold">{stats.totalCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-5 text-center font-bold text-gray-700">Sr.No</th>
                <th className="px-4 py-5 text-left font-bold text-gray-700">Project Name</th>
                <th className="px-4 py-5 text-left font-bold text-gray-700">Submitted By</th>
                <th className="px-4 py-5 text-center font-bold text-gray-700">Role</th>
                <th className="px-4 py-5 text-center font-bold text-gray-700">Date</th>
                <th className="px-4 py-5 text-center font-bold text-gray-700">Project Price</th>
                <th className="px-4 py-5 text-center font-bold text-gray-700">Comm %</th>
                <th className="px-4 py-5 text-center font-bold text-gray-700">Comm Amount</th>
                <th className="px-4 py-5 text-center font-bold text-gray-700">Lead Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                // Table Internal Loader exactly like Lead Management
                <tr>
                  <td colSpan="9" className="px-6 py-12">
                    <div className="flex flex-col items-center justify-center min-h-[200px]">
                      <LoaderSpinner />
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center text-red-500 font-medium">
                    {error}
                  </td>
                </tr>
              ) : leads.length > 0 ? (
                leads.map((item, index) => (
                  <tr key={item.leadId} className="hover:bg-orange-50/30 transition-colors">
                    <td className="px-4 py-4 text-center font-medium text-gray-500">{index + 1}</td>
                    <td className="px-4 py-4 font-bold text-gray-800">{item.projectName}</td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-gray-700">{item.submittedByName}</p>
                      <p className="text-[10px] text-gray-400 font-mono">{item.leadId}</p>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                        item.submittedByRole === 'vendor' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                      }`}>
                        {item.submittedByRole}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center text-gray-600">
                      {new Date(item.createdAt).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-4 py-4 text-center font-semibold text-gray-700 italic">
                      ₹{item.projectPrice.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-center">
                       <span className="bg-gray-100 px-2 py-1 rounded-md font-bold text-gray-600">{item.commissionPercent}%</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <p className="text-orange-600 font-bold">₹{item.commissionAmount.toLocaleString()}</p>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-lg font-bold">
                        {item.userLeadCount}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-20 text-gray-400 font-medium">No Data Found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}