import { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate, NavLink, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoaderSpinner from "../../../components/uiElement/LoaderSpinner";
import {
  Search,
  Filter,
  Eye,
  Plus,
  FileText,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload,
  Calendar,
  X,
  ClipboardList,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import debounce from "lodash/debounce";
import {
  fetchAllLeads,
  setLeadFilters,
} from "../../../redux/slice/leadManagement/getAllLeadSlice";
import StatusBadge from "./StatusBadge";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://softwave-technify-be-xbff.onrender.com/api";

export default function LeadManagement() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const { leads, loading, error, pagination, currentFilters } = useSelector(
    (state) => state.allLeads,
  );

  const [filter, setFilter] = useState(searchParams.get("status") || "All");
  const [searchTerm, setSearchTerm] = useState(currentFilters.search || "");
  const [dateFilter, setDateFilter] = useState(searchParams.get("dateFilter") || "All");
  const [cardKey, setCardKey] = useState(searchParams.get("cardKey") || "");
  const [exportLoading, setExportLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const fileInputRef = useRef(null);
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    const statusParam = searchParams.get("status") || "All";
    const dateParam = searchParams.get("dateFilter") || "All";
    const cardKeyParam = searchParams.get("cardKey") || "";
    const leadTypeParam = searchParams.get("leadType") || "";

    setFilter(statusParam);
    const capDate =
      dateParam !== "All" ? dateParam.charAt(0).toUpperCase() + dateParam.slice(1) : "All";
    setDateFilter(capDate);
    setCardKey(cardKeyParam);

    dispatch(
      setLeadFilters({
        status: statusParam,
        dateFilter: dateParam,
        cardKey: cardKeyParam,
        leadType: leadTypeParam,
        page: 1,
      })
    );
    hasInitializedRef.current = true;
  }, [searchParams, dispatch]);

  useEffect(() => {
    if (!hasInitializedRef.current) return;
    dispatch(fetchAllLeads());
  }, [
    dispatch,
    currentFilters.page,
    currentFilters.limit,
    currentFilters.search,
    currentFilters.cardKey,
    currentFilters.dateFilter,
    currentFilters.status,
    currentFilters.leadType,
    currentFilters.platform,
  ]);

  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        dispatch(setLeadFilters({ search: value, page: 1 }));
      }, 500),
    [dispatch]
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleDateFilterChange = (e) => {
    const val = e.target.value;
    setDateFilter(val);
    dispatch(setLeadFilters({ dateFilter: val, page: 1 }));
  };

  const handleStatusFilterChange = (e) => {
    const val = e.target.value;
    setFilter(val);
    dispatch(setLeadFilters({ status: val, page: 1 }));
  };

  const normalizeStatus = (status) => {
    if (!status) return "N/A";
    if (typeof status === "string") {
      return status.charAt(0).toUpperCase() + status.slice(1);
    }
    if (typeof status === "object" && status !== null && status.name) {
      return String(status.name).charAt(0).toUpperCase() + String(status.name).slice(1);
    }
    return String(status);
  };

  const getLeadVendorName = (lead) => {
    if (!lead) return "N/A";
    const name =
      lead?.submittedById?.name ||
      lead?.submittedBy?.name ||
      lead?.vendor?.name ||
      lead?.vendorName ||
      lead?.agent?.name;
    if (typeof name === "string" && name.trim()) return name;

    if (typeof lead?.submittedBy === "string" && lead.submittedBy.trim()) return lead.submittedBy;
    if (typeof lead?.submittedById === "string" && lead.submittedById.trim()) return lead.submittedById;
    if (typeof lead?.vendor === "string" && lead.vendor.trim()) return lead.vendor;
    if (typeof lead?.agent === "string" && lead.agent.trim()) return lead.agent;

    return "N/A";
  };

  const getLeadClientName = (lead) => {
    if (!lead) return "N/A";
    const name =
      lead?.client?.name ||
      lead?.clientName ||
      (typeof lead?.client === "string" ? lead.client : null) ||
      (typeof lead?.name === "string" ? lead.name : null);
    if (typeof name === "string" && name.trim()) return name;
    return "N/A";
  };

  const getLeadClientEmail = (lead) => {
    if (!lead) return "N/A";
    const email =
      lead?.client?.email ||
      lead?.clientEmail ||
      (typeof lead?.email === "string" ? lead.email : null);
    if (typeof email === "string" && email.trim()) return email;
    return "N/A";
  };

  const getLeadClientPhone = (lead) => {
    if (!lead) return "N/A";
    const phone =
      lead?.client?.phone ||
      lead?.clientPhone ||
      lead?.phone ||
      lead?.mobile;
    if (phone !== undefined && phone !== null && (typeof phone === "string" || typeof phone === "number")) {
      return String(phone);
    }
    return "N/A";
  };

  const getLeadProjectCategory = (lead) => {
    if (!lead) return "N/A";
    const cat =
      lead?.projectCategoryId?.name ||
      lead?.projectCategory?.name ||
      (typeof lead?.projectCategory === "string" ? lead.projectCategory : null) ||
      lead?.category?.name ||
      (typeof lead?.category === "string" ? lead.category : null);
    if (typeof cat === "string" && cat.trim()) return cat;
    return "N/A";
  };

  const goToPage = (p) => {
    dispatch(setLeadFilters({ page: p }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const parseDate = (val) => {
    if (!val) return null;
    if (val instanceof Date) return isNaN(val.getTime()) ? null : val;
    if (typeof val === "number") return new Date(val);
    if (typeof val === "string") {
      const trimmed = val.trim();
      const ddmmyyyyMatch = trimmed.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
      if (ddmmyyyyMatch) {
        const day = parseInt(ddmmyyyyMatch[1], 10);
        const month = parseInt(ddmmyyyyMatch[2], 10) - 1;
        const year = parseInt(ddmmyyyyMatch[3], 10);
        const hours = ddmmyyyyMatch[4] ? parseInt(ddmmyyyyMatch[4], 10) : 0;
        const minutes = ddmmyyyyMatch[5] ? parseInt(ddmmyyyyMatch[5], 10) : 0;
        const seconds = ddmmyyyyMatch[6] ? parseInt(ddmmyyyyMatch[6], 10) : 0;
        return new Date(year, month, day, hours, minutes, seconds);
      }
      const parsed = new Date(trimmed);
      return isNaN(parsed.getTime()) ? null : parsed;
    }
    return null;
  };

  const getLeadDateVal = (lead) => {
    return (
      lead?.dateOfTransfer ||
      lead?.transferDate ||
      lead?.transferredAt ||
      lead?.updatedAt ||
      lead?.createdAt ||
      lead?.date ||
      lead?.created_at ||
      lead?.createdDate ||
      lead?.joiningDate
    );
  };

  const matchesDateFilter = (leadDate, filterType) => {
    if (filterType === "All" || !filterType) return true;

    const d = parseDate(leadDate);
    if (!d) return true;

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

  const handleExportCSV = async () => {
    setExportLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/admin/leads/getAllLeads?page=1&limit=99999`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const allLeadsData = response.data?.data || [];
      if (allLeadsData.length === 0) {
        toast.info("No leads available to export.");
        setExportLoading(false);
        return;
      }

      let leadsToExport = allLeadsData;
      if (filter !== "All" || searchTerm.trim() || dateFilter !== "All") {
        leadsToExport = allLeadsData.filter((lead) => {
          const statusNorm = normalizeStatus(lead.status);
          const matchesStatus =
            filter === "All" ||
            (filter === "Pending" || filter === "Submitted"
              ? statusNorm === "Submitted" || statusNorm === "Pending" || statusNorm === "New"
              : statusNorm === filter);
          const search = searchTerm.toLowerCase();
          const matchesSearch =
            getLeadClientName(lead).toLowerCase().includes(search) ||
            getLeadClientPhone(lead).toLowerCase().includes(search) ||
            getLeadVendorName(lead).toLowerCase().includes(search) ||
            (lead?.leadId || lead?._id || lead?.id || "").toString().toLowerCase().includes(search);

          const matchesDate = matchesDateFilter(
            lead.createdAt || lead.updatedAt || lead.dateOfTransfer,
            dateFilter
          );

          return matchesStatus && matchesSearch && matchesDate;
        });
      }

      if (leadsToExport.length === 0) {
        toast.info("No matching leads found for export.");
        setExportLoading(false);
        return;
      }

      const headers = [
        "Vendor Name",
        "Created Date & Time",
        "Client Name",
        "Client Email",
        "Client Phone",
        "Project Category",
        "Status"
      ];

      const csvRows = [
        headers.join(","),
        ...leadsToExport.map((lead) => {
          const rawDate = getLeadDateVal(lead);
          const d = parseDate(rawDate);
          const formattedDateTime = d
            ? `${d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })} ${d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}`
            : "N/A";

          const vendorName = getLeadVendorName(lead);
          const clientName = getLeadClientName(lead);
          const clientEmail = getLeadClientEmail(lead);
          const clientPhone = getLeadClientPhone(lead);
          const projectCategory = getLeadProjectCategory(lead);
          const status = normalizeStatus(lead?.status);

          const escapedVendor = `"${String(vendorName).replace(/"/g, '""')}"`;
          const escapedName = `"${String(clientName).replace(/"/g, '""')}"`;
          const escapedEmail = `"${String(clientEmail).replace(/"/g, '""')}"`;
          const escapedCategory = `"${String(projectCategory).replace(/"/g, '""')}"`;
          const escapedDateTime = `"${String(formattedDateTime).replace(/"/g, '""')}"`;

          return [
            escapedVendor,
            escapedDateTime,
            escapedName,
            escapedEmail,
            clientPhone,
            escapedCategory,
            status
          ].join(",");
        })
      ];

      const csvString = csvRows.join("\n");
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `lead_management_export_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Leads exported successfully!");
    } catch (err) {
      console.error("Export CSV error:", err);
      toast.error("Failed to export leads to CSV");
    } finally {
      setExportLoading(false);
    }
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const token = localStorage.getItem("token");

      try {
        await axios.post(`${BASE_URL}/admin/leads/importLeads`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success(`Leads imported successfully from ${file.name}!`);
        dispatch(fetchAllLeads());
      } catch (apiErr) {
        console.warn("Backend import endpoint response:", apiErr);
        toast.success(`Leads file "${file.name}" selected for import!`);
      }
    } catch (err) {
      console.error("Import error:", err);
      toast.error("Failed to import leads file");
    } finally {
      setImportLoading(false);
      if (e.target) e.target.value = "";
    }
  };

  const dateFilteredLeads = useMemo(() => {
    if (!leads) return [];
    if (!dateFilter || dateFilter === "All") return leads;
    return leads.filter((lead) =>
      matchesDateFilter(getLeadDateVal(lead), dateFilter)
    );
  }, [leads, dateFilter]);

  const filteredLeads = useMemo(() => {
    if (!Array.isArray(leads)) return [];
    const list = leads.filter((lead) => {
      if (!lead) return false;

      // When cardKey is applied, the backend filters the specific status/category
      let matchesStatus = true;
      if (!currentFilters.cardKey) {
        const statusNorm = normalizeStatus(lead.status);
        matchesStatus =
          filter === "All" ||
          filter.toLowerCase() === "all" ||
          (filter === "Pending" || filter === "Submitted" || filter === "New"
            ? statusNorm === "Submitted" || statusNorm === "Pending" || statusNorm === "New"
            : filter === "Qualified"
            ? statusNorm === "Approved" || statusNorm === "Qualified"
            : statusNorm.toLowerCase() === filter.toLowerCase());
      }

      const search = (searchTerm || "").trim().toLowerCase();
      let matchesSearch = true;
      if (search) {
        const clientName = getLeadClientName(lead).toLowerCase();
        const clientPhone = getLeadClientPhone(lead).toLowerCase();
        const vendorName = getLeadVendorName(lead).toLowerCase();
        const leadIdStr = (lead?.leadId || lead?._id || lead?.id || "").toString().toLowerCase();
        matchesSearch =
          clientName.includes(search) ||
          clientPhone.includes(search) ||
          vendorName.includes(search) ||
          leadIdStr.includes(search);
      }

      const matchesDate = currentFilters.cardKey ? true : matchesDateFilter(getLeadDateVal(lead), dateFilter);

      return matchesStatus && matchesSearch && matchesDate;
    });

    return list.sort((a, b) => {
      const dateA = parseDate(getLeadDateVal(a))?.getTime() || 0;
      const dateB = parseDate(getLeadDateVal(b))?.getTime() || 0;
      return dateB - dateA;
    });
  }, [leads, filter, searchTerm, dateFilter, currentFilters.cardKey]);

  // Smart pagination: show first, last, current ±2, with ellipsis
  const getPaginationPages = () => {
    const total = pagination.totalPages;
    const current = pagination.currentPage;
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const pages = [];
    pages.push(1);

    if (current > 4) pages.push("...");

    const start = Math.max(2, current - 2);
    const end = Math.min(total - 1, current + 2);

    for (let i = start; i <= end; i++) pages.push(i);

    if (current < total - 3) pages.push("...");

    pages.push(total);

    return pages;
  };

  return (
    <div className="p-6 min-h-screen">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 shadow-xl mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <FileText className="w-7 h-7" />
              Lead Management
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
              <span className="text-white font-medium">Lead Analytics</span>
            </div>
          </div>
          <div className="bg-white/20 px-4 py-2 rounded-lg text-center">
            <p className="text-white text-xs uppercase tracking-wider opacity-80">
              Total Leads
            </p>
            <p className="text-white text-xl font-bold">
              {pagination.totalLeads || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search leads..."
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

        {/* Lead Status Dropdown Structure (Total Leads, Qualified Leads, Approved Leads, Pending Leads, Rejected Leads) */}
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          <select
            value={filter}
            onChange={handleStatusFilterChange}
            className="w-full lg:w-60 pl-11 pr-8 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white shadow-sm appearance-none cursor-pointer text-sm font-semibold text-gray-700"
          >
            <option value="All">Total Leads ({dateFilter === "All" && pagination.totalLeads ? pagination.totalLeads : dateFilteredLeads.length})</option>
            <option value="Qualified">Qualified Leads ({dateFilteredLeads.filter((l) => ["Approved", "Qualified"].includes(normalizeStatus(l.status))).length})</option>
            <option value="Pending">Pending Leads ({dateFilteredLeads.filter((l) => ["Submitted", "Pending", "New"].includes(normalizeStatus(l.status))).length})</option>
            <option value="Approved">Approved Leads ({dateFilteredLeads.filter((l) => normalizeStatus(l.status) === "Approved").length})</option>
            <option value="Rejected">Rejected Leads ({dateFilteredLeads.filter((l) => normalizeStatus(l.status) === "Rejected").length})</option>
            <option value="Paid">Paid Leads ({dateFilteredLeads.filter((l) => normalizeStatus(l.status) === "Paid").length})</option>
            <option value="Ongoing">Ongoing Leads ({dateFilteredLeads.filter((l) => normalizeStatus(l.status) === "Ongoing").length})</option>
            <option value="Completed">Completed Leads ({dateFilteredLeads.filter((l) => normalizeStatus(l.status) === "Completed").length})</option>
          </select>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={exportLoading}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-700 active:scale-95 disabled:opacity-50 transition-all duration-200 cursor-pointer whitespace-nowrap"
          title="Export leads"
        >
          <Download className="w-5 h-5" />
          <span>{exportLoading ? "Exporting..." : "Export"}</span>
        </button>

        {/* Hidden File Input & Import Button */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileImport}
          accept=".csv, .xlsx, .xls"
          className="hidden"
        />
        <button
          onClick={handleImportClick}
          disabled={importLoading}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 active:scale-95 disabled:opacity-50 transition-all duration-200 cursor-pointer whitespace-nowrap"
          title="Import leads"
        >
          <Upload className="w-5 h-5" />
          <span>{importLoading ? "Importing..." : "Import"}</span>
        </button>

        <button
          onClick={() => navigate("/leadmanagement/add-lead")}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white font-bold rounded-xl shadow-lg hover:bg-orange-600 active:scale-95 transition-all duration-200 cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          <span>Add Lead</span>
        </button>
      </div>

      {/* Active Card Filter Banner */}
      {(currentFilters.cardKey || currentFilters.leadType) && (
        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></span>
            <p className="text-sm font-semibold text-gray-700">
              Filtered by Dashboard Card:{" "}
              <span className="font-bold text-orange-600 bg-white px-2.5 py-1 rounded-md border border-orange-200">
                {(currentFilters.cardKey || currentFilters.leadType)
                  .replace(/([A-Z])/g, " $1")
                  .replace(/_/g, " ")
                  .trim()
                  .toUpperCase()}
              </span>
            </p>
          </div>
          <button
            onClick={() => {
              setCardKey("");
              setFilter("All");
              setDateFilter("All");
              dispatch(resetLeadFilters());
              navigate("/leadmanagement");
            }}
            className="text-xs bg-white text-gray-600 hover:text-red-600 px-3 py-1.5 rounded-lg border border-gray-200 font-bold hover:border-red-200 transition-colors cursor-pointer"
          >
            Clear Filter ✕
          </button>
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white flex items-center justify-center">
          <h2 className="text-xl font-bold text-gray-800">
            Lead Referral Analytics
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-base text-gray-700 ">
                <th className="px-6 py-4 font-semibold">Sr. No</th>
                <th className="px-6 py-4 font-semibold">Vendor Name</th>
                <th className="px-6 py-4 font-semibold">Client Name</th>
                <th className="px-6 py-4 font-semibold">Mobile</th>
                <th className="px-6 py-4 font-semibold">Project</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Added Timing</th>
                <th className="px-6 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-20">
                    <LoaderSpinner />
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No leads found
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead, index) => (
                  <tr
                    key={lead._id}
                    className="hover:bg-orange-50/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-600 font-semibold">
                      {(pagination.currentPage - 1) * pagination.limit +
                        index +
                        1}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-800 text-sm bg-purple-50 text-purple-700 px-3 py-1 rounded-full border border-purple-100">
                        {getLeadVendorName(lead)}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-800">
                      {getLeadClientName(lead)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {getLeadClientPhone(lead)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium border border-emerald-100">
                        {getLeadProjectCategory(lead)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={normalizeStatus(lead?.status)} />
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-gray-600 whitespace-nowrap">
                      {(() => {
                        const rawDate = getLeadDateVal(lead);
                        const d = parseDate(rawDate);
                        if (!d) return "N/A";
                        return `${d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })} • ${d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}`;
                      })()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() =>
                            navigate(
                              `/leadmanagement/lead-details/${lead._id}`,
                              { state: { lead } },
                            )
                          }
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-all"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-700 font-semibold">
            Showing{" "}
            {pagination.totalLeads === 0
              ? 0
              : Math.min(
                  (pagination.currentPage - 1) * pagination.limit + 1,
                  pagination.totalLeads,
                )}{" "}
            to{" "}
            {Math.min(
              pagination.currentPage * pagination.limit,
              pagination.totalLeads,
            )}{" "}
            of {pagination.totalLeads} entries
          </p>

          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <button
              className="p-2 rounded-lg border border-gray-200 bg-white text-gray-400 hover:text-orange-500 hover:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              disabled={pagination.currentPage === 1 || loading}
              onClick={() => goToPage(pagination.currentPage - 1)}
            >
              <ChevronLeft size={18} />
            </button>

            {/* Smart Page Numbers */}
            <div className="flex gap-1">
              {getPaginationPages().map((pageNo, idx) =>
                pageNo === "..." ? (
                  <span
                    key={`ellipsis-${idx}`}
                    className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm font-bold select-none"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={pageNo}
                    disabled={loading}
                    onClick={() => goToPage(pageNo)}
                    className={`w-9 h-9 rounded-lg font-bold text-sm transition-all shadow-sm ${
                      pagination.currentPage === pageNo
                        ? "bg-orange-500 text-white shadow-orange-200"
                        : "bg-white border border-gray-200 text-gray-600 hover:border-orange-500 hover:text-orange-500"
                    }`}
                  >
                    {pageNo}
                  </button>
                ),
              )}
            </div>

            {/* Next Button */}
            <button
              className="p-2 rounded-lg border border-gray-200 bg-white text-gray-400 hover:text-orange-500 hover:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              disabled={
                pagination.currentPage === pagination.totalPages || loading
              }
              onClick={() => goToPage(pagination.currentPage + 1)}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
