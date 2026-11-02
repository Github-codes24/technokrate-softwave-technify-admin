// import React, { useEffect } from "react";
// import { 
//   CheckCircle2, 
//   Landmark, 
//   User, 
//   Fingerprint, 
//   ShieldCheck,
//   Copy,
//   Users,
//   Loader2,
//   AlertCircle
// } from "lucide-react";
// import { toast } from "react-toastify";
// import { NavLink, useParams, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// // import { fetchBankDetails, clearBankState } from "../redux/slices/bankDetailsSlice"; // Path check karein
// import { fetchBankDetails,clearBankState } from "../../../redux/slice/kycmanagement/bankDetailsSlice";
// const ViewKyc = () => {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
  
//   // Redux State
//   const { data, loading, error } = useSelector((state) => state.bankDetails);

//   useEffect(() => {
//     if (id) {
//       dispatch(fetchBankDetails(id));
//     }
//     return () => {
//       dispatch(clearBankState());
//     };
//   }, [id, dispatch]);

//   const copyToClipboard = (text) => {
//     if (!text) return;
//     navigator.clipboard.writeText(text);
//     toast.info("Copied to clipboard!");
//   };

//   // Loading State
//   if (loading) {
//     return (
//       <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
//         <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
//         <p className="text-gray-500 font-medium">Fetching Bank Details...</p>
//       </div>
//     );
//   }

//   // Error State
//   if (error) {
//     return (
//       <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
//         <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
//         <h2 className="text-xl font-bold text-gray-800">Error Occurred</h2>
//         <p className="text-gray-500 mb-6">{error}</p>
//         <button 
//           onClick={() => navigate("/agentkyc")}
//           className="bg-orange-500 text-white px-6 py-2 rounded-xl font-bold"
//         >
//           Back to List
//         </button>
//       </div>
//     );
//   }

//   // Agar data nahi mila
//   if (!data) return null;

//   return (
//     <div className="min-h-screen p-4 md:p-6">
//       <div className="max-w-full mx-auto">
        
//         {/* HEADER SECTION */}
//         <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 shadow-xl mb-8">
//           <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
//             <div>
//               <h1 className="text-2xl font-bold text-white flex items-center gap-3">
//                 <Users className="w-8 h-8" />
//                 Agent KYC Details
//               </h1>
//               <div className="text-sm text-orange-100 flex items-center gap-2 mt-5">
//                 <NavLink to="/dashboard" className="hover:text-white transition-colors">
//                   <span className="bg-white/20 px-3 py-1 rounded-lg">Dashboard</span>
//                 </NavLink>
//                 <span className="text-white/60">›</span>
//                 <NavLink to="/agentkyc" className="hover:text-white transition-colors">
//                   <span className="bg-white/20 px-3 py-1 rounded-lg">Agent Kyc</span>
//                 </NavLink>
//                 <span className="text-white/60">›</span>
//                 <span className="text-white font-medium">Bank Details</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* PROFILE HEADER CARD */}
//         <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row items-center gap-6">
//           <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-amber-400 rounded-3xl flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-orange-200 uppercase">
//             {data.accountHolderName?.charAt(0) || "U"}
//           </div>
//           <div className="text-center md:text-left">
//             <h1 className="text-2xl font-black text-gray-800 tracking-tight">{data.accountHolderName}</h1>
//             <p className="text-gray-500 font-medium">Agent Partner</p>
//             <div className="mt-2 flex items-center justify-center md:justify-start gap-2">
//                {data.isKycVerified ? (
//                  <span className="flex items-center gap-1 text-emerald-600 text-sm font-bold bg-emerald-50 px-3 py-1 rounded-lg">
//                     <CheckCircle2 size={14} /> KYC Approved
//                  </span>
//                ) : (
//                 <span className="flex items-center gap-1 text-amber-600 text-sm font-bold bg-amber-50 px-3 py-1 rounded-lg">
//                     <AlertCircle size={14} /> KYC Pending
//                 </span>
//                )}
//             </div>
//           </div>
//         </div>

//         {/* BANK DETAILS SECTION */}
//         <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
//           <div className="bg-gray-50/50 px-8 py-4 border-b border-gray-100 flex items-center gap-3">
//             <Landmark className="text-orange-500" size={20} />
//             <h3 className="font-bold text-gray-700 uppercase text-xs tracking-[0.2em]">Settlement Bank Details</h3>
//           </div>
          
//           <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            
//             <DetailItem 
//               label="Account Holder Name" 
//               value={data.accountHolderName} 
//               icon={<User size={16} />} 
//             />
            
//             <DetailItem 
//               label="Bank Name" 
//               value={data.bankName} 
//               icon={<Landmark size={16} />} 
//             />

//             <div className="relative group">
//               <DetailItem 
//                 label="Account Number" 
//                 value={data.accountNumber} 
//                 icon={<Fingerprint size={16} />} 
//               />
//               <button 
//                 onClick={() => copyToClipboard(data.accountNumber)}
//                 className="absolute right-0 top-8 p-2 text-gray-400 hover:text-orange-500 transition-colors"
//                 title="Copy Account Number"
//               >
//                 <Copy size={16} />
//               </button>
//             </div>

//             <div className="relative group">
//               <DetailItem 
//                 label="IFSC Code" 
//                 value={data.ifscCode} 
//                 icon={<ShieldCheck size={16} />} 
//               />
//               <button 
//                 onClick={() => copyToClipboard(data.ifscCode)}
//                 className="absolute right-0 top-8 p-2 text-gray-400 hover:text-orange-500 transition-colors"
//                 title="Copy IFSC Code"
//               >
//                 <Copy size={16} />
//               </button>
//             </div>

//           </div>

//           <div className="p-6 bg-orange-50/50 border-t border-orange-100 flex justify-center">
//             <p className="text-xs text-orange-600 font-medium flex items-center gap-2">
//               <CheckCircle2 size={14} /> Data fetched from verified banking records.
//             </p>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// /* Reusable Component for Details */
// const DetailItem = ({ label, value, icon }) => (
//   <div className="flex flex-col gap-1.5">
//     <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
//       {label}
//     </span>
//     <div className="flex items-center gap-2">
//       <span className="text-gray-400">{icon}</span>
//       <span className="text-base font-bold text-gray-800 tracking-tight">{value || "N/A"}</span>
//     </div>
//   </div>
// );

// export default ViewKyc;







import React, { useEffect } from "react";
import { 
  CheckCircle2, 
  Landmark, 
  User, 
  Fingerprint, 
  ShieldCheck,
  Copy,
  Users,
  Loader2,
  AlertCircle,
  ChevronRight,
  ArrowLeft
} from "lucide-react";
import { toast } from "react-toastify";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBankDetails, clearBankState } from "../../../redux/slice/kycmanagement/bankDetailsSlice";

const ViewKyc = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux State
  const { data, loading, error } = useSelector((state) => state.bankDetails);

  useEffect(() => {
    if (id) {
      dispatch(fetchBankDetails(id));
    }
    return () => {
      dispatch(clearBankState());
    };
  }, [id, dispatch]);

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.info("Copied to clipboard!");
  };

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gray-50/50">
      <div className="max-w-full mx-auto">
        
        {/* 1. BREADCRUMBS (Always Visible) */}
        {/* <nav className="flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">
          <NavLink to="/dashboard" className="hover:text-orange-600 transition-colors">Dashboard</NavLink>
          <ChevronRight size={14} />
          <NavLink to="/agentkyc" className="hover:text-orange-600 transition-colors">Agent KYC</NavLink>
          <ChevronRight size={14} />
          <span className="text-orange-600">Bank Details</span>
        </nav> */}

        {/* 2. HEADER SECTION (Always Visible) */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 shadow-xl mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <Users className="w-8 h-8" />
                Agent KYC Details
              </h1>
              <div className="text-sm text-orange-100 flex items-center gap-2 mt-5">
                <NavLink to="/dashboard" className="hover:text-white transition-colors">
                  <span className="bg-white/20 px-3 py-1 rounded-lg">Dashboard</span>
                </NavLink>
                <span className="text-white/60">›</span>
                <NavLink to="/agentkyc" className="hover:text-white transition-colors">
                  <span className="bg-white/20 px-3 py-1 rounded-lg">Agent Kyc</span>
                </NavLink>
                <span className="text-white/60">›</span>
                <span className="text-white font-medium">Agent Kyc Details</span>
              </div>
            </div>
          </div>
        </div>

        <button
        onClick={() => navigate("/agentkyc")}
        className="mb-4 flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold transition"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Agent Kyc
      </button>


        {/* 3. DYNAMIC CONTENT AREA (Loading / Data / Error) */}
        <div className="relative min-h-[400px]">
          {loading ? (
            /* LOADER SPINNER */
            <div className="bg-white rounded-[2.5rem] p-20 shadow-sm border border-gray-100 flex flex-col items-center justify-center">
              <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
              <p className="text-gray-500 font-bold animate-pulse uppercase tracking-widest text-xs">
                Fetching Bank Details...
              </p>
            </div>
          ) : data ? (
            /* DATA FOUND STATE */
            <>
              {/* PROFILE HEADER CARD */}
              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row items-center gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-amber-400 rounded-3xl flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-orange-200 uppercase">
                  {data.accountHolderName?.charAt(0) || "U"}
                </div>
                <div className="text-center md:text-left">
                  <h1 className="text-2xl font-black text-gray-800 tracking-tight">{data.accountHolderName}</h1>
                  <p className="text-gray-500 font-medium">Agent Partner</p>
                  <div className="mt-2 flex items-center justify-center md:justify-start gap-2">
                    {data.isKycVerified ? (
                      <span className="flex items-center gap-1 text-emerald-600 text-sm font-bold bg-emerald-50 px-3 py-1 rounded-lg">
                        <CheckCircle2 size={14} /> KYC Approved
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-600 text-sm font-bold bg-amber-50 px-3 py-1 rounded-lg">
                        <AlertCircle size={14} /> KYC Pending
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* BANK DETAILS SECTION */}
              <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gray-50/50 px-8 py-4 border-b border-gray-100 flex items-center gap-3">
                  <Landmark className="text-orange-500" size={20} />
                  <h3 className="font-bold text-gray-700 uppercase text-xs tracking-[0.2em]">Settlement Bank Details</h3>
                </div>
                
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  <DetailItem 
                    label="Account Holder Name" 
                    value={data.accountHolderName} 
                    icon={<User size={16} />} 
                  />
                  <DetailItem 
                    label="Bank Name" 
                    value={data.bankName} 
                    icon={<Landmark size={16} />} 
                  />
                  <div className="relative group">
                    <DetailItem 
                      label="Account Number" 
                      value={data.accountNumber} 
                      icon={<Fingerprint size={16} />} 
                    />
                    <button 
                      onClick={() => copyToClipboard(data.accountNumber)}
                      className="absolute right-0 top-8 p-2 text-gray-400 hover:text-orange-500 transition-colors"
                      title="Copy Account Number"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                  <div className="relative group">
                    <DetailItem 
                      label="IFSC Code" 
                      value={data.ifscCode} 
                      icon={<ShieldCheck size={16} />} 
                    />
                    <button 
                      onClick={() => copyToClipboard(data.ifscCode)}
                      className="absolute right-0 top-8 p-2 text-gray-400 hover:text-orange-500 transition-colors"
                      title="Copy IFSC Code"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>

                <div className="p-6 bg-orange-50/50 border-t border-orange-100 flex justify-center">
                  <p className="text-xs text-orange-600 font-medium flex items-center gap-2">
                    <CheckCircle2 size={14} /> Data fetched from verified banking records.
                  </p>
                </div>
              </div>
            </>
          ) : (
            /* RESPONSE FALSE / ERROR MESSAGE DISPLAY */
            <div className="bg-white rounded-[2.5rem] p-16 shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Your kyc not complete</h2>
              <p className="text-gray-500 font-medium italic max-w-sm mx-auto">
                {error || "The bank details for this agent were not found in the system."}
              </p>
             
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* Reusable Component for Details */
const DetailItem = ({ label, value, icon }) => (
  <div className="flex flex-col gap-1.5">
    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
      {label}
    </span>
    <div className="flex items-center gap-2">
      <span className="text-gray-400">{icon}</span>
      <span className="text-base font-bold text-gray-800 tracking-tight">{value || "N/A"}</span>
    </div>
  </div>
);

export default ViewKyc;