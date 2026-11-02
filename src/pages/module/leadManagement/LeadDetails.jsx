//  import React, { useEffect, useState } from "react";

// import { NavLink, useNavigate, useParams } from "react-router-dom";

// import { 
//   LayoutDashboard, CheckCircle, Mail, Phone, 
//   DollarSign, FileText, User, MessageSquare, Calendar, 
//   XCircle, Briefcase, Info, AlertCircle,
//   UserCircle,
//   ArrowLeft
// } from "lucide-react";
// import { Formik, Form } from "formik";
// import * as Yup from "yup";
// import { toast } from "react-toastify";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchLeadById, clearLeadState } from "../../../redux/slice/leadManagement/getSingleLead";
// import { updateLeadStatusApi, resetStatusState } from "../../../redux/slice/leadManagement/changeStatusSlice";
// import { fetchLeadStatusDropdown } from "../../../redux/slice/leadManagement/leadDropdownSlice";
// import LoaderSpinner from "../../../components/uiElement/LoaderSpinner";
// import StatusBadge from "./StatusBadge";

// export default function LeadDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   // Local state for rejection reason
//   const [showReasonInput, setShowReasonInput] = useState(false);
//   const [rejectionReason, setRejectionReason] = useState("");

//   const { lead, loading, error } = useSelector((state) => state.singleLead);
//   const { loading: updateLoading, success: updateSuccess, error: updateError } = useSelector((state) => state.changeStatus);
//   const { statuses, loading: dropdownLoading } = useSelector((state) => state.leadDropdown);

//   // Initial Fetch & Cleanup
//   useEffect(() => {
//     if (id) {
//       dispatch(fetchLeadById(id));
//       dispatch(fetchLeadStatusDropdown());
//     }
//     return () => {
//       dispatch(clearLeadState());
//       dispatch(resetStatusState());
//     };
//   }, [dispatch, id]);

//   // Handle API Status Response
//   useEffect(() => {
//      if (updateSuccess) {
//       toast.success("Lead status successfully updated",{
//         autoClose:1500
//       });
//       dispatch(resetStatusState());
//       // dispatch(fetchLeadById(id)); 
//        setShowReasonInput(false);
//       setRejectionReason("");
//       setTimeout(() => navigate("/leadmanagement"), 1000);
//     }
//     if (updateError) {
//       toast.error(updateError || "Failed to update status");
//       dispatch(resetStatusState());
//     }
//   }, [updateSuccess, updateError, dispatch, navigate]); 

//   //yaha pe id bheji thi but glitch aa raha tha whi page blink ho raha tha leadmanagement mei jane ke pahele same upar bhi wahi kiya dispatch(fetchLeadById(id));

//   // Watch for status changes to show/hide reason input
//   const handleStatusChange = (status, setFieldValue) => {
//     setFieldValue("status", status);
//     if (status === "Rejected") {
//       setShowReasonInput(true);
//     } else {
//       setShowReasonInput(false);
//       setRejectionReason("");
//     }
//   };

//   const validationSchema = Yup.object({
//     status: Yup.string().required("Status is required"),
//     // Reason is required only when status is "rejected"
//     reason: Yup.string().when('status', {
//       is: 'Rejected',
//       then: () => Yup.string().required("Rejection reason is required"),
//       otherwise: () => Yup.string()
//     })
//   });

//   const handleSubmit = (values, { setSubmitting }) => {
//     // Create payload with status and reason (for rejected status)
//     const payload = {
//       id: lead._id,
//       status: values.status
//     };
    
//     // Add reason to payload only if status is "rejected" and reason is provided
//     if (values.status === "Rejected" && values.reason) {
//       payload.reason = values.reason;
//     }
    
//     dispatch(updateLeadStatusApi(payload));
//     setSubmitting(false);
//   };

//   if (loading || dropdownLoading) return <div className="h-screen flex items-center justify-center mt-55"><LoaderSpinner /></div>;

//   if (error || !lead) {
//     return (
//       <div className="p-6 min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-gray-800">Lead Not Found</h2>
//           <button onClick={() => navigate("/leadmanagement")} className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg">Go Back</button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 min-h-screen">
//       {/* Header Section */}
//       <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 shadow-lg mb-8 text-white">
//   <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//     <div>
//       <h1 className="text-2xl font-bold  tracking-tight text-white/90 flex items-center gap-3">
//         <UserCircle className="w-7 h-7"/>
//         Lead Details
//       </h1>
//       <div className="flex items-center gap-2 text-orange-100 text-sm mt-5">
//         <NavLink
//           to="/dashboard"
//           className="hover:text-white transition-colors"
//         >
//           <span className="bg-white/20 px-3 py-1 rounded-lg">
//             Dashboard
//           </span>
//         </NavLink>
//         <span>›</span>
//         <NavLink to="/leadmanagement" className="hover:text-white transition-colors">Lead Management</NavLink>
//         <span>›</span>
//         <span className="font-medium  text-white">Lead Details</span>
//       </div>
//     </div>
//     <div className="flex items-center gap-3">
//       <StatusBadge status={lead.status} />
      
//     </div>
//   </div>
//       </div>

// {/* back button */}
// <button
//         onClick={() => navigate("/leadmanagement")}
//         className="mb-4 flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold transition"
//       >
//         <ArrowLeft className="w-5 h-5" />
//         Back to Lead Management
//       </button>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         <div className="lg:col-span-2 space-y-8">
//           <h2 className="text-xl font-extrabold text-gray-800 border-l-4 border-orange-500 pl-3">Client & Project Overview</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
//               <div className="bg-blue-50 px-6 py-4 border-b border-blue-100 flex items-center gap-2">
//                 <User className="text-blue-600" size={20} />
//                 <h3 className="font-bold text-blue-900">Client Details</h3>
//               </div>
//               <div className="p-6 space-y-4">
//                 <DetailItem icon={<User size={16}/>} label="Full Name" value={lead.client?.name} color="blue" />
//                 <DetailItem icon={<Mail size={16}/>} label="Email Address" value={lead.client?.email} color="purple" />
//                 <DetailItem icon={<Phone size={16}/>} label="Phone Number" value={lead.client?.phone} color="green" />
//                 <div className="mt-4 p-3 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
//                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-1 flex items-center gap-1">
//                      <MessageSquare size={12}/> Message
//                    </p>
//                    <p className="text-sm text-gray-600 italic">"{lead.client?.message || "No message provided"}"</p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
//               <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100 flex items-center gap-2">
//                 <Briefcase className="text-emerald-600" size={20} />
//                 <h3 className="font-bold text-emerald-900">Project Info</h3>
//               </div>
//               <div className="p-6 space-y-4">
//                 <DetailItem icon={<FileText size={16}/>} label="Project Name" value={lead.projectName} color="orange" />
//                 <DetailItem icon={<Info size={16}/>} label="Project Type" value={lead.projectCategoryId?.name} color="blue" />
//                 <DetailItem icon={<DollarSign size={16}/>} label="Budget/Price" value={`₹${lead.price}`} color="emerald" />
//                 <DetailItem icon={<Calendar size={16}/>} label="Created At" value={new Date(lead.createdAt).toLocaleDateString()} color="gray" />
                
//                 {lead.projectCategoryId?.description && (
//                   <div className="mt-2 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
//                     <p className="text-[10px] uppercase font-bold text-emerald-600 mb-1">Type Description</p>
//                     <p className="text-xs text-gray-600">{lead.projectCategoryId.description}</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
//                 <div className="bg-purple-50 px-6 py-4 border-b border-purple-100 flex items-center gap-2">
//                     <CheckCircle className="text-purple-600" size={20} />
//                     <h3 className="font-bold text-purple-900">Submitted By</h3>
//                 </div>
//                 <div className="p-6 space-y-4">
//                     <DetailItem icon={<User size={16}/>} label="Name" value={lead.submittedById?.name} color="purple" />
//                     <DetailItem icon={<Mail size={16}/>} label="Email" value={lead.submittedById?.email} color="blue" />
//                     <DetailItem icon={<Briefcase size={16}/>} label="User Role" value={lead.submittedById?.role} color="orange" />
//                 </div>
//             </div>

//             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 self-start">
//                 <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
//                 <CheckCircle className="text-blue-500" size={18} /> Submission Source
//                 </h2>
//                 <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
//                 <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl uppercase">
//                     {lead.submittedById?.name?.charAt(0) || "U"}
//                 </div>
//                 <div>
//                     <p className="font-bold text-gray-800">{lead.submittedById?.name || "Unknown User"}</p>
//                     <p className="text-sm text-gray-500 capitalize">{lead.submittedByRole} • {lead.submittedByModel}</p>
//                 </div>
//                 </div>
//             </div>
//           </div>
//         </div>

//         {/* Action Center */}
//         <div className="lg:col-span-1 mt-15">
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
//             <h3 className="text-lg font-bold text-gray-800 mb-4">Action Center</h3>
//             <Formik
//               initialValues={{ status: lead.status || "", reason: "" }}
//               validationSchema={validationSchema}
//               onSubmit={handleSubmit}
//               enableReinitialize
//             >
//               {({ isSubmitting, setFieldValue, values, errors, touched }) => (
//                 <Form className="space-y-5">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-600 mb-2">Update Status</label>
//                     <select
//                       name="status"
//                       value={values.status}
//                       onChange={(e) => handleStatusChange(e.target.value, setFieldValue)}
//                       disabled={lead.status === "paid" || lead.status === "rejected" || updateLoading}
//                       className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-orange-400 outline-none transition-all disabled:cursor-not-allowed"
//                     >
//                       <option value="" disabled>Select Status</option>
//                       {statuses && statuses.map((statusName) => (
//                         <option key={statusName} value={statusName}>
//                           {statusName}
//                         </option>
//                       ))}
//                     </select>
//                     {errors.status && touched.status && (
//                       <p className="text-red-500 text-xs mt-1">{errors.status}</p>
//                     )}
//                   </div>

//                   {/* Conditional Reason Input for Rejected Status */}
//                   {showReasonInput && (
//                     <div className="animate-fadeIn">
//                       <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center gap-1">
//                         <AlertCircle size={14} className="text-red-500" />
//                         Rejection Reason <span className="text-red-500">*</span>
//                       </label>
//                       <textarea
//                         name="reason"
//                         value={values.reason}
//                         onChange={(e) => {
//                           setFieldValue("reason", e.target.value);
//                           setRejectionReason(e.target.value);
//                         }}
//                         placeholder="Please provide reason for rejection..."
//                         rows="3"
//                         className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-orange-400 outline-none transition-all resize-none"
//                       />
//                       {errors.reason && touched.reason && (
//                         <p className="text-red-500 text-xs mt-1">{errors.reason}</p>
//                       )}
//                     </div>
//                   )}

//                   <button
//                     type="submit"
//                     disabled={updateLoading || (lead.status === "rejected")}
//                     className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold shadow-md hover:bg-orange-600 transition-all disabled:bg-gray-300 disabled:shadow-none flex justify-center items-center"
//                   >
//                     {updateLoading ? (
//                       <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     ) : (
//                       "Confirm Changes"
//                     )}
//                   </button>
                  
//                   <button
//                     type="button"
//                     onClick={() => navigate(-1)}
//                     className="w-full bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all"
//                   >
//                     Cancel
//                   </button>
//                 </Form>
//               )}
//             </Formik>
//           </div>
//         </div>
        
//       </div>
//     </div>
//   );
// }

// function DetailItem({ icon, label, value, color }) {
//   const colorMap = {
//     blue: "bg-blue-100 text-blue-600",
//     purple: "bg-purple-100 text-purple-600",
//     green: "bg-green-100 text-green-600",
//     orange: "bg-orange-100 text-orange-600",
//     emerald: "bg-emerald-100 text-emerald-600",
//     gray: "bg-gray-100 text-gray-600",
//   };
  
//   return (
//     <div className="flex items-center gap-3">
//       <div className={`p-2 rounded-lg ${colorMap[color]}`}>{icon}</div>
//       <div className="overflow-hidden">
//         <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold leading-tight">{label}</p>
//         <p className="text-sm font-semibold text-gray-700 truncate">{value || "—"}</p>
//       </div>
//     </div>
//   );
// }








// github code

 import React, { useEffect, useState } from "react";

import { NavLink, useNavigate, useParams } from "react-router-dom";

import { 
  LayoutDashboard, CheckCircle, Mail, Phone, 
  DollarSign, FileText, User, MessageSquare, Calendar, 
  XCircle, Briefcase, Info, AlertCircle,
  UserCircle,
  ArrowLeft
} from "lucide-react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { fetchLeadById, clearLeadState } from "../../../redux/slice/leadManagement/getSingleLead";
import { updateLeadStatusApi, resetStatusState } from "../../../redux/slice/leadManagement/changeStatusSlice";
import { fetchLeadStatusDropdown } from "../../../redux/slice/leadManagement/leadDropdownSlice";
import LoaderSpinner from "../../../components/uiElement/LoaderSpinner";
import StatusBadge from "./StatusBadge";

export default function LeadDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Local state for rejection reason
  const [showReasonInput, setShowReasonInput] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const { lead, loading, error } = useSelector((state) => state.singleLead);
  const { loading: updateLoading, success: updateSuccess, error: updateError } = useSelector((state) => state.changeStatus);
  const { statuses, loading: dropdownLoading } = useSelector((state) => state.leadDropdown);

  // Initial Fetch & Cleanup
  useEffect(() => {
    if (id) {
      dispatch(fetchLeadById(id));
      dispatch(fetchLeadStatusDropdown());
    }
    return () => {
      dispatch(clearLeadState());
      dispatch(resetStatusState());
    };
  }, [dispatch, id]);

  // Handle API Status Response
  useEffect(() => {
     if (updateSuccess) {
      toast.success("Lead status successfully updated",{
        autoClose:2000
      });
      dispatch(resetStatusState());
      // dispatch(fetchLeadById(id)); 
       setShowReasonInput(false);
      setRejectionReason("");
      setTimeout(() => navigate("/leadmanagement"), 1500);
    }
    if (updateError) {
      toast.error(updateError || "Failed to update status");
      dispatch(resetStatusState());
    }
  }, [updateSuccess, updateError, dispatch, navigate]); //yaha pe id bheji thi but glitch aa raha tha whi page blink ho raha tha leadmanagement mei jane ke pahele same upar bhi wahi kiya dispatch(fetchLeadById(id));

  // Watch for status changes to show/hide reason input
  const handleStatusChange = (status, setFieldValue) => {
    setFieldValue("status", status);
    if (status === "Rejected") {
      setShowReasonInput(true);
    } else {
      setShowReasonInput(false);
      setRejectionReason("");
    }
  };

  const validationSchema = Yup.object({
    status: Yup.string().required("Status is required"),
    // Reason is required only when status is "rejected"
    reason: Yup.string().when('status', {
      is: 'Rejected',
      then: () => Yup.string().required("Rejection reason is required"),
      otherwise: () => Yup.string()
    })
  });

  const handleSubmit = (values, { setSubmitting }) => {
    // Create payload with status and reason (for rejected status)
    const payload = {
      id: lead._id,
      status: values.status
    };
    
    // Add reason to payload only if status is "rejected" and reason is provided
    if (values.status === "Rejected" && values.reason) {
      payload.reason = values.reason;
    }
    
    dispatch(updateLeadStatusApi(payload));
    setSubmitting(false);
  };

  if (loading || dropdownLoading) return <div className="h-screen flex items-center justify-center mt-55"><LoaderSpinner /></div>;

  if (error || !lead) {
    return (
      <div className="p-6 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">Lead Not Found</h2>
          <button onClick={() => navigate("/leadmanagement")} className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg">Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 shadow-lg mb-8 text-white">
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
    <div>
      <h1 className="text-2xl font-bold  tracking-tight text-white/90 flex items-center gap-3">
        <UserCircle className="w-7 h-7"/>
        Lead Details
      </h1>
      <div className="flex items-center gap-2 text-orange-100 text-sm mt-5">
        <NavLink
          to="/dashboard"
          className="hover:text-white transition-colors"
        >
          <span className="bg-white/20 px-3 py-1 rounded-lg">
            Dashboard
          </span>
        </NavLink>
        <span>›</span>
        <NavLink to="/leadmanagement" className="hover:text-white transition-colors">Lead Management</NavLink>
        <span>›</span>
        <span className="font-medium  text-white">Lead Details</span>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <StatusBadge status={lead.status} />
      
    </div>
  </div>
      </div>

{/* back button */}
<button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold transition"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Lead Management
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-xl font-extrabold text-gray-800 border-l-4 border-orange-500 pl-3">Client & Project Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-blue-50 px-6 py-4 border-b border-blue-100 flex items-center gap-2">
                <User className="text-blue-600" size={20} />
                <h3 className="font-bold text-blue-900">Client Details</h3>
              </div>
              <div className="p-6 space-y-4">
                <DetailItem icon={<User size={16}/>} label="Full Name" value={lead.client?.name} color="blue" />
                <DetailItem icon={<Mail size={16}/>} label="Email Address" value={lead.client?.email} color="purple" />
                <DetailItem icon={<Phone size={16}/>} label="Phone Number" value={lead.client?.phone} color="green" />
                <div className="mt-4 p-3 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                   <p className="text-[10px] uppercase font-bold text-gray-400 mb-1 flex items-center gap-1">
                     <MessageSquare size={12}/> Message
                   </p>
                   <p className="text-sm text-gray-600 italic">"{lead.client?.message || "No message provided"}"</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100 flex items-center gap-2">
                <Briefcase className="text-emerald-600" size={20} />
                <h3 className="font-bold text-emerald-900">Project Info</h3>
              </div>
              <div className="p-6 space-y-4">
                <DetailItem icon={<FileText size={16}/>} label="Project Name" value={lead.projectName} color="orange" />
                <DetailItem icon={<Info size={16}/>} label="Project Type" value={lead.projectCategoryId?.name || lead.projectCategory?.name || (typeof lead.projectCategory === "string" ? lead.projectCategory : null) || lead.projectCategory} color="blue" />
                <DetailItem icon={<DollarSign size={16}/>} label="Budget/Price" value={`₹${lead.price}`} color="emerald" />
                <DetailItem icon={<Calendar size={16}/>} label="Created At" value={new Date(lead.createdAt).toLocaleDateString()} color="gray" />
                {lead.dateOfTransfer && (
                  <DetailItem icon={<Calendar size={16}/>} label="Transferred At" value={new Date(lead.dateOfTransfer).toLocaleDateString()} color="purple" />
                )}
                
                {lead.projectCategoryId?.description && (
                  <div className="mt-2 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                    <p className="text-[10px] uppercase font-bold text-emerald-600 mb-1">Type Description</p>
                    <p className="text-xs text-gray-600">{lead.projectCategoryId.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-purple-50 px-6 py-4 border-b border-purple-100 flex items-center gap-2">
                    <CheckCircle className="text-purple-600" size={20} />
                    <h3 className="font-bold text-purple-900">Submitted By</h3>
                </div>
                <div className="p-6 space-y-4">
                    <DetailItem icon={<User size={16}/>} label="Name" value={lead.submittedById?.name || lead.submittedBy?.name || (typeof lead.submittedBy === "string" ? lead.submittedBy : "—")} color="purple" />
                    <DetailItem icon={<Mail size={16}/>} label="Email" value={lead.submittedById?.email || lead.submittedBy?.email || "—"} color="blue" />
                    <DetailItem icon={<Briefcase size={16}/>} label="User Role" value={lead.submittedById?.role || lead.submittedBy?.role || lead.submittedByRole || "—"} color="orange" />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 self-start">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CheckCircle className="text-blue-500" size={18} /> Submission Source
                </h2>
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl uppercase">
                    {(lead.submittedById?.name || lead.submittedBy?.name || (typeof lead.submittedBy === "string" ? lead.submittedBy : "") || "U").charAt(0) || "U"}
                </div>
                <div>
                    <p className="font-bold text-gray-800">{lead.submittedById?.name || lead.submittedBy?.name || (typeof lead.submittedBy === "string" ? lead.submittedBy : "") || "Unknown User"}</p>
                    <p className="text-sm text-gray-500 capitalize">{lead.submittedByRole || lead.submittedBy?.role || "vendor"} • {lead.submittedByModel || lead.submittedBy?.model || "Vendor"}</p>
                </div>
                </div>
            </div>
          </div>
        </div>

        {/* Action Center */}
        <div className="lg:col-span-1 mt-15">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Action Center</h3>
            <Formik
              initialValues={{ status: lead.status || "", reason: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ isSubmitting, setFieldValue, values, errors, touched }) => (
                <Form className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Update Status</label>
                    <select
                      name="status"
                      value={values.status}
                      onChange={(e) => handleStatusChange(e.target.value, setFieldValue)}
                      disabled={lead.status === "paid" || lead.status === "rejected" || updateLoading}
                      className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-orange-400 outline-none transition-all disabled:cursor-not-allowed"
                    >
                      <option value="" disabled>Select Status</option>
                      {statuses &&
                        statuses
                          .filter(
                            (statusName) =>
                              !["today", "week", "month", "tomorrow"].includes(
                                String(statusName).toLowerCase()
                              )
                          )
                          .map((statusName) => (
                            <option key={statusName} value={statusName}>
                              {statusName}
                            </option>
                          ))}
                    </select>
                    {errors.status && touched.status && (
                      <p className="text-red-500 text-xs mt-1">{errors.status}</p>
                    )}
                  </div>

                  {/* Conditional Reason Input for Rejected Status */}
                  {showReasonInput && (
                    <div className="animate-fadeIn">
                      <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center gap-1">
                        <AlertCircle size={14} className="text-red-500" />
                        Rejection Reason <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="reason"
                        value={values.reason}
                        onChange={(e) => {
                          setFieldValue("reason", e.target.value);
                          setRejectionReason(e.target.value);
                        }}
                        placeholder="Please provide reason for rejection..."
                        rows="3"
                        className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-orange-400 outline-none transition-all resize-none"
                      />
                      {errors.reason && touched.reason && (
                        <p className="text-red-500 text-xs mt-1">{errors.reason}</p>
                      )}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={updateLoading || isSubmitting || (lead.status === "paid" || lead.status === "rejected")}
                    className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold shadow-md hover:bg-orange-600 transition-all disabled:bg-gray-300 disabled:shadow-none flex justify-center items-center"
                  >
                    {updateLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      "Confirm Changes"
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="w-full bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ icon, label, value, color }) {
  const colorMap = {
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
    green: "bg-green-100 text-green-600",
    orange: "bg-orange-100 text-orange-600",
    emerald: "bg-emerald-100 text-emerald-600",
    gray: "bg-gray-100 text-gray-600",
  };
  
  const displayVal =
    typeof value === "object" && value !== null
      ? value.name || value.title || "—"
      : value || "—";

  return (
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${colorMap[color]}`}>{icon}</div>
      <div className="overflow-hidden">
        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold leading-tight">{label}</p>
        <p className="text-sm font-semibold text-gray-700 truncate">{displayVal}</p>
      </div>
    </div>
  );
}