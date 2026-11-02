import React, { useEffect, useState } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchClientById,clearClientData } from "../../../redux/slice/client/viewClient";
import { updateClientStatus, fetchLeadStatuses, 
  resetStatusState  } from "../../../redux/slice/client/changeclientStatus";
import { ArrowLeft, Mail, Phone, MapPin, Tag, AlertCircle } from "lucide-react";
import { FaUserTie } from "react-icons/fa";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import LoaderSpinner from "../../../components/uiElement/LoaderSpinner";
import { toast } from "react-hot-toast";

const ViewClient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showReasonInput, setShowReasonInput] = useState(false);
  
  // States from Redux
  const { clientData, loading: fetchLoading } = useSelector((state) => state.viewClient);
  const { 
    dropdownStatuses, 
    updateLoading, 
    success: updateSuccess, 
    error: updateError 
  } = useSelector((state) => state.changeStatus);

  useEffect(() => {
    if (id) {
      dispatch(fetchClientById(id));
      dispatch(fetchLeadStatuses()); // Dropdown options fetch karega
    }
    return () => dispatch(clearClientData());
  }, [dispatch, id]);

  useEffect(() => {
    if (updateSuccess) {
      toast.success("Status Updated Successfully!");
      dispatch(fetchClientById(id)); 
      dispatch(resetStatusState());
    }
    if (updateError) {
      toast.error(updateError);
      dispatch(resetStatusState());
    }
  }, [updateSuccess, updateError, dispatch, id]);

  const validationSchema = Yup.object().shape({
    status: Yup.string().required("Status is required"),
    reason: Yup.string().when("status", {
      is: (val) => val?.toLowerCase() === "rejected", // Dynamic check for "Rejected"
      then: (schema) => schema.required("Please provide a reason for rejection"),
    }),
  });

  const handleStatusChange = (val, setFieldValue) => {
    setFieldValue("status", val);
    setShowReasonInput(val.toLowerCase() === "rejected");
  };

  const handleSubmit = (values) => {
    dispatch(updateClientStatus({ 
      id, 
      status: values.status, 
      reason: values.reason, 
      price: clientData?.price 
    }));
  };

  if (fetchLoading) return <div className="min-h-screen flex items-center justify-center"><LoaderSpinner /></div>;
  if (!clientData) return null;

  const { client, projectName, leadId, projectCategoryId, status, price, createdAt,submittedByRole } = clientData;

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gray-50/50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 shadow-xl mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <FaUserTie className="w-7 h-7" /> Client Details
        </h1>
        <div className="text-sm text-orange-100 flex items-center gap-2 mt-3">
          <NavLink to="/dashboard" className="hover:text-white transition-colors">Dashboard</NavLink>
          <span className="text-white/60">›</span>
          <NavLink to="/client" className="hover:text-white transition-colors">Client Analytics</NavLink>
          <span className="text-white/60">›</span>
          <span className="text-white font-medium">Details</span>
        </div>
      </div>

      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-orange-600 mb-6 font-medium transition-all">
        <ArrowLeft size={20} /> Back to Analytics
      </button>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Client & Project Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-8 py-4 border-b border-gray-50 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-700">{client?.name}</h2>
              {/* lead id */}
              {/* <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-mono text-gray-500">#{leadId}</span> */}
            </div>
              <hr className="border border-1 border-gray-200" />

            <div className="p-6 md:p-8 space-y-6">
              {/* Contact Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailCard icon={<Phone size={18}/>} label="Phone" value={client?.phone} color="text-blue-600" bg="bg-blue-50" />
                <DetailCard icon={<Mail size={18}/>} label="Email Address" value={client?.email} color="text-purple-600" bg="bg-purple-50" />
                <div className="md:col-span-2">
                   <DetailCard icon={<MapPin size={18}/>} label="Client Message" value={client?.message} color="text-orange-600" bg="bg-orange-50" />
                </div>
              </div>

            <p className="text-gray-700">Submitted by </p>
              {submittedByRole && (
                <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {submittedByRole?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-[12px] uppercase font-black text-gray-500">Submitted By</p>
                      <p className="text-[15px] font-bold text-gray-700">{submittedByRole}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-black text-gray-400">Submission Date</p>
                    <p className="text-xs font-medium text-gray-600">
                      {new Date(createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              )}

              {/* Project Status & Price Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-2 flex items-center gap-1"><Tag size={12} /> Project</h4>
                  <p className="text-md font-bold text-gray-800 truncate">{projectName}</p>
                  <p className="text-xs text-orange-500 mt-1 font-medium">{projectCategoryId?.name}</p>
                </div>

              {/* price */}
                {/* <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-2">Price</h4>
                  <p className="text-lg font-black text-blue-700">{price ? `₹${price}` : ""}</p>
                </div> */}

                <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-2">Current Status</h4>
                  <div className={`flex items-center gap-2 w-fit px-3 py-1 rounded-full border text-xs font-bold ${status === "Pending" ? "bg-yellow-50 border-yellow-100 text-yellow-700" : "bg-green-50 border-green-100 text-green-700"}`}>
                    <div className={`w-2 h-2 rounded-full animate-pulse ${status === "Pending" ? "bg-yellow-500" : "bg-green-500"}`}></div>
                    {status}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Action Center (Updated with Dynamic Dropdown) */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-6">
            <h3 className="text-lg font-bold text-gray-800 mb-5">Action Center</h3>
            <Formik
              initialValues={{ status: status || "", reason: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ setFieldValue, values, errors, touched }) => (
                <Form className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Update Status</label>
                    <select
                      name="status"
                      value={values.status}
                      onChange={(e) => handleStatusChange(e.target.value, setFieldValue)}

                      // this is the logic of paid if paid then they will change the button color
                      // disabled={status === "Paid" || updateLoading}
                      className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-orange-400 outline-none transition-all"
                    >
                      <option value="" disabled>Select Status</option>
                      {/* API se aaya hua data yahan map ho raha hai */}
                      {dropdownStatuses.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    {errors.status && touched.status && (
                      <p className="text-red-500 text-[10px] mt-1 font-bold italic">{errors.status}</p>
                    )}
                  </div>

                  {showReasonInput && (
                    <div className="animate-fadeIn">
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-1">
                        <AlertCircle size={12} className="text-red-500" /> Rejection Reason
                      </label>
                      <textarea
                        name="reason"
                        value={values.reason}
                        onChange={(e) => setFieldValue("reason", e.target.value)}
                        placeholder="Reason for rejection..."
                        rows="3"
                        className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-sm"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    // paid logic 
                    // disabled={updateLoading || status === "Paid"}
                    className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-orange-600 transition-all disabled:bg-gray-300 flex justify-center items-center"
                  >
                    Confirm message
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Component for UI consistency
const DetailCard = ({ icon, label, value, color, bg }) => (
  <div className="group p-5 bg-white rounded-2xl border border-gray-200 shadow-sm hover:border-orange-200 transition-all">
    <div className="flex items-start gap-4">
      <div className={`p-3 ${bg} ${color} rounded-xl`}>{icon}</div>
      <div>
        <p className="text-[10px] text-gray-400 uppercase font-black mb-1">{label}</p>
        <p className="text-gray-700 font-semibold">{value}</p>
      </div>
    </div>
  </div>
);

export default ViewClient;