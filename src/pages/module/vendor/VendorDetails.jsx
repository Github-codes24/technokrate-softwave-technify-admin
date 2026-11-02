import {
  Mail,
  Phone,
  Briefcase,
  User,
  Eye,
  Search,
  ChevronLeft,
  ChevronRight,
  XCircle,
  ArrowLeft,
  Landmark,
  X,
  ChevronDown,
  Users,
  Plus,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Download,
  Trash2,
  Calendar,
  History,
  CalendarDays,
  CalendarRange,
  ClipboardList,
  Activity,
  Sparkles,
  PhoneCall,
  AlertTriangle,
  Video,
  FileText,
  Receipt,
  Trophy,
  IndianRupee,
  CreditCard,
  LayoutDashboard,
  Filter,
} from "lucide-react";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import {
  fetchVendorById,
  fetchAllLeadIds,
  resetVendorDetails,
  setAgentPage,
  setLeadPage,
  setAgentFilters,
  setLeadFilters,
  transferLeads,
  removeTransferredLeads,
  clearAllLeadIds,
  bulkUploadLeads,
  resetBulkUpload,
  deleteVendorAgent,
} from "../../../redux/slice/vendors/getVendorDetailsSlice";
import { fetchVendors } from "../../../redux/slice/agentManagement/addAgentSlice";
import { fetchAllVendors } from "../../../redux/slice/vendors/getallVendorsSlice";
import { fetchCategories } from "../../../redux/slice/leadManagement/addLeadSlice";
import StatusBadge from "../leadManagement/StatusBadge";
import LoaderSpinner from "../../../components/uiElement/LoaderSpinner";
import debounce from "lodash/debounce";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const VendorDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const initialFetchDone = useRef(false);
  const vendorDropdownRef = useRef(null);

  const [localAgentSearch, setLocalAgentSearch] = useState("");
  const [localLeadSearch, setLocalLeadSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const normalizeStatus = (status) =>
    status ? status.charAt(0).toUpperCase() + status.slice(1) : "N/A";

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

  const handleDateDropdownChange = (e) => {
    const val = e.target.value;
    setDateFilter(val);
    dispatch(setLeadFilters({ dateFilter: val }));
    dispatch(
      fetchVendorById({
        id,
        agentPage: agentPagination.currentPage,
        leadPage: 1,
        agentLimit: 5,
        leadLimit: 10,
        agentSearch: agentFilters.search,
        leadSearch: localLeadSearch,
        leadDateFilter: val,
      }),
    );
  };

  const [vendorAllLeads, setVendorAllLeads] = useState([]);
  const [vendorStatsLoading, setVendorStatsLoading] = useState(false);

  const fetchVendorAllLeads = async () => {
    if (!id) return;
    setVendorStatsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const cleanBase = (BASE_URL || "").replace(/\/+$/, "");
      const res = await axios.get(
        `${cleanBase}/admin/vendor/getVendor/${id}?agentPage=1&agentLimit=1&leadPage=1&leadLimit=99999`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const list = res?.data?.data?.leads || res?.data?.leads || [];
      setVendorAllLeads(list);
    } catch (err) {
      console.warn("Failed to fetch all vendor leads for date stats:", err);
    } finally {
      setVendorStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorAllLeads();
  }, [id]);
  const [isAgentPageChanging, setIsAgentPageChanging] = useState(false);
  const [isLeadPageChanging, setIsLeadPageChanging] = useState(false);
  const [selectionMode, setSelectionMode] = useState("none");
  const [pageSelectedIds, setPageSelectedIds] = useState(new Set());
  const [quickSelectCount, setQuickSelectCount] = useState("");

  const [showVendorDropdown, setShowVendorDropdown] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState("");
  const [vendorSearch, setVendorSearch] = useState("");

  // ── Add Lead Modal State ──────────────────────────────────────────────────
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [excelFile, setExcelFile] = useState(null);
  const [excelFileName, setExcelFileName] = useState("");
  const fileInputRef = useRef(null);

  const [exportLoading, setExportLoading] = useState(false);

  const [agentToDelete, setAgentToDelete] = useState(null);
  const [isAgentDeleteModalOpen, setIsAgentDeleteModalOpen] = useState(false);

  const handleExportCSV = async () => {
    setExportLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/admin/vendor/getVendor/${id}?agentPage=1&agentLimit=1&leadPage=1&leadLimit=99999`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const allLeads = response.data?.data?.leads || [];
      if (allLeads.length === 0) {
        toast.info("No leads available to export.");
        setExportLoading(false);
        return;
      }

      // Headers for CSV
      const headers = [
        "Lead ID",
        "Created Date",
        "Client Name",
        "Client Email",
        "Client Phone",
        "Project Name",
        "Project Category",
        "Price",
        "Status"
      ];

      // Convert rows to CSV format
      const csvRows = [
        headers.join(","), // header row
        ...allLeads.map(lead => {
          const date = (lead.dateOfTransfer || lead.updatedAt || lead.createdAt) ? new Date(lead.dateOfTransfer || lead.updatedAt || lead.createdAt).toLocaleDateString("en-GB") : "N/A";
          const clientName = lead.client?.name || lead.clientName || "N/A";
          const clientEmail = lead.client?.email || lead.clientEmail || lead.email || "N/A";
          const clientPhone = lead.client?.phone || lead.clientPhone || "N/A";
          const projectName = lead.projectName || "N/A";
          const projectCategory = lead.projectCategory || "N/A";
          const price = lead.price || "0";
          const status = lead.status || "N/A";

          // Escape commas and double quotes
          const escapedName = `"${clientName.replace(/"/g, '""')}"`;
          const escapedEmail = `"${clientEmail.replace(/"/g, '""')}"`;
          const escapedProject = `"${projectName.replace(/"/g, '""')}"`;
          const escapedCategory = `"${projectCategory.replace(/"/g, '""')}"`;

          return [
            lead.leadId || lead._id,
            date,
            escapedName,
            escapedEmail,
            clientPhone,
            escapedProject,
            escapedCategory,
            price,
            status
          ].join(",");
        })
      ];

      const csvString = csvRows.join("\n");
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `vendor_leads_${vendorData?.name || "export"}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("CSV exported successfully!");
    } catch (err) {
      console.error("Export CSV error:", err);
      toast.error("Failed to export leads to CSV");
    } finally {
      setExportLoading(false);
    }
  };

  const {
    vendor,
    loading,
    error,
    agentPagination,
    leadPagination,
    agentFilters,
    leadFilters,
    transferLoading,
    allLeadIds,
    allLeadIdsLoading,
    bulkUploadLoading,
    bulkUploadError,
    bulkUploadResult,
    deleteAgentLoading,
  } = useSelector((state) => state.vendorDetails);

  const { vendors = [], vendorsLoading } = useSelector(
    (state) => state.addAgent,
  );
  const { categories = [] } = useSelector((state) => state.addLead);

  const vendorData = vendor?.data || vendor;
  const agentsList = vendorData?.agents || [];
  const leadsList = vendorData?.leads || [];
  console.log("DEBUG LEADS FROM GET API:", leadsList);

  const vendorDateCounts = useMemo(() => {
    const leadsSource = vendorAllLeads.length > 0 ? vendorAllLeads : leadsList;

    let today = 0;
    let yesterday = 0;
    let inWeek = 0;
    let inMonth = 0;

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const yesterdayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 0, 0, 0);
    const yesterdayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59, 999);

    const dayOfWeek = now.getDay();
    const distanceToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - distanceToMonday, 0, 0, 0, 0);

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    leadsSource.forEach((lead) => {
      const dateVal =
        lead?.dateOfTransfer ||
        lead?.transferDate ||
        lead?.transferredAt ||
        lead?.createdAt ||
        lead?.created_at ||
        lead?.date ||
        lead?.updatedAt;
      const d = parseDate(dateVal);
      if (!d) return;

      if (d >= todayStart && d <= todayEnd) today++;
      if (d >= yesterdayStart && d <= yesterdayEnd) yesterday++;
      if (d >= weekStart && d <= todayEnd) inWeek++;
      if (d >= monthStart && d <= monthEnd) inMonth++;
    });

    return { today, yesterday, inWeek, inMonth };
  }, [vendorAllLeads, leadsList]);

  const formatCurrency = (val) => {
    if (!val || val === 0) return "₹0";
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} Lakhs`;
    }
    return `₹${val.toLocaleString()}`;
  };

  const vendorMetrics = useMemo(() => {
    const leadsSource = vendorAllLeads.length > 0 ? vendorAllLeads : leadsList;

    let totalLeads = vendorData?.leadCount ?? (leadPagination.total || leadsSource.length);
    let newLeadsToday = vendorDateCounts.today || 0;
    let activeLeads = 0;
    let qualifiedLeads = 0;
    let followupsToday = 0;
    let overdueFollowups = 0;
    let meetingsToday = 0;
    let proposalsSent = 0;
    let quotationsSent = 0;
    let wonDeals = 0;
    let lostDeals = 0;
    let totalRevenue = 0;
    let pendingPayments = 0;
    let projectsInProgress = 0;

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

    leadsSource.forEach((lead) => {
      const statusRaw = lead?.status ? lead.status.charAt(0).toUpperCase() + lead.status.slice(1) : "";
      const price = parseFloat(lead?.price) || parseFloat(lead?.amount) || 0;

      const dateVal =
        lead?.dateOfTransfer ||
        lead?.transferDate ||
        lead?.transferredAt ||
        lead?.createdAt ||
        lead?.created_at ||
        lead?.date ||
        lead?.updatedAt;
      const d = parseDate(dateVal);

      if (["New", "Submitted", "Pending"].includes(statusRaw)) {
        activeLeads++;
        pendingPayments += price;
      }

      if (statusRaw === "Approved") {
        qualifiedLeads++;
      }

      if (["Submitted", "Pending", "Approved", "Paid", "Ongoing", "Completed"].includes(statusRaw)) {
        quotationsSent++;
      }
      if (["Approved", "Paid", "Ongoing", "Completed"].includes(statusRaw)) {
        proposalsSent++;
      }

      if (["Approved", "Paid", "Completed"].includes(statusRaw)) {
        wonDeals++;
        totalRevenue += price;
      }

      if (statusRaw === "Rejected") {
        lostDeals++;
      }

      if (["Ongoing", "Approved"].includes(statusRaw)) {
        projectsInProgress++;
      }

      if (d && d >= todayStart) {
        meetingsToday++;
        if (["New", "Submitted", "Pending"].includes(statusRaw)) {
          followupsToday++;
        }
      } else if (d && d < todayStart && ["New", "Submitted", "Pending"].includes(statusRaw)) {
        overdueFollowups++;
      }
    });

    if (qualifiedLeads === 0 && vendorData?.approvedLeads) qualifiedLeads = vendorData.approvedLeads;
    if (lostDeals === 0 && vendorData?.rejectedLeads) lostDeals = vendorData.rejectedLeads;
    if (activeLeads === 0 && vendorData?.submittedLeads) activeLeads = vendorData.submittedLeads;

    return {
      totalLeads,
      newLeadsToday,
      activeLeads,
      qualifiedLeads,
      followupsToday,
      overdueFollowups,
      meetingsToday,
      proposalsSent,
      quotationsSent,
      wonDeals,
      lostDeals,
      totalRevenue,
      pendingPayments,
      projectsInProgress,
    };
  }, [vendorAllLeads, leadsList, vendorData, leadPagination.total, vendorDateCounts]);

  const keyCards = [
    {
      title: "TOTAL LEADS",
      value: vendorMetrics.totalLeads.toLocaleString(),
      change: "Real-time",
      isPositive: true,
      icon: ClipboardList,
      color: "from-blue-500 to-indigo-600",
      filterKey: "All",
    },
    {
      title: "NEW LEADS TODAY",
      value: vendorMetrics.newLeadsToday.toLocaleString(),
      change: "Today",
      isPositive: true,
      icon: Sparkles,
      color: "from-orange-500 to-amber-500",
      filterKey: "TodayDate",
    },
    {
      title: "ACTIVE LEADS",
      value: vendorMetrics.activeLeads.toLocaleString(),
      change: "Pending",
      isPositive: true,
      icon: Activity,
      color: "from-cyan-500 to-blue-600",
      filterKey: "Pending",
    },
    {
      title: "QUALIFIED LEADS",
      value: vendorMetrics.qualifiedLeads.toLocaleString(),
      change: "Approved",
      isPositive: true,
      icon: CheckCircle2,
      color: "from-emerald-500 to-teal-600",
      filterKey: "Approved",
    },
    {
      title: "FOLLOW-UPS TODAY",
      value: vendorMetrics.followupsToday.toLocaleString(),
      change: "Scheduled",
      isPositive: true,
      icon: PhoneCall,
      color: "from-amber-500 to-orange-600",
      filterKey: "TodayDate",
    },
    {
      title: "OVERDUE FOLLOW-UPS",
      value: vendorMetrics.overdueFollowups.toLocaleString(),
      change: "Requires Action",
      isPositive: false,
      icon: AlertTriangle,
      color: "from-rose-500 to-red-600",
      filterKey: "Pending",
    },
    {
      title: "MEETINGS TODAY",
      value: vendorMetrics.meetingsToday.toLocaleString(),
      change: "On Track",
      isPositive: true,
      icon: Video,
      color: "from-purple-500 to-indigo-600",
      filterKey: "TodayDate",
    },
    {
      title: "PROPOSALS SENT",
      value: vendorMetrics.proposalsSent.toLocaleString(),
      change: "Sent",
      isPositive: true,
      icon: FileText,
      color: "from-violet-500 to-purple-600",
      filterKey: "Approved",
    },
    {
      title: "QUOTATIONS SENT",
      value: vendorMetrics.quotationsSent.toLocaleString(),
      change: "Sent",
      isPositive: true,
      icon: Receipt,
      color: "from-sky-500 to-blue-600",
      filterKey: "Pending",
    },
    {
      title: "WON DEALS",
      value: vendorMetrics.wonDeals.toLocaleString(),
      change: "Won",
      isPositive: true,
      icon: Trophy,
      color: "from-green-500 to-emerald-600",
      filterKey: "Approved",
    },
    {
      title: "LOST DEALS",
      value: vendorMetrics.lostDeals.toLocaleString(),
      change: "Rejected",
      isPositive: false,
      icon: XCircle,
      color: "from-red-500 to-rose-600",
      filterKey: "Rejected",
    },
    {
      title: "TOTAL REVENUE",
      value: formatCurrency(vendorMetrics.totalRevenue),
      change: "Won Deals",
      isPositive: true,
      icon: IndianRupee,
      color: "from-emerald-600 to-green-700",
      filterKey: "Approved",
    },
    {
      title: "PENDING PAYMENTS",
      value: formatCurrency(vendorMetrics.pendingPayments),
      change: "Pending",
      isPositive: false,
      icon: CreditCard,
      color: "from-amber-500 to-yellow-600",
      filterKey: "Pending",
    },
    {
      title: "PROJECTS IN PROGRESS",
      value: vendorMetrics.projectsInProgress.toLocaleString(),
      change: "Ongoing",
      isPositive: true,
      icon: Briefcase,
      color: "from-indigo-500 to-purple-600",
      filterKey: "Approved",
    },
  ];

  const handleStatusCardClick = (selectedStatus) => {
    const newStatus = statusFilter === selectedStatus ? "All" : selectedStatus;
    setStatusFilter(newStatus);
  };

  const handleDateCardClick = (selectedFilter) => {
    const newFilter = dateFilter === selectedFilter ? "All" : selectedFilter;
    setDateFilter(newFilter);
    dispatch(setLeadFilters({ dateFilter: newFilter }));
    dispatch(
      fetchVendorById({
        id,
        agentPage: agentPagination.currentPage,
        leadPage: 1,
        agentLimit: 5,
        leadLimit: 10,
        agentSearch: agentFilters.search,
        leadSearch: localLeadSearch,
        leadDateFilter: newFilter,
      }),
    );
  };

  // ── Client-side filter for current page ──────────────────────────────────
  const filteredLeads = useMemo(() => {
    let list = leadsList;
    if (localLeadSearch.trim()) {
      const q = localLeadSearch.toLowerCase();
      list = list.filter(
        (lead) =>
          lead.client?.name?.toLowerCase().includes(q) ||
          lead.projectName?.toLowerCase().includes(q) ||
          lead.leadId?.toLowerCase().includes(q),
      );
    }
    if (dateFilter && dateFilter !== "All") {
      list = list.filter((lead) => {
        const d = lead.dateOfTransfer || lead.transferDate || lead.transferredAt || lead.updatedAt || lead.createdAt;
        return matchesDateFilter(d, dateFilter);
      });
    }
    if (statusFilter && statusFilter !== "All") {
      list = list.filter((lead) => {
        const s = (lead.status || "").toLowerCase();
        if (statusFilter === "Pending") return s === "pending" || s === "submitted" || s === "new";
        if (statusFilter === "Approved") return s === "approved";
        if (statusFilter === "Rejected") return s === "rejected";
        return s === statusFilter.toLowerCase();
      });
    }
    return list.slice().sort((a, b) => {
      const valA = a.dateOfTransfer || a.transferDate || a.transferredAt || a.updatedAt || a.createdAt || a.date;
      const valB = b.dateOfTransfer || b.transferDate || b.transferredAt || b.updatedAt || b.createdAt || b.date;
      const dateA = parseDate(valA)?.getTime() || 0;
      const dateB = parseDate(valB)?.getTime() || 0;
      return dateB - dateA;
    });
  }, [leadsList, localLeadSearch, dateFilter, statusFilter]);

  // ── Derived selection values ──────────────────────────────────────────────
  const totalLeadCount = leadPagination.total || 0;

  const effectiveSelectedIds = useMemo(() => {
    if (selectionMode === "all") return new Set(allLeadIds);
    return pageSelectedIds;
  }, [selectionMode, allLeadIds, pageSelectedIds]);

  const selectedCount =
    selectionMode === "all" ? allLeadIds.length : pageSelectedIds.size;

  const pageAllChecked =
    filteredLeads.length > 0 &&
    filteredLeads.every((l) => effectiveSelectedIds.has(l._id));

  const pageIndeterminate =
    !pageAllChecked &&
    filteredLeads.some((l) => effectiveSelectedIds.has(l._id));

  const hasMorePages = totalLeadCount > filteredLeads.length;

  // ── Selection handlers ────────────────────────────────────────────────────
  const togglePageSelectAll = () => {
    if (selectionMode === "all") {
      setSelectionMode("page");
      setPageSelectedIds(new Set(filteredLeads.map((l) => l._id)));
      dispatch(clearAllLeadIds());
      return;
    }
    if (pageAllChecked) {
      setPageSelectedIds(new Set());
      setSelectionMode("none");
    } else {
      setPageSelectedIds(new Set(filteredLeads.map((l) => l._id)));
      setSelectionMode("page");
    }
  };

  const toggleSelectLead = (leadId) => {
    if (selectionMode === "all") {
      const next = new Set(filteredLeads.map((l) => l._id));
      next.delete(leadId);
      setPageSelectedIds(next);
      setSelectionMode(next.size > 0 ? "page" : "none");
      dispatch(clearAllLeadIds());
      return;
    }
    const next = new Set(pageSelectedIds);
    next.has(leadId) ? next.delete(leadId) : next.add(leadId);
    setPageSelectedIds(next);
    setSelectionMode(next.size > 0 ? "page" : "none");
  };

  const openAgentDeleteModal = (agent) => {
    setAgentToDelete(agent);
    setIsAgentDeleteModalOpen(true);
  };

  const closeAgentDeleteModal = () => {
    setIsAgentDeleteModalOpen(false);
    setAgentToDelete(null);
  };

  const confirmDeleteAgent = async () => {
    if (!agentToDelete) return;
    const result = await dispatch(deleteVendorAgent(agentToDelete._id));
    if (deleteVendorAgent.fulfilled.match(result)) {
      toast.success("Agent deleted successfully!");
      closeAgentDeleteModal();
      dispatch(
        fetchVendorById({
          id,
          agentPage: agentPagination.currentPage,
          leadPage: leadPagination.currentPage,
          agentLimit: 5,
          leadLimit: 5,
        }),
      );
    } else {
      toast.error(result.payload || "Failed to delete agent.");
    }
  };

  const handleSelectAllLeads = async () => {
    await dispatch(
      fetchAllLeadIds({
        id,
        leadSearch: leadFilters.search,
        leadFromDate: leadFilters.fromDate,
        leadToDate: leadFilters.toDate,
      }),
    );
    setPageSelectedIds(new Set(filteredLeads.map((l) => l._id)));
    setSelectionMode("all");
  };

  const clearSelection = () => {
    setSelectionMode("none");
    setPageSelectedIds(new Set());
    setSelectedVendorId("");
    setShowVendorDropdown(false);
    setQuickSelectCount("");
    dispatch(clearAllLeadIds());
  };

  const handleQuickSelectChange = (e) => {
    const val = e.target.value;
    setQuickSelectCount(val);
    if (!val) {
      clearSelection();
      return;
    }
    const count = parseInt(val, 10);
    const topLeads = filteredLeads.slice(0, count);
    if (topLeads.length === 0) {
      toast.info("No leads available to select.");
      return;
    }
    setPageSelectedIds(new Set(topLeads.map((l) => l._id)));
    setSelectionMode("page");
    toast.info(`Selected top ${topLeads.length} lead(s) for transfer`);
  };

  // ── Assign / Transfer ─────────────────────────────────────────────────────
  const handleAssignClick = () => {
    if (!showVendorDropdown) dispatch(fetchVendors());
    setShowVendorDropdown((v) => !v);
  };

  const handleAssignLeads = async () => {
    if (!selectedVendorId) {
      toast.error("Please select a vendor");
      return;
    }
    if (selectedVendorId === id) {
      toast.error("Cannot transfer to the same vendor");
      return;
    }
    const leadIdsToSend =
      selectionMode === "all" ? allLeadIds : [...pageSelectedIds];
    const result = await dispatch(
      transferLeads({ vendorId: selectedVendorId, leadIds: leadIdsToSend }),
    );
    if (transferLeads.fulfilled.match(result)) {
      const transferredIds =
        result.payload?.data?.leads?.map((l) => l._id) || leadIdsToSend;
      dispatch(removeTransferredLeads(transferredIds));
      toast.success(
        `${transferredIds.length} lead(s) transferred successfully!`,
      );
      setShowVendorDropdown(false);
      setTimeout(() => clearSelection(), 1500);

      // Refresh current vendor details & all vendors list so Redux state updates without requiring page refresh
      dispatch(
        fetchVendorById({
          id,
          agentPage: agentPagination.currentPage,
          leadPage: leadPagination.currentPage,
          agentLimit: 5,
          leadLimit: 10,
          agentSearch: agentFilters.search,
          leadSearch: localLeadSearch,
          leadDateFilter: dateFilter,
        }),
      );
      dispatch(fetchAllVendors());
      fetchVendorAllLeads();
    } else {
      toast.error(result.payload || "Transfer failed. Please try again.");
    }
  };

  // ── Add Lead Modal Handlers ───────────────────────────────────────────────
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

    const result = await dispatch(bulkUploadLeads({ vendorId: id, formData }));

    if (bulkUploadLeads.fulfilled.match(result)) {
      const data = result.payload?.data;
      toast.success(
        `Upload complete! ${data?.successCount ?? 0} leads added successfully.`,
      );
      // Auto close + refresh after 2.5s so user can read the summary
      setTimeout(() => {
        closeAddLeadModal();
        dispatch(
          fetchVendorById({
            id,
            agentPage: agentPagination.currentPage,
            leadPage: leadPagination.currentPage,
            agentLimit: 5,
            leadLimit: 10,
          }),
        );
        fetchVendorAllLeads();
      }, 2500);
    } else {
      toast.error(result.payload || "Bulk upload failed. Please try again.");
    }
  };

  // ── Vendor search filter ──────────────────────────────────────────────────
  const filteredVendors = useMemo(() => {
    if (!vendorSearch.trim()) return vendors;
    const q = vendorSearch.toLowerCase();
    return vendors.filter((v) => v.name?.toLowerCase().includes(q));
  }, [vendors, vendorSearch]);

  // ── Close dropdown on outside click ──────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (
        vendorDropdownRef.current &&
        !vendorDropdownRef.current.contains(e.target)
      )
        setShowVendorDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Debounced search ──────────────────────────────────────────────────────
  const debouncedAgentSearch = useMemo(
    () =>
      debounce((val) => {
        setIsAgentPageChanging(true);
        dispatch(setAgentFilters({ search: val }));
        dispatch(
          fetchVendorById({
            id,
            agentPage: 1,
            leadPage: leadPagination.currentPage,
            agentLimit: 5,
            leadLimit: 5,
            agentSearch: val,
            agentFromDate: agentFilters.fromDate,
            agentToDate: agentFilters.toDate,
            leadFromDate: leadFilters.fromDate,
            leadToDate: leadFilters.toDate,
          }),
        ).finally(() => setIsAgentPageChanging(false));
      }, 500),
    [dispatch, id, leadPagination.currentPage, agentFilters, leadFilters],
  );

  const debouncedLeadSearch = useMemo(
    () =>
      debounce((val) => {
        setIsLeadPageChanging(true);
        dispatch(setLeadFilters({ search: val }));
        dispatch(
          fetchVendorById({
            id,
            agentPage: agentPagination.currentPage,
            leadPage: 1,
            agentLimit: 5,
            leadLimit: 5,
            agentSearch: agentFilters.search,
            leadSearch: val,
            agentFromDate: agentFilters.fromDate,
            agentToDate: agentFilters.toDate,
            leadFromDate: leadFilters.fromDate,
            leadToDate: leadFilters.toDate,
          }),
        ).finally(() => setIsLeadPageChanging(false));
      }, 500),
    [dispatch, id, agentPagination.currentPage, agentFilters, leadFilters],
  );

  // ── Initial fetch ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (id && !initialFetchDone.current) {
      initialFetchDone.current = true;
      dispatch(
        fetchVendorById({
          id,
          agentPage: 1,
          leadPage: 1,
          agentLimit: 5,
          leadLimit: 10,
        }),
      );
    }
    return () => {
      dispatch(resetVendorDetails());
      initialFetchDone.current = false;
    };
  }, [id, dispatch]);

  // ── Input / date handlers ─────────────────────────────────────────────────
  const handleAgentSearchChange = (e) => {
    setLocalAgentSearch(e.target.value);
    debouncedAgentSearch(e.target.value);
  };
  const handleLeadSearchChange = (e) => {
    setLocalLeadSearch(e.target.value);
    debouncedLeadSearch(e.target.value);
  };

  const handleLeadDateFilter = (field, value) => {
    const newFrom = field === "fromDate" ? value : leadFilters.fromDate;
    const newTo = field === "toDate" ? value : leadFilters.toDate;
    dispatch(setLeadFilters({ [field]: value }));
    setIsLeadPageChanging(true);
    dispatch(
      fetchVendorById({
        id,
        agentPage: agentPagination.currentPage,
        leadPage: 1,
        agentLimit: 5,
        leadLimit: 5,
        agentSearch: agentFilters.search,
        agentFromDate: agentFilters.fromDate,
        agentToDate: agentFilters.toDate,
        leadFromDate: newFrom,
        leadToDate: newTo,
      }),
    ).finally(() => setIsLeadPageChanging(false));
  };

  const handleClearLeadDateFilter = () => {
    dispatch(setLeadFilters({ fromDate: "", toDate: "" }));
    setIsLeadPageChanging(true);
    dispatch(
      fetchVendorById({
        id,
        agentPage: agentPagination.currentPage,
        leadPage: 1,
        agentLimit: 5,
        leadLimit: 5,
        agentSearch: agentFilters.search,
        agentFromDate: agentFilters.fromDate,
        agentToDate: agentFilters.toDate,
        leadFromDate: "",
        leadToDate: "",
      }),
    ).finally(() => setIsLeadPageChanging(false));
  };

  // ── Pagination ────────────────────────────────────────────────────────────
  const handleAgentPageChange = (newPage) => {
    if (
      newPage < 1 ||
      newPage > agentPagination.totalPages ||
      isAgentPageChanging
    )
      return;
    setIsAgentPageChanging(true);
    dispatch(setAgentPage(newPage));
    dispatch(
      fetchVendorById({
        id,
        agentPage: newPage,
        leadPage: leadPagination.currentPage,
        agentLimit: 5,
        leadLimit: 5,
        agentSearch: agentFilters.search,
        agentFromDate: agentFilters.fromDate,
        agentToDate: agentFilters.toDate,
        leadFromDate: leadFilters.fromDate,
        leadToDate: leadFilters.toDate,
      }),
    ).finally(() => setIsAgentPageChanging(false));
  };

  const handleLeadPageChange = (newPage) => {
    if (
      newPage < 1 ||
      newPage > leadPagination.totalPages ||
      isLeadPageChanging
    )
      return;
    setIsLeadPageChanging(true);
    dispatch(setLeadPage(newPage));
    dispatch(
      fetchVendorById({
        id,
        agentPage: agentPagination.currentPage,
        leadPage: newPage,
        agentLimit: 5,
        leadLimit: 5,
        agentSearch: agentFilters.search,
        agentFromDate: agentFilters.fromDate,
        agentToDate: agentFilters.toDate,
        leadFromDate: leadFilters.fromDate,
        leadToDate: leadFilters.toDate,
      }),
    ).finally(() => setIsLeadPageChanging(false));
  };

  // ── UI helpers ────────────────────────────────────────────────────────────
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

  // ── Guards ────────────────────────────────────────────────────────────────
  if (loading && !vendorData)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoaderSpinner />
      </div>
    );
  if (error)
    return (
      <div className="p-10 text-center">
        <XCircle className="mx-auto text-red-500 mb-4" size={48} />
        <p>{error}</p>
      </div>
    );
  if (!vendorData) return null;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 min-h-screen bg-gray-50/20">
      {/* Toast Container */}
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
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Landmark className="w-7 h-7" /> Vendor Management
        </h1>
        <div className="text-sm text-orange-100 flex items-center gap-2 mt-3">
          <NavLink to="/dashboard" className="hover:text-white">
            <span className="bg-white/20 px-3 py-1 rounded-lg">Dashboard</span>
          </NavLink>
          <span className="text-white/60">›</span>
          <NavLink to="/vendor" className="hover:text-white">
            <span className="bg-white/20 px-3 py-1 rounded-lg">
              Vendor Management
            </span>
          </NavLink>
          <span className="text-white/60">›</span>
          <span className="text-white font-medium">Vendor Details</span>
        </div>
      </div>

      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold transition"
      >
        <ArrowLeft className="w-5 h-5" /> Back to All Vendors
      </button>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 mb-6 overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center justify-between p-4 gap-4 border-b border-gray-50">
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-xl uppercase">
              {vendorData.name?.charAt(0) || "V"}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-bold text-gray-800 leading-tight">
                  {vendorData.name}
                </h2>
                {(() => {
                  const isVendorActive = vendorData.status
                    ? vendorData.status.toLowerCase() === "active"
                    : vendorData.isActive !== undefined
                    ? vendorData.isActive
                    : true;
                  return (
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                        isVendorActive
                          ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                          : "bg-rose-100 text-rose-700 border border-rose-200"
                      }`}
                    >
                      {isVendorActive ? "Active" : "Inactive"}
                    </span>
                  );
                })()}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xs font-semibold text-orange-500 uppercase tracking-wider">
                  {vendorData.teamCode || "N/A"}
                </p>
                <span className="text-gray-300">|</span>
                <p className="text-xs font-bold text-gray-600">
                  Commission : {vendorData.commissionRate || 0}%
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-6 w-full lg:w-auto">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">
                {vendorData.email}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-gray-700">
                {vendorData.phone}
              </span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50/30">
          {[
            { label: "Occupation", value: vendorData.occupation },
            { label: "City", value: vendorData.city },
            { label: "Total Leads", value: vendorData.leadCount ?? 0 },
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

      {/* ══════════════════ DATE ANALYTICS OVERVIEW CARDS (TODAY, YESTERDAY, IN WEEK, IN MONTH) ══════════════════ */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-500" />
            Vendor Leads Date Overview
          </h3>
          <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            Click card to filter leads
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            onClick={() => handleDateCardClick("Today")}
            className={`bg-gradient-to-r from-orange-50 to-orange-100/80 rounded-xl p-4 border border-orange-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group ${dateFilter === "Today" ? "ring-2 ring-orange-500 shadow-md scale-[1.01]" : ""}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-orange-600 uppercase tracking-wider">Today</p>
                <p className="text-2xl font-extrabold text-gray-800 mt-1">
                  {vendorStatsLoading ? (
                    <span className="inline-block w-8 h-7 bg-orange-200/80 animate-pulse rounded-md mt-1"></span>
                  ) : (
                    vendorDateCounts.today || 0
                  )}
                </p>
                <p className="text-[11px] font-medium text-orange-600/80 mt-0.5">Today's Leads</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div 
            onClick={() => handleDateCardClick("Yesterday")}
            className={`bg-gradient-to-r from-blue-50 to-blue-100/80 rounded-xl p-4 border border-blue-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group ${dateFilter === "Yesterday" ? "ring-2 ring-blue-500 shadow-md scale-[1.01]" : ""}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Yesterday</p>
                <p className="text-2xl font-extrabold text-gray-800 mt-1">
                  {vendorStatsLoading ? (
                    <span className="inline-block w-8 h-7 bg-blue-200/80 animate-pulse rounded-md mt-1"></span>
                  ) : (
                    vendorDateCounts.yesterday || 0
                  )}
                </p>
                <p className="text-[11px] font-medium text-blue-600/80 mt-0.5">Previous Day Leads</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <History className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div 
            onClick={() => handleDateCardClick("In Week")}
            className={`bg-gradient-to-r from-purple-50 to-purple-100/80 rounded-xl p-4 border border-purple-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group ${dateFilter === "In Week" ? "ring-2 ring-purple-500 shadow-md scale-[1.01]" : ""}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider">In Week</p>
                <p className="text-2xl font-extrabold text-gray-800 mt-1">
                  {vendorStatsLoading ? (
                    <span className="inline-block w-8 h-7 bg-purple-200/80 animate-pulse rounded-md mt-1"></span>
                  ) : (
                    vendorDateCounts.inWeek || 0
                  )}
                </p>
                <p className="text-[11px] font-medium text-purple-600/80 mt-0.5">Current Week Leads</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <CalendarDays className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div 
            onClick={() => handleDateCardClick("In Month")}
            className={`bg-gradient-to-r from-emerald-50 to-emerald-100/80 rounded-xl p-4 border border-emerald-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group ${dateFilter === "In Month" ? "ring-2 ring-emerald-500 shadow-md scale-[1.01]" : ""}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">In Month</p>
                <p className="text-2xl font-extrabold text-gray-800 mt-1">
                  {vendorStatsLoading ? (
                    <span className="inline-block w-8 h-7 bg-emerald-200/80 animate-pulse rounded-md mt-1"></span>
                  ) : (
                    vendorDateCounts.inMonth || 0
                  )}
                </p>
                <p className="text-[11px] font-medium text-emerald-600/80 mt-0.5">Current Month Leads</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <CalendarRange className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════ KEY DASHBOARD METRIC CARDS (14 CARDS) ══════════════════ */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-orange-500" />
            Key Vendor Dashboard Cards
          </h3>
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
            14 Metrics Tracked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {keyCards.map((card, idx) => {
            const Icon = card.icon;
            const isSelected =
              (card.filterKey === "TodayDate" && dateFilter === "Today") ||
              (card.filterKey && card.filterKey !== "TodayDate" && statusFilter === card.filterKey);

            return (
              <div
                key={idx}
                onClick={() => {
                  if (card.filterKey === "TodayDate") {
                    handleDateCardClick("Today");
                  } else if (card.filterKey) {
                    handleStatusCardClick(card.filterKey);
                  }
                }}
                className={`bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-200 cursor-pointer group hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between ${
                  isSelected ? "ring-2 ring-orange-500 shadow-md scale-[1.01]" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      {card.title}
                    </p>
                    <p className="text-2xl font-black text-gray-800 tracking-tight">
                      {vendorStatsLoading ? (
                        <span className="inline-block w-8 h-7 bg-gray-100 animate-pulse rounded-md mt-1"></span>
                      ) : (
                        card.value
                      )}
                    </p>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      card.isPositive
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        : "bg-rose-50 text-rose-600 border border-rose-100"
                    }`}
                  >
                    {card.change}
                  </span>
                  <span className="text-xs text-gray-400 group-hover:text-orange-500 transition-colors flex items-center gap-0.5 font-medium">
                    View Details <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ══════════════════ LEADS TABLE ══════════════════ */}
      <div className="mb-10">
        {/* 
          LAYOUT FIX:
          - Outer wrapper is `relative` so the "+ Add Lead" button can be absolutely positioned top-right
          - Left side: title + selection action bar (can grow freely, never pushes right side)
          - Right side: "+ Add Lead" button is fixed at top-right with `absolute`
          - Filters row is a separate full-width row below, with right padding to avoid overlapping the button
        */}
        <div className="relative mb-3 px-2">
          {/* ── Row 1: Title + Selection bar ── */}
          <div className="flex items-center gap-3 flex-wrap pr-32 min-h-[38px]">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 italic">
              <Briefcase size={20} className="text-emerald-500" /> Recent Leads
              Summary
            </h3>

            {/* Quick Bulk Transfer Selection Dropdown (10, 20, 30, 40, 50 leads) */}
            <div className="relative">
              <select
                value={quickSelectCount}
                onChange={handleQuickSelectChange}
                className="bg-white border border-orange-300 text-orange-700 text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer outline-none shadow-xs hover:border-orange-500 focus:ring-2 focus:ring-orange-300 transition-all"
              >
                <option value="">Quick Lead Transfer</option>
                <option value="10">Select 10 Leads</option>
                <option value="20">Select 20 Leads</option>
                <option value="30">Select 30 Leads</option>
                <option value="40">Select 40 Leads</option>
                <option value="50">Select 50 Leads</option>
              </select>
            </div>

            {/* Selection action bar — inline, never displaces the Add Lead button */}
            {selectionMode !== "none" && selectedCount > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap">
                  {selectedCount} selected
                </span>

                <div className="relative" ref={vendorDropdownRef}>
                  <button
                    onClick={handleAssignClick}
                    className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                  >
                    <Users size={13} />
                    Assign Lead
                    <ChevronDown
                      size={12}
                      className={`transition-transform ${showVendorDropdown ? "rotate-180" : ""}`}
                    />
                  </button>

                  {showVendorDropdown && (
                    <div className="absolute left-0 top-full mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                      <div className="p-3 border-b border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                          Select Vendor
                        </p>
                        <div className="relative">
                          <Search
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                            size={13}
                          />
                          <input
                            type="text"
                            placeholder="Search vendor..."
                            className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-orange-300"
                            value={vendorSearch}
                            onChange={(e) => setVendorSearch(e.target.value)}
                            autoFocus
                          />
                        </div>
                      </div>

                      <div className="max-h-52 overflow-y-auto">
                        {vendorsLoading ? (
                          <div className="flex justify-center py-5">
                            <div className="w-6 h-6 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
                          </div>
                        ) : filteredVendors.length > 0 ? (
                          filteredVendors.map((v) => {
                            const isSel = selectedVendorId === v._id;
                            return (
                              <button
                                key={v._id}
                                onClick={() => setSelectedVendorId(v._id)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50 transition-colors text-left ${isSel ? "bg-orange-50/70" : ""}`}
                              >
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${isSel ? "bg-orange-500 text-white" : "bg-orange-100 text-orange-600"}`}
                                >
                                  {v.name?.charAt(0)?.toUpperCase()}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p
                                    className={`text-sm font-semibold truncate ${isSel ? "text-orange-600" : "text-gray-800"}`}
                                  >
                                    {v.name}
                                  </p>
                                  {v.teamCode && (
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                                      {v.teamCode}
                                    </p>
                                  )}
                                </div>
                                {isSel && (
                                  <div className="ml-auto w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg
                                      width="9"
                                      height="7"
                                      viewBox="0 0 9 7"
                                      fill="none"
                                    >
                                      <path
                                        d="M1 3.5L3.5 6L8 1"
                                        stroke="white"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  </div>
                                )}
                              </button>
                            );
                          })
                        ) : (
                          <p className="text-sm text-gray-400 text-center py-5">
                            No vendors found
                          </p>
                        )}
                      </div>

                      <div className="p-3 border-t border-gray-100 bg-gray-50/50">
                        <button
                          onClick={handleAssignLeads}
                          disabled={!selectedVendorId || transferLoading}
                          className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          {transferLoading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Transferring...
                            </>
                          ) : (
                            `Transfer ${selectedCount} Lead${selectedCount !== 1 ? "s" : ""}`
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={clearSelection}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Clear selection"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          {/* ── Action buttons — pinned to top-right, never moves ── */}
          <div className="absolute top-0 right-2 flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              disabled={exportLoading}
              className="flex items-center gap-1.5 bg-emerald-600 disabled:opacity-50 cursor-pointer hover:bg-emerald-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors shadow-sm whitespace-nowrap"
            >
              {exportLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download size={16} /> Export
                </>
              )}
            </button>
            <button
              onClick={openAddLeadModal}
              className="flex items-center gap-1.5 bg-orange-500 cursor-pointer hover:bg-orange-600 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors shadow-sm whitespace-nowrap"
            >
              <Plus size={16} /> Add Lead
            </button>
          </div>

          {/* ── Row 2: Date + keyword filters ── */}
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <div className="relative w-64">
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

            {/* Date Filter Dropdown */}
            <div className="relative w-48">
              <Calendar className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              <select
                value={dateFilter}
                onChange={handleDateDropdownChange}
                className="w-full pl-10 pr-8 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none shadow-sm appearance-none cursor-pointer focus:border-orange-300 font-medium text-gray-700"
              >
                <option value="All">All Dates</option>
                <option value="Today">Today</option>
                <option value="Yesterday">Yesterday</option>
                <option value="In Week">In Week</option>
                <option value="In Month">In Month</option>
              </select>
            </div>

            {/* Status Filter Dropdown */}
            <div className="relative w-44">
              <Filter className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-8 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none shadow-sm appearance-none cursor-pointer focus:border-orange-300 font-medium text-gray-700"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
          </div>
        </div>

        {/* "Select all X leads" banner */}
        {selectionMode === "page" && pageAllChecked && hasMorePages && (
          <div className="mb-3 flex items-center gap-3 px-4 py-2.5 bg-orange-50 border border-orange-100 rounded-xl">
            <span className="text-sm text-gray-700">
              <strong>{filteredLeads.length}</strong> leads on this page are
              selected.
            </span>
            <button
              onClick={handleSelectAllLeads}
              disabled={allLeadIdsLoading}
              className="flex items-center gap-1.5 text-sm font-bold text-orange-600 hover:text-orange-700 disabled:opacity-60 whitespace-nowrap"
            >
              {allLeadIdsLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-orange-400/30 border-t-orange-500 rounded-full animate-spin" />
                  Loading...
                </>
              ) : (
                <>Select all {totalLeadCount} leads</>
              )}
            </button>
          </div>
        )}

        {/* "All leads selected" banner */}
        {selectionMode === "all" && (
          <div className="mb-3 flex items-center gap-3 px-4 py-2.5 bg-orange-50 border border-orange-200 rounded-xl">
            <span className="text-sm text-gray-700">
              All <strong>{allLeadIds.length}</strong> leads are selected.
            </span>
            <button
              onClick={clearSelection}
              className="text-sm font-bold text-orange-600 hover:text-orange-700 underline underline-offset-2 whitespace-nowrap"
            >
              Clear selection
            </button>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative">
          {isLeadPageChanging && <TableLoader />}
          <div className="h-[400px] overflow-y-auto custom-scrollbar">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">
                <tr className="text-sm text-gray-700">
                  <th className="px-4 py-4 w-10">
                    <input
                      type="checkbox"
                      checked={pageAllChecked || selectionMode === "all"}
                      ref={(el) => {
                        if (el)
                          el.indeterminate =
                            pageIndeterminate && selectionMode !== "all";
                      }}
                      onChange={togglePageSelectAll}
                      className="w-4 h-4 accent-orange-500 cursor-pointer rounded"
                      title="Select / deselect current page"
                    />
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">Date</th>
                  <th className="px-6 py-4 text-left font-semibold">
                    Client Name
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">
                    Project Details
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">Price</th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>
                  <th className="px-6 py-4 text-left font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => {
                    const isChecked =
                      selectionMode === "all" || pageSelectedIds.has(lead._id);
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
                          <span className="text-sm font-medium text-gray-700">
                            {(() => {
                              const dVal = lead.dateOfTransfer || lead.transferDate || lead.transferredAt || lead.updatedAt || lead.createdAt;
                              const parsed = parseDate(dVal);
                              return parsed ? parsed.toLocaleDateString("en-GB") : "N/A";
                            })()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-800">
                            {lead.client?.name || "N/A"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {lead.client?.phone}
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
                          <StatusBadge status={normalizeStatus(lead.status)} />
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() =>
                              navigate(
                                `/leadmanagement/lead-details/${lead._id}`,
                              )
                            }
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
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
              Page {leadPagination.currentPage} of {leadPagination.totalPages}
              {selectionMode === "all" && (
                <span className="ml-2 text-orange-500">
                  • All {allLeadIds.length} leads selected
                </span>
              )}
            </p>
            <TablePagination
              current={leadPagination.currentPage}
              total={leadPagination.totalPages}
              onPageChange={handleLeadPageChange}
              isLoading={isLeadPageChanging}
            />
          </div>
        </div>
      </div>

      {/* ══════════════════ AGENTS TABLE ══════════════════ */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4 px-2">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 italic">
            <User size={20} className="text-blue-500" /> Associated Agents (
            {agentPagination.total})
          </h3>
          <div className="relative w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search Agent Name..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none shadow-sm focus:border-orange-300"
              value={localAgentSearch}
              onChange={handleAgentSearchChange}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative">
          {isAgentPageChanging && <TableLoader />}
          <div className="h-[400px] overflow-y-auto custom-scrollbar">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">
                <tr className="text-sm text-gray-700">
                  <th className="px-6 py-4 text-left font-semibold">
                    Agent Name
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">
                    Contact Info
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">
                    Joined Date
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>
                  <th className="px-6 py-4 text-left font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {agentsList.length > 0 ? (
                  agentsList.map((agent) => (
                    <tr
                      key={agent._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                            {agent.name?.charAt(0)}
                          </div>
                          <p className="font-semibold text-gray-800">
                            {agent.name}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">{agent.email}</p>
                        <p className="text-xs text-gray-500">{agent.phone}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {new Date(agent.createdAt).toLocaleDateString(
                            "en-GB",
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {(() => {
                          const isActive = agent.status
                            ? agent.status.toLowerCase() === "active"
                            : agent.isActive !== undefined
                            ? agent.isActive
                            : true;
                          return (
                            <span
                              className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${
                                isActive
                                  ? "bg-green-100 text-green-700 border border-green-200"
                                  : "bg-red-100 text-red-700 border border-red-200"
                              }`}
                            >
                              {isActive ? "Active" : "Blocked"}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/agent/view/${agent._id}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="View Agent"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => openAgentDeleteModal(agent)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Agent"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Search className="w-12 h-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-400">
                          No agents found
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
              Total {agentPagination.total} Agents
            </p>
            <TablePagination
              current={agentPagination.currentPage}
              total={agentPagination.totalPages}
              onPageChange={handleAgentPageChange}
              isLoading={isAgentPageChanging}
            />
          </div>
        </div>
      </div>

      {/* ══════════════════ ADD LEAD MODAL ══════════════════ */}
      {showAddLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-orange-500 to-red-600">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus size={20} /> Add Lead
              </h2>
              <button
                onClick={closeAddLeadModal}
                className="text-white/80 hover:text-white hover:bg-white/20 p-1.5 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* ── SUCCESS / RESULT VIEW ── */}
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

                  {/* Stat pills */}
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

                  {/* Failed rows */}
                  {bulkUploadResult.results?.errors?.length > 0 && (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-3 max-h-32 overflow-y-auto space-y-1">
                      <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider mb-1">
                        Failed Rows
                      </p>
                      {bulkUploadResult.results.errors.map((err, i) => (
                        <p key={i} className="text-xs text-red-600">
                          Row {err.row}:{" "}
                          {err.reason || err.error || "Unknown error"}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Duplicate rows */}
                  {bulkUploadResult.results?.duplicates?.length > 0 && (
                    <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3 max-h-32 overflow-y-auto space-y-1">
                      <p className="text-[10px] font-bold text-yellow-600 uppercase tracking-wider mb-1">
                        Duplicate Rows
                      </p>
                      {bulkUploadResult.results.duplicates.map((dup, i) => (
                        <p key={i} className="text-xs text-yellow-700">
                          Row {dup.row}:{" "}
                          {dup.clientPhone ||
                            dup.clientName ||
                            "Duplicate entry"}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* ── Category Dropdown ── */}
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

                  {/* ── Excel Upload ── */}
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

                  {/* ── API Error ── */}
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

            {/* Modal Footer — hidden after result */}
            {!bulkUploadResult && (
              <div className="px-6 pb-6 flex gap-3">
                <button
                  onClick={closeAddLeadModal}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-50 transition-colors"
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

      {/* Delete Agent Confirmation Modal */}
      {isAgentDeleteModalOpen && agentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 transform transition-all scale-100">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
              Delete Agent?
            </h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Are you sure you want to delete <span className="font-semibold text-gray-800">{agentToDelete.name}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={closeAgentDeleteModal}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAgent}
                disabled={deleteAgentLoading === agentToDelete._id}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleteAgentLoading === agentToDelete._id ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDetails;
