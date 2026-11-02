import React, { useEffect, useState, useMemo } from "react";
import {
  Users,
  ArrowLeftRight,
  Activity,
  Clock,
  CheckCircle2,
  XCircle,
  Wallet,
  PlayCircle,
  ShieldCheck,
  Calendar,
  Video,
  Sparkles,
  FileText,
  Receipt,
  Trophy,
  Briefcase,
  AlertTriangle,
  PhoneMissed,
  PhoneCall,
  Building2,
  Ban,
  TrendingUp,
  BarChart3,
  LineChart,
  Target,
  Percent,
  Award,
  ArrowUpRight,
  ChevronRight,
  LayoutDashboard,
  UserCheck,
  History,
  CalendarDays,
  CalendarRange,
  RefreshCw,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDashboardStats,
} from "../../../redux/slice/leadManagement/getAllLeadSlice";

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

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    leads = [],
    overallStats,
    dateAnalytics,
    keyDashboardCards,
    salesPerformance,
    statusCounts,
    pagination,
    statsLoading,
    loading: leadsLoading,
  } = useSelector((state) => state.allLeads || {});

  const [refreshing, setRefreshing] = useState(false);

  const loadData = () => {
    setRefreshing(true);
    dispatch(fetchDashboardStats()).finally(() => {
      setRefreshing(false);
    });
  };

  useEffect(() => {
    loadData();
  }, [dispatch]);

  const isLoading = statsLoading || refreshing;

  // Fallback client-side date counts (used if server returns null)
  const fallbackDateCounts = useMemo(() => {
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

    (leads || []).forEach((lead) => {
      const dateVal =
        lead?.createdAt ||
        lead?.date ||
        lead?.created_at ||
        lead?.dateOfTransfer ||
        lead?.transferDate ||
        lead?.createdDate ||
        lead?.joiningDate ||
        lead?.updatedAt;
      const d = parseDate(dateVal);
      if (!d) return;

      if (d >= todayStart && d <= todayEnd) today++;
      if (d >= yesterdayStart && d <= yesterdayEnd) yesterday++;
      if (d >= weekStart && d <= todayEnd) inWeek++;
      if (d >= monthStart && d <= monthEnd) inMonth++;
    });

    return { today, yesterday, inWeek, inMonth };
  }, [leads]);

  // Fallback client-side computed metrics
  const fallbackMetrics = useMemo(() => {
    if (!leads || leads.length === 0) {
      return {
        activeLeads: 0,
        qualifiedLeads: 0,
        followupsToday: 0,
        overdueFollowups: 0,
        meetingsToday: 0,
        proposalsSent: 0,
        quotationsSent: 0,
        wonDeals: 0,
        lostDeals: 0,
        totalRevenue: 0,
        pendingPayments: 0,
        projectsInProgress: 0,
        todaySales: 0,
        weeklySales: 0,
        monthlySales: 0,
        conversionRate: "0%",
        leadToCustomerRate: "0%",
      };
    }

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

    let todaySales = 0;
    let weeklySales = 0;
    let monthlySales = 0;

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const dayOfWeek = now.getDay();
    const distanceToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - distanceToMonday, 0, 0, 0, 0);

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    leads.forEach((lead) => {
      const status = lead?.status ? lead.status.charAt(0).toUpperCase() + lead.status.slice(1) : "N/A";
      const price = parseFloat(lead?.price) || parseFloat(lead?.amount) || 0;

      const dateVal =
        lead?.createdAt ||
        lead?.date ||
        lead?.created_at ||
        lead?.dateOfTransfer ||
        lead?.transferDate ||
        lead?.createdDate ||
        lead?.joiningDate ||
        lead?.updatedAt;
      const d = parseDate(dateVal);

      if (["New", "Submitted", "Pending"].includes(status)) {
        activeLeads++;
        pendingPayments += price;
      }
      if (status === "Approved") qualifiedLeads++;
      if (["Submitted", "Pending", "Approved", "Paid", "Ongoing", "Completed"].includes(status)) quotationsSent++;
      if (["Approved", "Paid", "Ongoing", "Completed"].includes(status)) proposalsSent++;

      if (["Approved", "Paid", "Completed"].includes(status)) {
        wonDeals++;
        totalRevenue += price;
        if (d) {
          if (d >= todayStart && d <= todayEnd) todaySales += price;
          if (d >= weekStart && d <= todayEnd) weeklySales += price;
          if (d >= monthStart && d <= monthEnd) monthlySales += price;
        }
      }

      if (status === "Rejected") lostDeals++;
      if (["Ongoing", "Approved"].includes(status)) projectsInProgress++;

      if (d && d >= todayStart && d <= todayEnd) {
        meetingsToday++;
        if (["New", "Submitted", "Pending"].includes(status)) followupsToday++;
      } else if (d && d < todayStart && ["New", "Submitted", "Pending"].includes(status)) {
        overdueFollowups++;
      }
    });

    const total = leads.length;
    const conversionRateVal = total > 0 ? ((wonDeals / total) * 100).toFixed(1) : "0";
    const leadToCustomerVal = qualifiedLeads > 0 ? ((wonDeals / qualifiedLeads) * 100).toFixed(1) : "0";

    return {
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
      todaySales,
      weeklySales,
      monthlySales,
      conversionRate: `${conversionRateVal}%`,
      leadToCustomerRate: `${leadToCustomerVal}%`,
    };
  }, [leads]);

  const formatCurrency = (val) => {
    if (!val || val === 0) return "₹0";
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} Lakhs`;
    }
    return `₹${val.toLocaleString()}`;
  };

  // Helper to extract date analytics item whether array or object
  const getDateItem = (key) => {
    if (Array.isArray(dateAnalytics)) {
      return dateAnalytics.find((item) => item.key === key);
    }
    return dateAnalytics?.[key];
  };

  // 26 Key Dashboard Cards configuration matching exact UI & API mapping
  const KEY_CARDS_CONFIG = [
    {
      key: "totalLeads",
      label: "TOTAL LEADS",
      defaultTag: "Real-time",
      tagClass: "bg-emerald-50 text-emerald-600 border border-emerald-100",
      icon: Users,
      iconBg: "bg-blue-600",
      statusParam: null,
    },
    {
      key: "transferredLeads",
      label: "TRANSFERRED LEADS",
      defaultTag: "Transferred",
      tagClass: "bg-purple-50 text-purple-600 border border-purple-100",
      icon: ArrowLeftRight,
      iconBg: "bg-purple-600",
      statusParam: null,
      leadType: "transferred",
    },
    {
      key: "activeLeads",
      label: "ACTIVE LEADS",
      defaultTag: "Active",
      tagClass: "bg-blue-50 text-blue-600 border border-blue-100",
      icon: Activity,
      iconBg: "bg-sky-500",
      statusParam: null,
    },
    {
      key: "pending",
      label: "PENDING",
      defaultTag: "Pending",
      tagClass: "bg-amber-50 text-amber-600 border border-amber-100",
      icon: Clock,
      iconBg: "bg-amber-500",
      statusParam: "Pending",
    },
    {
      key: "approved",
      label: "APPROVED",
      defaultTag: "Approved",
      tagClass: "bg-emerald-50 text-emerald-600 border border-emerald-100",
      icon: CheckCircle2,
      iconBg: "bg-emerald-600",
      statusParam: "Approved",
    },
    {
      key: "rejected",
      label: "REJECTED",
      defaultTag: "Rejected",
      tagClass: "bg-rose-50 text-rose-600 border border-rose-100",
      icon: XCircle,
      iconBg: "bg-red-500",
      statusParam: "Rejected",
    },
    {
      key: "paid",
      label: "PAID",
      defaultTag: "Paid",
      tagClass: "bg-emerald-50 text-emerald-600 border border-emerald-100",
      icon: Wallet,
      iconBg: "bg-emerald-500",
      statusParam: "Paid",
    },
    {
      key: "ongoing",
      label: "ONGOING",
      defaultTag: "Ongoing",
      tagClass: "bg-blue-50 text-blue-600 border border-blue-100",
      icon: PlayCircle,
      iconBg: "bg-blue-600",
      statusParam: "Ongoing",
    },
    {
      key: "completed",
      label: "COMPLETED",
      defaultTag: "Completed",
      tagClass: "bg-teal-50 text-teal-600 border border-teal-100",
      icon: ShieldCheck,
      iconBg: "bg-teal-600",
      statusParam: "Completed",
    },
    {
      key: "meetingScheduled",
      label: "MEETING SCHEDULED",
      defaultTag: "Scheduled",
      tagClass: "bg-indigo-50 text-indigo-600 border border-indigo-100",
      icon: Calendar,
      iconBg: "bg-indigo-600",
      statusParam: "Meeting Scheduled",
    },
    {
      key: "meetingDone",
      label: "MEETING DONE",
      defaultTag: "Done",
      tagClass: "bg-purple-50 text-purple-600 border border-purple-100",
      icon: Video,
      iconBg: "bg-purple-600",
      statusParam: "Meeting Done",
    },
    {
      key: "qualified",
      label: "QUALIFIED",
      defaultTag: "Qualified",
      tagClass: "bg-teal-50 text-teal-600 border border-teal-100",
      icon: Sparkles,
      iconBg: "bg-teal-500",
      statusParam: "Qualified",
    },
    {
      key: "proposalSent",
      label: "PROPOSAL SENT",
      defaultTag: "Sent",
      tagClass: "bg-purple-50 text-purple-600 border border-purple-100",
      icon: FileText,
      iconBg: "bg-purple-500",
      statusParam: "Proposal Sent",
    },
    {
      key: "quotationSent",
      label: "QUOTATION SENT",
      defaultTag: "Sent",
      tagClass: "bg-cyan-50 text-cyan-600 border border-cyan-100",
      icon: Receipt,
      iconBg: "bg-cyan-500",
      statusParam: "Quotation Sent",
    },
    {
      key: "won",
      label: "WON",
      defaultTag: "Won",
      tagClass: "bg-emerald-50 text-emerald-600 border border-emerald-100",
      icon: Trophy,
      iconBg: "bg-emerald-600",
      statusParam: "Won",
    },
    {
      key: "lost",
      label: "LOST",
      defaultTag: "Lost",
      tagClass: "bg-rose-50 text-rose-600 border border-rose-100",
      icon: XCircle,
      iconBg: "bg-rose-500",
      statusParam: "Lost",
    },
    {
      key: "appliedForJob",
      label: "APPLIED FOR JOB",
      defaultTag: "Job Lead",
      tagClass: "bg-slate-100 text-slate-700 border border-slate-200",
      icon: Briefcase,
      iconBg: "bg-slate-600",
      statusParam: "Applied for Job",
    },
    {
      key: "busy",
      label: "BUSY",
      defaultTag: "Busy",
      tagClass: "bg-amber-50 text-amber-600 border border-amber-100",
      icon: Clock,
      iconBg: "bg-amber-500",
      statusParam: "Busy",
    },
    {
      key: "invalidMobileNumber",
      label: "INVALID MOBILE NUMBER",
      defaultTag: "Invalid",
      tagClass: "bg-rose-50 text-rose-600 border border-rose-100",
      icon: AlertTriangle,
      iconBg: "bg-red-600",
      statusParam: "Invalid Mobile Number",
    },
    {
      key: "callNotReceived",
      label: "CALL NOT RECEIVED",
      defaultTag: "No Answer",
      tagClass: "bg-orange-50 text-orange-600 border border-orange-100",
      icon: PhoneMissed,
      iconBg: "bg-orange-600",
      statusParam: "Call Not Received",
    },
    {
      key: "spokeOnACall",
      label: "SPOKE ON A CALL",
      defaultTag: "Connected",
      tagClass: "bg-sky-50 text-sky-600 border border-sky-100",
      icon: PhoneCall,
      iconBg: "bg-sky-600",
      statusParam: "Spoke On a Call",
    },
    {
      key: "followUpLater",
      label: "FOLLOW UP LATER",
      defaultTag: "Follow Up",
      tagClass: "bg-amber-50 text-amber-600 border border-amber-100",
      icon: Clock,
      iconBg: "bg-amber-500",
      statusParam: "Follow Up Later",
    },
    {
      key: "bpo",
      label: "BPO",
      defaultTag: "BPO",
      tagClass: "bg-slate-100 text-slate-700 border border-slate-200",
      icon: Building2,
      iconBg: "bg-slate-700",
      statusParam: "BPO",
    },
    {
      key: "noRequirement",
      label: "NO REQUIREMENT",
      defaultTag: "No Req",
      tagClass: "bg-slate-100 text-slate-500 border border-slate-200",
      icon: Ban,
      iconBg: "bg-slate-400",
      statusParam: "No Requirement",
    },
    {
      key: "requirementFulfilled",
      label: "REQUIREMENT FULFILLED",
      defaultTag: "Fulfilled",
      tagClass: "bg-emerald-50 text-emerald-600 border border-emerald-100",
      icon: CheckCircle2,
      iconBg: "bg-teal-600",
      statusParam: "Requirement Fulfilled",
    },
    {
      key: "followUpToday",
      label: "FOLLOW UP TODAY",
      defaultTag: "Today",
      tagClass: "bg-amber-50 text-amber-600 border border-amber-100",
      icon: Calendar,
      iconBg: "bg-amber-500",
      statusParam: "Follow Up Today",
    },
  ];

  const handleCardClick = (card) => {
    let url = `/leadmanagement?cardKey=${card.key}`;
    if (card.statusParam) {
      url += `&status=${encodeURIComponent(card.statusParam)}`;
    }
    if (card.leadType) {
      url += `&leadType=${encodeURIComponent(card.leadType)}`;
    }
    navigate(url);
  };

  // Sales Target calculation
  const targetAchievedAmount =
    salesPerformance?.salesTargetVsAchievement?.achieved ??
    salesPerformance?.monthlySales?.total ??
    fallbackMetrics.monthlySales;

  const targetAmount =
    salesPerformance?.salesTargetVsAchievement?.target ?? 3200000;

  const targetPercent =
    salesPerformance?.salesTargetVsAchievement?.percentage ||
    `${Math.min(100, Math.round((targetAchievedAmount / targetAmount) * 100))}%`;

  const targetRemaining =
    salesPerformance?.salesTargetVsAchievement?.remainingFormatted ||
    (targetAchievedAmount >= targetAmount
      ? "Target Achieved!"
      : `${formatCurrency(targetAmount - targetAchievedAmount)} Remaining`);

  return (
    <div className="p-6 min-h-screen no-scrollbar bg-gray-50/50">
      {/* Super Admin Header */}
      <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 rounded-2xl p-6 shadow-xl mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-orange-200" />
              Super Admin Dashboard
            </h1>
            <p className="text-orange-100 text-sm mt-1 font-medium">
              Real-Time Control Center • Lead Management & Sales Analytics
            </p>
            <div className="text-xs text-orange-100 flex items-center gap-2 mt-3">
              <NavLink
                to="/dashboard"
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                <span className="bg-white/20 px-3 py-1 rounded-lg">Home</span>
              </NavLink>
              <span className="text-white/60">›</span>
              <span className="text-white font-semibold">Super Admin Overview</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white/20 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/20 text-center">
              <p className="text-white text-[10px] uppercase tracking-wider font-semibold opacity-80">
                Total Leads
              </p>
              <p className="text-white text-lg font-bold">
                {(
                  overallStats?.totalLeads ??
                  pagination?.totalLeads ??
                  keyDashboardCards?.totalLeads?.total ??
                  leads.length
                ).toLocaleString()}
              </p>
            </div>

            {overallStats?.selfLeads != null && (
              <div className="bg-white/20 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/20 text-center">
                <p className="text-white text-[10px] uppercase tracking-wider font-semibold opacity-80">
                  Self Leads
                </p>
                <p className="text-white text-lg font-bold">
                  {overallStats.selfLeads.toLocaleString()}
                </p>
              </div>
            )}

            {overallStats?.transferredLeads != null && (
              <div className="bg-white/20 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/20 text-center">
                <p className="text-white text-[10px] uppercase tracking-wider font-semibold opacity-80">
                  Transferred
                </p>
                <p className="text-white text-lg font-bold">
                  {overallStats.transferredLeads.toLocaleString()}
                </p>
              </div>
            )}

            <button
              onClick={loadData}
              disabled={isLoading}
              className="bg-white/20 hover:bg-white/30 text-white p-2.5 rounded-xl border border-white/20 transition-all flex items-center justify-center cursor-pointer"
              title="Refresh stats"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* DATE FILTER QUICK ANALYTICS CARDS (TODAY, YESTERDAY, IN WEEK, IN MONTH) */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-orange-500" />
            Date Analytics Overview
          </h2>
          <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-200">
            Click Card to Filter Leads
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Today Card */}
          <div
            onClick={() => navigate("/leadmanagement?cardKey=todaysLeads&dateFilter=today")}
            className="bg-gradient-to-r from-orange-50 to-orange-100/80 rounded-xl p-4 border border-orange-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-orange-600 uppercase tracking-wider">
                  {getDateItem("todaysLeads")?.label || "Today"}
                </p>
                <p className="text-2xl font-extrabold text-gray-800 mt-1">
                  {isLoading ? (
                    <span className="inline-block w-8 h-7 bg-orange-200/80 animate-pulse rounded-md mt-1"></span>
                  ) : (
                    (getDateItem("todaysLeads")?.count ?? getDateItem("todaysLeads")?.total ?? overallStats?.todaysLeads ?? fallbackDateCounts.today).toLocaleString()
                  )}
                </p>
                <p className="text-[11px] font-medium text-orange-600/80 mt-0.5">
                  {getDateItem("todaysLeads")?.subtitle || "Today's Leads"}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Yesterday Card */}
          <div
            onClick={() => navigate("/leadmanagement?cardKey=yesterdayLeads&dateFilter=yesterday")}
            className="bg-gradient-to-r from-blue-50 to-blue-100/80 rounded-xl p-4 border border-blue-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                  {getDateItem("yesterdayLeads")?.label || "Yesterday"}
                </p>
                <p className="text-2xl font-extrabold text-gray-800 mt-1">
                  {isLoading ? (
                    <span className="inline-block w-8 h-7 bg-blue-200/80 animate-pulse rounded-md mt-1"></span>
                  ) : (
                    (getDateItem("yesterdayLeads")?.count ?? getDateItem("yesterdayLeads")?.total ?? overallStats?.yesterdayLeads ?? fallbackDateCounts.yesterday).toLocaleString()
                  )}
                </p>
                <p className="text-[11px] font-medium text-blue-600/80 mt-0.5">
                  {getDateItem("yesterdayLeads")?.subtitle || "Previous Day Leads"}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <History className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* In Week Card */}
          <div
            onClick={() => navigate("/leadmanagement?cardKey=inWeekLeads&dateFilter=in%20week")}
            className="bg-gradient-to-r from-purple-50 to-purple-100/80 rounded-xl p-4 border border-purple-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider">
                  {getDateItem("inWeekLeads")?.label || "In Week"}
                </p>
                <p className="text-2xl font-extrabold text-gray-800 mt-1">
                  {isLoading ? (
                    <span className="inline-block w-8 h-7 bg-purple-200/80 animate-pulse rounded-md mt-1"></span>
                  ) : (
                    (getDateItem("inWeekLeads")?.count ?? getDateItem("inWeekLeads")?.total ?? overallStats?.inWeekLeads ?? fallbackDateCounts.inWeek).toLocaleString()
                  )}
                </p>
                <p className="text-[11px] font-medium text-purple-600/80 mt-0.5">
                  {getDateItem("inWeekLeads")?.subtitle || "Current Week Leads"}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <CalendarDays className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* In Month Card */}
          <div
            onClick={() => navigate("/leadmanagement?cardKey=inMonthLeads&dateFilter=in%20month")}
            className="bg-gradient-to-r from-emerald-50 to-emerald-100/80 rounded-xl p-4 border border-emerald-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                  {getDateItem("inMonthLeads")?.label || "In Month"}
                </p>
                <p className="text-2xl font-extrabold text-gray-800 mt-1">
                  {isLoading ? (
                    <span className="inline-block w-8 h-7 bg-emerald-200/80 animate-pulse rounded-md mt-1"></span>
                  ) : (
                    (getDateItem("inMonthLeads")?.count ?? getDateItem("inMonthLeads")?.total ?? overallStats?.inMonthLeads ?? fallbackDateCounts.inMonth).toLocaleString()
                  )}
                </p>
                <p className="text-[11px] font-medium text-emerald-600/80 mt-0.5">
                  {getDateItem("inMonthLeads")?.subtitle || "Current Month Leads"}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <CalendarRange className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: ALL 26 KEY DASHBOARD CARDS */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-orange-500" />
            Key Dashboard Cards
          </h2>
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
            26 Metrics Tracked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {KEY_CARDS_CONFIG.map((card) => {
            const Icon = card.icon;

            // Resolve API card if available in keyDashboardCards array or object
            let apiCard = null;
            if (Array.isArray(keyDashboardCards)) {
              apiCard = keyDashboardCards.find((c) => c.key === card.key);
            } else if (keyDashboardCards && typeof keyDashboardCards === "object") {
              apiCard = keyDashboardCards[card.key];
            }

            let count = apiCard?.count ?? apiCard?.total;

            if (count === undefined || count === null) {
              if (card.key === "totalLeads") {
                count =
                  overallStats?.totalLeads ??
                  pagination?.totalLeads ??
                  leads.length ??
                  0;
              } else if (
                overallStats?.[card.key] !== undefined &&
                overallStats?.[card.key] !== null
              ) {
                count = overallStats[card.key];
              } else if (
                card.statusParam &&
                statusCounts?.[card.statusParam] !== undefined &&
                statusCounts?.[card.statusParam] !== null
              ) {
                count = statusCounts[card.statusParam];
              } else {
                count = 0;
              }
            }

            const tag = apiCard?.tag || apiCard?.badge || card.defaultTag;
            const label = apiCard?.label || card.label;

            return (
              <div
                key={card.key}
                onClick={() => handleCardClick(card)}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group flex flex-col justify-between min-h-[160px]"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider line-clamp-1">
                    {label}
                  </p>
                  <div
                    className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center text-white shadow-xs shrink-0 group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>

                <div className="my-2">
                  <p className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    {isLoading ? (
                      <span className="inline-block w-16 h-8 bg-gray-200/80 animate-pulse rounded-md" />
                    ) : (
                      Number(count).toLocaleString()
                    )}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                  <span
                    className={`text-[11px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full ${card.tagClass}`}
                  >
                    {tag}
                  </span>
                  <span className="text-xs text-gray-400 group-hover:text-gray-600 font-medium flex items-center gap-0.5 transition-colors">
                    View Details
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: SALES PERFORMANCE */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-500" />
            Sales Performance
          </h2>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            Real-Time Revenue Insights
          </span>
        </div>

        {/* 3 Top Revenue Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div
            onClick={() => navigate("/leadmanagement?cardKey=todays_sales")}
            className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden cursor-pointer hover:shadow-xl transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-100 bg-white/20 px-3 py-1 rounded-full">
                {salesPerformance?.todaysSales?.label || "Today's Sales"}
              </span>
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-3xl font-black mb-1">
              {salesPerformance?.todaysSales?.formatted ||
                formatCurrency(
                  salesPerformance?.todaysSales?.total ?? fallbackMetrics.todaySales
                )}
            </p>
            <p className="text-xs text-orange-100 flex items-center gap-1 font-medium">
              <ArrowUpRight className="w-4 h-4 text-emerald-300" />
              {salesPerformance?.todaysSales?.subtitle || "Live Revenue Today"}
            </p>
          </div>

          <div
            onClick={() => navigate("/leadmanagement?cardKey=weekly_sales")}
            className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden cursor-pointer hover:shadow-xl transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-100 bg-white/20 px-3 py-1 rounded-full">
                {salesPerformance?.weeklySales?.label || "Weekly Sales"}
              </span>
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-3xl font-black mb-1">
              {salesPerformance?.weeklySales?.formatted ||
                formatCurrency(
                  salesPerformance?.weeklySales?.total ?? fallbackMetrics.weeklySales
                )}
            </p>
            <p className="text-xs text-blue-100 flex items-center gap-1 font-medium">
              <ArrowUpRight className="w-4 h-4 text-emerald-300" />
              {salesPerformance?.weeklySales?.subtitle || "Current Week Revenue"}
            </p>
          </div>

          <div
            onClick={() => navigate("/leadmanagement?cardKey=monthly_sales")}
            className="bg-gradient-to-br from-purple-600 to-violet-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden cursor-pointer hover:shadow-xl transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-100 bg-white/20 px-3 py-1 rounded-full">
                {salesPerformance?.monthlySales?.label || "Monthly Sales"}
              </span>
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                <LineChart className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-3xl font-black mb-1">
              {salesPerformance?.monthlySales?.formatted ||
                formatCurrency(
                  salesPerformance?.monthlySales?.total ?? fallbackMetrics.monthlySales
                )}
            </p>
            <p className="text-xs text-purple-100 flex items-center gap-1 font-medium">
              <ArrowUpRight className="w-4 h-4 text-emerald-300" />
              {salesPerformance?.monthlySales?.subtitle || "Current Month Revenue"}
            </p>
          </div>
        </div>

        {/* 4 Analytics & KPI Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Sales Target vs Achievement */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-orange-50 text-orange-600">
                    <Target className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm">
                    Sales Target vs Achievement
                  </h3>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-xs font-semibold text-gray-500">
                    Achieved: {salesPerformance?.salesTargetVsAchievement?.achievedFormatted || formatCurrency(targetAchievedAmount)}
                  </span>
                  <span className="text-xs font-bold text-orange-600">
                    {targetPercent}
                  </span>
                </div>
                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, parseInt(targetPercent) || 0)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs">
              <span className="text-gray-500 font-medium">
                Target: {salesPerformance?.salesTargetVsAchievement?.targetFormatted || "₹32.0 Lakhs"}
              </span>
              <span className="font-bold text-gray-700">
                {targetRemaining}
              </span>
            </div>
          </div>

          {/* Conversion Rate */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                    <Percent className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm">
                    Conversion Rate
                  </h3>
                </div>
                <span className="text-xs font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">
                  Real-time
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-2">
                <p className="text-3xl font-black text-gray-800">
                  {salesPerformance?.conversionRate?.overallRate || fallbackMetrics.conversionRate}
                </p>
                <span className="text-xs text-gray-500 font-medium">overall rate</span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 text-xs text-gray-500 flex items-center justify-between font-medium">
              <span>
                Industry Benchmark: {salesPerformance?.conversionRate?.industryBenchmark || "55%"}
              </span>
              <span className="text-emerald-600 font-bold">
                {salesPerformance?.conversionRate?.status ||
                  (parseFloat(fallbackMetrics.conversionRate) >= 55 ? "Above Target" : "On Track")}
              </span>
            </div>
          </div>

          {/* Sales Deals Won */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                    <Award className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm">
                    Sales Deals Won
                  </h3>
                </div>
              </div>

              <div className="bg-purple-50/50 rounded-xl p-3 mb-2 border border-purple-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-purple-600 text-white font-bold text-sm flex items-center justify-center">
                  {salesPerformance?.salesDealsWon?.wonDeals ?? fallbackMetrics.wonDeals}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">Closed / Approved Deals</p>
                  <p className="text-[11px] text-purple-700 font-semibold">
                    {salesPerformance?.salesDealsWon?.wonDeals ?? fallbackMetrics.wonDeals} Won Deals •{" "}
                    {salesPerformance?.salesDealsWon?.wonRevenueFormatted ||
                      formatCurrency(
                        salesPerformance?.salesDealsWon?.wonRevenue ?? fallbackMetrics.totalRevenue
                      )}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 text-xs text-gray-500 flex items-center justify-between font-medium">
              <span>
                Total Qualified: {salesPerformance?.salesDealsWon?.totalQualified ?? fallbackMetrics.qualifiedLeads}
              </span>
              <span className="text-purple-600 font-bold">
                Active: {salesPerformance?.salesDealsWon?.active ?? fallbackMetrics.activeLeads}
              </span>
            </div>
          </div>

          {/* Lead-to-Customer Conversion */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm">
                    Lead-to-Customer Conversion
                  </h3>
                </div>
              </div>

              <div className="flex items-baseline gap-2 mb-2">
                <p className="text-3xl font-black text-gray-800">
                  {salesPerformance?.leadToCustomerConversion?.liveRate || fallbackMetrics.leadToCustomerRate}
                </p>
                <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full">
                  Live Rate
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 text-xs text-gray-500 flex items-center justify-between font-medium">
              <span>
                Total Qualified: {salesPerformance?.leadToCustomerConversion?.totalQualified ?? fallbackMetrics.qualifiedLeads}
              </span>
              <span className="text-blue-600 font-bold">
                Won Deals: {salesPerformance?.leadToCustomerConversion?.wonDeals ?? fallbackMetrics.wonDeals}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}