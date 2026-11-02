import React, { useEffect, useState, useMemo, useRef } from "react";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Percent,
  User,
  ArrowLeft,
  UserCircle,
  Briefcase,
  Eye,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Plus,
  Users,
  ChevronDown,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  fetchSingleAgent,
  clearAgentDetails,
} from "../../../redux/slice/agentManagement/getSingleAgentSlice";
import { fetchVendors } from "../../../redux/slice/agentManagement/addAgentSlice";
import { fetchAllVendors } from "../../../redux/slice/vendors/getallVendorsSlice";
import { fetchCategories } from "../../../redux/slice/leadManagement/addLeadSlice";
import {
  bulkUploadLeads,
  resetBulkUpload,
} from "../../../redux/slice/vendors/getVendorDetailsSlice";
import LoaderSpinner from "../../../components/uiElement/LoaderSpinner";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import debounce from "lodash/debounce";

import { sampleAgentsDetails } from "./mockAgentsData";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AgentView = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const vendorDropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  // Search and date filters
  const [localLeadSearch, setLocalLeadSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isLeadPageChanging, setIsLeadPageChanging] = useState(false);

  // Selection states
  const [selectionMode, setSelectionMode] = useState("none");
  const [pageSelectedIds, setPageSelectedIds] = useState(new Set());
  const [showVendorDropdown, setShowVendorDropdown] = useState(false);
  
  // Combines selected vendor/agent ID
  const [selectedTargetId, setSelectedTargetId] = useState("");
  const [targetSearch, setTargetSearch] = useState("");
  const [agentsListDropdown, setAgentsListDropdown] = useState([]);
  const [agentsLoading, setAgentsLoading] = useState(false);
  const [transferLoadingLocal, setTransferLoadingLocal] = useState(false);

  // Add Lead Modal State
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [excelFile, setExcelFile] = useState(null);
  const [excelFileName, setExcelFileName] = useState("");

  // Redux State
  const { agent, loading, error } = useSelector((state) => state.singleAgent);
  const { vendors = [], vendorsLoading } = useSelector((state) => state.addAgent);
  const { categories = [] } = useSelector((state) => state.addLead);
  const {
    bulkUploadLoading,
    bulkUploadError,
    bulkUploadResult,
  } = useSelector((state) => state.vendorDetails);

  // Get mock agent fallback
  const mockAgent = sampleAgentsDetails[id];
  const displayAgent = agent || mockAgent;

  // Local state for responsive count & leads
  const [localLeads, setLocalLeads] = useState([]);
  const [localLeadCount, setLocalLeadCount] = useState(0);

  useEffect(() => {
    if (displayAgent) {
      setLocalLeads(displayAgent.leads || []);
      setLocalLeadCount(displayAgent.leadCount || 0);
    }
  }, [displayAgent]);

  // Debounced search
  const debouncedLeadSearch = useMemo(
    () =>
      debounce((val) => {
        setIsLeadPageChanging(true);
        setCurrentPage(1);
        dispatch(
          fetchSingleAgent({
            id,
            page: 1,
            limit,
            leadSearch: val,
            leadFromDate: fromDate,
            leadToDate: toDate,
          })
        ).finally(() => setIsLeadPageChanging(false));
      }, 500),
    [dispatch, id, limit, fromDate, toDate]
  );

  const handleLeadSearchChange = (e) => {
    setLocalLeadSearch(e.target.value);
    debouncedLeadSearch(e.target.value);
  };

  const handleLeadDateFilter = (field, value) => {
    let newFrom = fromDate;
    let newTo = toDate;
    if (field === "fromDate") {
      setFromDate(value);
      newFrom = value;
    } else {
      setToDate(value);
      newTo = value;
    }
    setIsLeadPageChanging(true);
    setCurrentPage(1);
    dispatch(
      fetchSingleAgent({
        id,
        page: 1,
        limit,
        leadSearch: localLeadSearch,
        leadFromDate: newFrom,
        leadToDate: newTo,
      })
    ).finally(() => setIsLeadPageChanging(false));
  };

  const handleClearLeadDateFilter = () => {
    setFromDate("");
    setToDate("");
    setIsLeadPageChanging(true);
    setCurrentPage(1);
    dispatch(
      fetchSingleAgent({
        id,
        page: 1,
        limit,
        leadSearch: localLeadSearch,
        leadFromDate: "",
        leadToDate: "",
      })
    ).finally(() => setIsLeadPageChanging(false));
  };

  const handleLeadPageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || isLeadPageChanging) return;
    setIsLeadPageChanging(true);
    setCurrentPage(newPage);
    dispatch(
      fetchSingleAgent({
        id,
        page: newPage,
        limit,
        leadSearch: localLeadSearch,
        leadFromDate: fromDate,
        leadToDate: toDate,
      })
    ).finally(() => setIsLeadPageChanging(false));
  };

  useEffect(() => {
    if (id) {
      setIsLeadPageChanging(true);
      dispatch(
        fetchSingleAgent({
          id,
          page: currentPage,
          limit,
          leadSearch: localLeadSearch,
          leadFromDate: fromDate,
          leadToDate: toDate,
        })
      ).finally(() => setIsLeadPageChanging(false));
    }
  }, [id, currentPage, limit, dispatch]);

  useEffect(() => {
    // Close dropdown on outside click
    const handler = (e) => {
      if (
        vendorDropdownRef.current &&
        !vendorDropdownRef.current.contains(e.target)
      ) {
        setShowVendorDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      dispatch(clearAgentDetails());
    };
  }, [dispatch]);

  const leadsList = localLeads;
  console.log("DEBUG LEADS FROM GET AGENT API:", leadsList);

  // Client-side filter fallback (used for local mock testing so dates/search input actually filters in real-time)
  const filteredLeads = useMemo(() => {
    let list = leadsList;
    if (localLeadSearch.trim()) {
      const q = localLeadSearch.toLowerCase();
      list = list.filter(
        (lead) =>
          (lead.clientName || lead.client?.name)?.toLowerCase().includes(q) ||
          lead.projectName?.toLowerCase().includes(q)
      );
    }
    if (fromDate) {
      const fromTime = new Date(fromDate).getTime();
      list = list.filter((lead) => new Date(lead.dateOfTransfer || lead.updatedAt || lead.createdAt).getTime() >= fromTime);
    }
    if (toDate) {
      const toTime = new Date(toDate).getTime();
      list = list.filter((lead) => new Date(lead.dateOfTransfer || lead.updatedAt || lead.createdAt).getTime() <= toTime);
    }
    return list;
  }, [leadsList, localLeadSearch, fromDate, toDate]);

  // Derived selection values
  const selectedCount = pageSelectedIds.size;
  const pageAllChecked = filteredLeads.length > 0 && filteredLeads.every((l) => pageSelectedIds.has(l._id));
  const pageIndeterminate = !pageAllChecked && filteredLeads.some((l) => pageSelectedIds.has(l._id));

  // Combine vendors and agents for combined list
  const combinedList = useMemo(() => {
    const fallbackVendors = [
      { _id: "v1", name: "Chetan Chitriv", type: "vendor" },
      { _id: "v2", name: "Amit Soni", type: "vendor" },
    ];
    const fallbackAgents = [
      { _id: "1", name: "Manshri Wankhade", type: "agent" },
      { _id: "2", name: "Sayali Mankar", type: "agent" },
      { _id: "3", name: "Hemant Khutmode", type: "agent" },
      { _id: "4", name: "Rohan Patil", type: "agent" },
    ];

    const vList = (vendors && vendors.length > 0)
      ? vendors.map(v => ({ ...v, type: "vendor" }))
      : fallbackVendors;
    const aList = (agentsListDropdown && agentsListDropdown.length > 0)
      ? agentsListDropdown.map(a => ({ ...a, type: "agent" }))
      : fallbackAgents;
    return [...vList, ...aList].filter(item => item._id !== id);
  }, [vendors, agentsListDropdown, id]);

  // Combined list search filter
  const filteredCombinedList = useMemo(() => {
    if (!targetSearch.trim()) return combinedList;
    const q = targetSearch.toLowerCase();
    return combinedList.filter((v) => v.name?.toLowerCase().includes(q));
  }, [combinedList, targetSearch]);

  console.log("AgentView debug state:", { id, agent, loading, error, displayAgent, mockAgent });

  if (loading && !displayAgent) {
    return (
      <div className="flex flex-col items-center justify-start mt-55 min-h-screen">
        <LoaderSpinner />
      </div>
    );
  }

  // Show error only if there is no mock fallback agent to display
  if (error && !mockAgent) {
    return (
      <div className="text-center mt-20">
        <p className="text-red-500 text-xl font-bold mb-4">{error}</p>
        <NavLink
          to="/agent"
          className="text-orange-500 hover:underline flex items-center justify-center gap-2"
        >
          <ArrowLeft size={18} /> Back to Agent Management
        </NavLink>
      </div>
    );
  }

  if (!displayAgent) {
    return (
      <div className="text-center mt-20">
        <p className="text-red-500 text-xl font-bold mb-4">Agent details not found or failed to load.</p>
        <NavLink
          to="/agent"
          className="text-orange-500 hover:underline flex items-center justify-center gap-2"
        >
          <ArrowLeft size={18} /> Back to Agent Management
        </NavLink>
      </div>
    );
  }

  const isKycVerified = displayAgent.bankDetails?.isKycVerified || false;
  const isActive = displayAgent.status ? displayAgent.status.toLowerCase() === "active" : (displayAgent.isActive || false);

  const totalLeads = localLeadCount;
  const totalPages = Math.ceil(totalLeads / limit) || 1;
  const startIndex = totalLeads === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endIndex = Math.min(currentPage * limit, totalLeads);

  const getStatusBadge = () => {
    if (isActive) {
      return (
        <span className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-xl text-sm font-medium">
          <CheckCircle size={16} /> Active
        </span>
      );
    }
    return (
      <span className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-xl text-sm font-medium">
        <XCircle size={16} /> Inactive
      </span>
    );
  };

  const kycData = [
    { label: "Bank KYC", verified: isKycVerified },
    { label: "Registration", verified: displayAgent.isRegistered || false },
    { label: "Admin Access", verified: displayAgent.accessedByAdmin || false },
  ];



  // Selection handlers
  const togglePageSelectAll = () => {
    if (pageAllChecked) {
      setPageSelectedIds(new Set());
      setSelectionMode("none");
    } else {
      setPageSelectedIds(new Set(filteredLeads.map((l) => l._id)));
      setSelectionMode("page");
    }
  };

  const toggleSelectLead = (leadId) => {
    const next = new Set(pageSelectedIds);
    next.has(leadId) ? next.delete(leadId) : next.add(leadId);
    setPageSelectedIds(next);
    setSelectionMode(next.size > 0 ? "page" : "none");
  };

  const clearSelection = () => {
    setSelectionMode("none");
    setPageSelectedIds(new Set());
    setSelectedTargetId("");
    setShowVendorDropdown(false);
  };

  // Fetch agents for dropdown
  const fetchAgentsForDropdown = async () => {
    setAgentsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/admin/agent/getAllAgents?page=1&limit=99999`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAgentsListDropdown(response.data?.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setAgentsLoading(false);
    }
  };

  // Assign / Transfer Handlers
  const handleAssignClick = () => {
    if (!showVendorDropdown) {
      dispatch(fetchVendors());
      fetchAgentsForDropdown();
    }
    setShowVendorDropdown((v) => !v);
  };



  const handleAssignLeads = async () => {
    if (!selectedTargetId) {
      toast.error("Please select a vendor or agent");
      return;
    }
    const leadIdsToSend = [...pageSelectedIds];
    const targetItem = combinedList.find(x => x._id === selectedTargetId);
    if (!targetItem) return;

    // Check if mock transfer
    const isMockTransfer = 
      ["v1", "v2", "1", "2", "3", "4"].includes(selectedTargetId) ||
      leadIdsToSend.some(id => typeof id === "string" && id.startsWith("l"));

    if (isMockTransfer) {
      setTransferLoadingLocal(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setTransferLoadingLocal(false);
      
      toast.success(`${leadIdsToSend.length} lead(s) assigned successfully!`);
      setShowVendorDropdown(false);
      
      // Simulate local removal of leads from mock data and addition to target agent
      if (mockAgent && mockAgent.leads) {
        const transferredLeadsData = mockAgent.leads
          .filter(l => leadIdsToSend.includes(l._id))
          .map(l => ({ ...l, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }));
        
        // Remove from source agent
        mockAgent.leads = mockAgent.leads.filter(l => !leadIdsToSend.includes(l._id));
        
        // Helper to update all lead stats
        const updateAgentStats = (agentObj) => {
          const lds = agentObj.leads || [];
          agentObj.leadCount = lds.length;
          agentObj.totalLeads = lds.length;
          agentObj.submittedLeads = lds.filter(x => x.status === "Pending").length;
          agentObj.approvedLeads = lds.filter(x => x.status === "Approved").length;
          agentObj.rejectedLeads = lds.filter(x => x.status === "Rejected").length;
        };

        updateAgentStats(mockAgent);
        
        // Add to target agent
        const targetMockAgent = sampleAgentsDetails[selectedTargetId];
        if (targetMockAgent) {
          if (!targetMockAgent.leads) targetMockAgent.leads = [];
          targetMockAgent.leads = [...targetMockAgent.leads, ...transferredLeadsData];
          updateAgentStats(targetMockAgent);
        }

        // Force react state updates for instant responsive UI
        setLocalLeads(mockAgent.leads);
        setLocalLeadCount(mockAgent.leadCount);
      }
      
      clearSelection();
      return;
    }

    setTransferLoadingLocal(true);
    try {
      const token = localStorage.getItem("token");
      let response;
      if (targetItem.type === "vendor") {
        // Vendor transfer
        response = await axios.put(
          `${BASE_URL}/admin/vendor/transfer`,
          { leadIds: leadIdsToSend, newVendorId: selectedTargetId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Agent transfer
        // Try calling /admin/agent/transfer first, fallback to /admin/vendor/transfer
        try {
          response = await axios.put(
            `${BASE_URL}/admin/agent/transfer`,
            { leadIds: leadIdsToSend, newAgentId: selectedTargetId },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (err) {
          response = await axios.put(
            `${BASE_URL}/admin/vendor/transfer`,
            { leadIds: leadIdsToSend, newVendorId: selectedTargetId },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      }

      toast.success(`${leadIdsToSend.length} lead(s) assigned successfully!`);
      setShowVendorDropdown(false);
      setTimeout(() => {
        clearSelection();
        dispatch(
          fetchSingleAgent({
            id,
            page: currentPage,
            limit,
            leadSearch: localLeadSearch,
            leadFromDate: fromDate,
            leadToDate: toDate,
          })
        );
        dispatch(fetchAllVendors());
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Transfer failed. Please try again.");
    } finally {
      setTransferLoadingLocal(false);
    }
  };

  // Add Lead Modal Handlers
  const openAddLeadModal = () => {
    dispatch(fetchCategories());
    dispatch(resetBulkUpload());
    setShowAddLeadModal(true);
    setSelectedCategory("");
    setExcelFile(null);
    setExcelFileName("");
  };

  const closeAddLeadModal = () => {
    setShowAddLeadModal(false);
    setSelectedCategory("");
    setExcelFile(null);
    setExcelFileName("");
    dispatch(resetBulkUpload());
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    if (!allowed.includes(file.type)) {
      toast.error("Please upload a valid Excel file (.xlsx or .xls)");
      return;
    }
    setExcelFile(file);
    setExcelFileName(file.name);
  };

  const handleAddLeadSubmit = async () => {
    if (!selectedCategory) {
      toast.error("Please select a category");
      return;
    }
    if (!excelFile) {
      toast.error("Please upload an Excel file");
      return;
    }

    const formData = new FormData();
    formData.append("projectCategoryId", selectedCategory);
    formData.append("file", excelFile);

    // Using bulk upload for agent (uploads leads linked to the agent's account/vendor ID)
    const result = await dispatch(bulkUploadLeads({ vendorId: id, formData }));

    if (bulkUploadLeads.fulfilled.match(result)) {
      const data = result.payload?.data;
      toast.success(
        `Upload complete! ${data?.successCount ?? 0} leads added successfully.`
      );
      setTimeout(() => {
        closeAddLeadModal();
        dispatch(
          fetchSingleAgent({
            id,
            page: currentPage,
            limit,
            leadSearch: localLeadSearch,
            leadFromDate: fromDate,
            leadToDate: toDate,
          })
        );
      }, 2500);
    } else {
      toast.error(result.payload || "Bulk upload failed. Please try again.");
    }
  };

  // Table Loader spinner overlay
  const TableLoader = () => (
    <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-30 flex items-center justify-center rounded-2xl">
      <div className="flex flex-col items-center gap-2">
        <div className="w-10 h-10 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
        <p className="text-xs font-bold text-orange-600 animate-pulse uppercase tracking-wider">
          Loading.....
        </p>
      </div>
    </div>
  );

  const getPageNumbers = (current, total) => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages = [1];
    if (current > 3) pages.push("...");
    for (
      let i = Math.max(2, current - 1);
      i <= Math.min(total - 1, current + 1);
      i++
    )
      pages.push(i);
    if (current < total - 2) pages.push("...");
    pages.push(total);
    return pages;
  };

  const TablePagination = ({ current, total, onPageChange, isLoading }) => {
    if (total <= 1) return null;
    return (
      <div className="flex justify-center items-center gap-2 bg-gray-50/50 p-2 rounded-xl">
        <button
          disabled={current === 1 || isLoading}
          onClick={() => onPageChange(current - 1)}
          className="p-2 rounded-lg border bg-white disabled:opacity-50 hover:text-orange-500 transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="flex gap-1 items-center">
          {getPageNumbers(current, total).map((p, i) =>
            p === "..." ? (
              <span
                key={`e${i}`}
                className="w-9 h-9 flex items-center justify-center text-gray-400 font-bold text-sm"
              >
                ...
              </span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                disabled={isLoading}
                className={`w-9 h-9 rounded-lg font-bold text-sm transition-colors ${current === p ? "bg-orange-500 text-white" : "bg-white border text-gray-600 hover:text-orange-500"}`}
              >
                {p}
              </button>
            ),
          )}
        </div>
        <button
          disabled={current === total || isLoading}
          onClick={() => onPageChange(current + 1)}
          className="p-2 rounded-lg border bg-white disabled:opacity-50 hover:text-orange-500 transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    );
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50/20">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
        toastClassName="!rounded-xl !shadow-lg !font-medium !text-sm"
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 shadow-xl mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <UserCircle className="w-8 h-8" /> Agent Details
            </h1>
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
                <span className="bg-white/20 px-3 py-1 rounded-lg">
                  Agent Management
                </span>
              </NavLink>
              <span className="text-white/60">›</span>
              <span className="text-white font-medium truncate max-w-[200px]">
                {displayAgent.name}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="backdrop-blur-md bg-white/10 rounded-xl p-1 shadow-inner">
              {getStatusBadge()}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate("/agent")}
        className="mb-4 flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold transition"
      >
        <ArrowLeft className="w-5 h-5" /> Back to Agent Management
      </button>

      {/* Profile Info Card (styled exactly like VendorDetails profile card) */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 mb-6 overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center justify-between p-4 gap-4 border-b border-gray-50">
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-xl uppercase">
              {displayAgent.name?.charAt(0) || "A"}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 leading-tight">
                {displayAgent.name}
              </h2>
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold text-orange-500 uppercase tracking-wider">
                  {displayAgent.referralId || "N/A"}
                </p>
                <span className="text-gray-300">|</span>
                <p className="text-xs font-bold text-gray-600">
                  Commission : {displayAgent.commissionRate || 0}%
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-6 w-full lg:w-auto">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">
                {displayAgent.email}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-gray-700">
                {displayAgent.phone}
              </span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50/30">
          {[
            { label: "Occupation", value: displayAgent.occupation },
            { label: "City", value: displayAgent.city },
            { label: "Total Leads", value: displayAgent.leadCount ?? 0 },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="bg-white p-2 rounded-lg border border-gray-100 text-center shadow-sm"
            >
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">
                {label}
              </p>
              <span className="text-sm font-bold text-gray-700 capitalize">
                {value || "N/A"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* KYC Status blocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {kycData.map((item, index) => (
          <div
            key={index}
            className={`rounded-xl p-5 border ${item.verified ? "bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200" : "bg-gradient-to-r from-gray-50 to-white border-gray-200"}`}
          >
            <p className="text-sm text-gray-600 mb-2">{item.label}</p>
            <p
              className={`text-2xl font-bold ${item.verified ? "text-emerald-700" : "text-gray-500"}`}
            >
              {item.verified ? "Verified" : "Pending"}
            </p>
          </div>
        ))}
      </div>

      {/* ══════════════════ LEADS TABLE ══════════════════ */}
      <div className="mb-10">
        <div className="relative mb-3 px-2">
          {/* ── Row 1: Title + Selection bar ── */}
          <div className="flex items-center gap-3 flex-wrap pr-32 min-h-[38px]">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 italic">
              <Briefcase size={20} className="text-emerald-500" /> Recent Leads Summary
            </h3>

            {/* Selection actions bar */}
            {selectionMode !== "none" && selectedCount > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap">
                  {selectedCount} selected
                </span>

                <div className="relative" ref={vendorDropdownRef}>
                  <button
                    onClick={handleAssignClick}
                    className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <Users size={13} />
                    Assign Lead
                    <ChevronDown
                      size={12}
                      className={`transition-transform ${showVendorDropdown ? "rotate-180" : ""}`}
                    />
                  </button>

                  {showVendorDropdown && (
                    <div className="absolute left-0 top-full mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden text-left">
                      <div className="p-3 border-b border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                          Select Vendor or Agent
                        </p>
                        <div className="relative">
                          <Search
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                            size={13}
                          />
                          <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-orange-300"
                            value={targetSearch}
                            onChange={(e) => setTargetSearch(e.target.value)}
                            autoFocus
                          />
                        </div>
                      </div>

                      <div className="max-h-52 overflow-y-auto">
                        {vendorsLoading || agentsLoading ? (
                          <div className="flex justify-center py-5">
                            <div className="w-6 h-6 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
                          </div>
                        ) : filteredCombinedList.length > 0 ? (
                          filteredCombinedList.map((item) => {
                            const isSel = selectedTargetId === item._id;
                            return (
                              <button
                                key={item._id}
                                onClick={() => setSelectedTargetId(item._id)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50 transition-colors text-left ${isSel ? "bg-orange-50/70" : ""}`}
                              >
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${isSel ? "bg-orange-500 text-white" : "bg-orange-100 text-orange-600"}`}
                                >
                                  {item.name?.charAt(0)?.toUpperCase()}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p
                                    className={`text-sm font-semibold truncate ${isSel ? "text-orange-600" : "text-gray-800"}`}
                                  >
                                    {item.name} <span className="text-xs font-normal text-gray-400">({item.type})</span>
                                  </p>
                                  {item.phone && (
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                                      {item.phone}
                                    </p>
                                  )}
                                </div>
                              </button>
                            );
                          })
                        ) : (
                          <p className="text-sm text-gray-400 text-center py-5">
                            No options found
                          </p>
                        )}
                      </div>

                      <div className="p-3 border-t border-gray-100 bg-gray-50/50">
                        <button
                          onClick={handleAssignLeads}
                          disabled={!selectedTargetId || transferLoadingLocal}
                          className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                        >
                          {transferLoadingLocal ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Assigning...
                            </>
                          ) : (
                            `Assign ${selectedCount} Lead${selectedCount !== 1 ? "s" : ""}`
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={clearSelection}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="Clear selection"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          {/* "+ Add Lead" button absolutely pinned to top-right */}
          <button
            onClick={openAddLeadModal}
            className="absolute top-0 right-2 flex items-center gap-1.5 bg-orange-500 cursor-pointer hover:bg-orange-600 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus size={16} /> Add Lead
          </button>

          {/* ── Row 2: Date + keyword filters ── */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <div className="flex items-center gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
                From
              </label>
              <input
                type="date"
                className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none shadow-sm focus:border-orange-300"
                value={fromDate}
                onChange={(e) =>
                  handleLeadDateFilter("fromDate", e.target.value)
                }
              />
            </div>
            <div className="flex items-center gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
                To
              </label>
              <input
                type="date"
                className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none shadow-sm focus:border-orange-300"
                value={toDate}
                onChange={(e) => handleLeadDateFilter("toDate", e.target.value)}
              />
            </div>
            {(fromDate || toDate) && (
              <button
                onClick={handleClearLeadDateFilter}
                className="px-3 py-2 text-xs font-bold text-red-500 border border-red-200 bg-red-50 rounded-xl hover:bg-red-100 whitespace-nowrap cursor-pointer"
              >
                Clear
              </button>
            )}
            <div className="relative w-56">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search by Client or Project..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none shadow-sm focus:border-orange-300"
                value={localLeadSearch}
                onChange={handleLeadSearchChange}
              />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500">Show:</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setCurrentPage(1);
                  dispatch(
                    fetchSingleAgent({
                      id,
                      page: 1,
                      limit: Number(e.target.value),
                      leadSearch: localLeadSearch,
                      leadFromDate: fromDate,
                      leadToDate: toDate,
                    })
                  );
                }}
                className="border border-gray-200 rounded-lg text-xs px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-orange-400 font-bold text-gray-700 bg-white shadow-sm cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
                <option value={75}>75</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative">
          {(isLeadPageChanging && !mockAgent) && <TableLoader />}
          <div className="h-[400px] overflow-y-auto custom-scrollbar">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">
                <tr className="text-sm text-gray-700">
                  <th className="px-4 py-4 w-10">
                    <input
                      type="checkbox"
                      checked={pageAllChecked}
                      ref={(el) => {
                        if (el) {
                          el.indeterminate = pageIndeterminate;
                        }
                      }}
                      onChange={togglePageSelectAll}
                      className="w-4 h-4 accent-orange-500 cursor-pointer rounded"
                      title="Select / deselect current page"
                    />
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">Date</th>
                  <th className="px-6 py-4 text-left font-semibold">Client Name</th>
                  <th className="px-6 py-4 text-left font-semibold">Project Details</th>
                  <th className="px-6 py-4 text-left font-semibold">Price</th>
                  <th className="px-6 py-4 text-left font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => {
                    const isChecked = pageSelectedIds.has(lead._id);
                    return (
                      <tr
                        key={lead._id}
                        className={`hover:bg-gray-50 transition-colors ${isChecked ? "bg-orange-50/40" : ""}`}
                      >
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleSelectLead(lead._id)}
                            className="w-4 h-4 accent-orange-500 cursor-pointer rounded"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">
                            {lead.dateOfTransfer || lead.updatedAt || lead.createdAt
                              ? new Date(lead.dateOfTransfer || lead.updatedAt || lead.createdAt).toLocaleDateString(
                                  "en-GB"
                                )
                              : "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-800">
                            {lead.clientName || lead.client?.name || "N/A"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {lead.clientPhone || lead.client?.phone}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-800">
                            {lead.projectName}
                          </p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-tighter">
                            {lead.projectCategory}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-emerald-700">
                            ₹{lead.price || "0"}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() =>
                              navigate(
                                `/leadmanagement/lead-details/${lead._id}`
                              )
                            }
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Search className="w-12 h-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-400">
                          No matching leads found
                        </h3>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30 flex justify-between items-center">
            <p className="text-xs text-gray-500 font-semibold uppercase">
              Showing {startIndex} to {endIndex} of {totalLeads} entries
            </p>
            <TablePagination
              current={currentPage}
              total={totalPages}
              onPageChange={handleLeadPageChange}
              isLoading={isLeadPageChanging}
            />
          </div>
        </div>
      </div>

      {/* ══════════════════ ADD LEAD MODAL ══════════════════ */}
      {showAddLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden text-left">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-orange-500 to-red-600">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus size={20} /> Add Lead
              </h2>
              <button
                onClick={closeAddLeadModal}
                className="text-white/80 hover:text-white hover:bg-white/20 p-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {bulkUploadResult ? (
                <div className="space-y-4">
                  <div className="flex flex-col items-center gap-2 py-2">
                    <CheckCircle2 size={44} className="text-emerald-500" />
                    <p className="text-emerald-700 font-bold text-base text-center">
                      Upload complete!
                    </p>
                    <p className="text-gray-400 text-xs text-center">
                      Closing and refreshing…
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        label: "Total Rows",
                        value: bulkUploadResult.totalRows,
                        color: "bg-gray-100 text-gray-700",
                      },
                      {
                        label: "Success",
                        value: bulkUploadResult.successCount,
                        color: "bg-emerald-50 text-emerald-700",
                      },
                      {
                        label: "Errors",
                        value: bulkUploadResult.errorCount,
                        color: "bg-red-50 text-red-600",
                      },
                      {
                        label: "Duplicates",
                        value: bulkUploadResult.duplicateCount,
                        color: "bg-yellow-50 text-yellow-700",
                      },
                    ].map(({ label, value, color }) => (
                      <div
                        key={label}
                        className={`${color} rounded-xl px-4 py-3 flex flex-col items-center`}
                      >
                        <span className="text-2xl font-extrabold">{value}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Project Category <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full appearance-none px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:border-orange-400 focus:bg-white transition-colors cursor-pointer"
                      >
                        <option value="">-- Select Category --</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={16}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Upload Excel File <span className="text-red-500">*</span>
                    </label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className={`flex flex-col items-center justify-center gap-2 w-full border-2 border-dashed rounded-xl py-6 cursor-pointer transition-colors ${
                        excelFile
                          ? "border-orange-300 bg-orange-50"
                          : "border-gray-200 bg-gray-50 hover:border-orange-300 hover:bg-orange-50/50"
                      }`}
                    >
                      {excelFile ? (
                        <>
                          <FileSpreadsheet
                            size={32}
                            className="text-orange-500"
                          />
                          <p className="text-sm font-semibold text-orange-700 text-center px-4 break-all">
                            {excelFileName}
                          </p>
                          <p className="text-xs text-gray-400">
                            Click to change file
                          </p>
                        </>
                      ) : (
                        <>
                          <Upload size={28} className="text-gray-400" />
                          <p className="text-sm font-semibold text-gray-600">
                            Click to upload Excel
                          </p>
                          <p className="text-xs text-gray-400">
                            .xlsx or .xls files only
                          </p>
                        </>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".xlsx,.xls"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>

                  {bulkUploadError && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2">
                      <AlertCircle
                        size={15}
                        className="text-red-500 mt-0.5 flex-shrink-0"
                      />
                      <p className="text-xs text-red-600 font-medium">
                        {bulkUploadError}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>

            {!bulkUploadResult && (
              <div className="px-6 pb-6 flex gap-3">
                <button
                  onClick={closeAddLeadModal}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddLeadSubmit}
                  disabled={
                    bulkUploadLoading || !selectedCategory || !excelFile
                  }
                  className="flex-1 py-2.5 bg-orange-500 cursor-pointer hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {bulkUploadLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload size={15} /> Upload Leads
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentView;
