

// for search
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, NavLink, useSearchParams } from "react-router-dom";
import { Edit, Trash, Search, PlusCircle, ChevronLeft, ChevronRight, UserCog, ArrowLeftRight, UserCheck, UserX, Users } from "lucide-react";
import { FiEye } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllAgents, setAgentFilters, updateAgentStatus } from "../../../redux/slice/agentManagement/getAllAgentSlice";
import { fetchAllVendors } from "../../../redux/slice/vendors/getallVendorsSlice";
import debounce from "lodash/debounce";
import LoaderSpinner from "../../../components/uiElement/LoaderSpinner";
import { getSampleAgentsList, sampleAgentsDetails } from "./mockAgentsData";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AgentManagements() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const statusFilter = searchParams.get("status") || "all";

  const { agents, loading, error, pagination, currentFilters, statusUpdating } = useSelector((state) => state.allAgents);

  const [searchTerm, setSearchTerm] = useState(currentFilters.search);

  // Transfer leads state
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedSourceAgent, setSelectedSourceAgent] = useState(null);
  const [targetAgentId, setTargetAgentId] = useState("");
  const [sourceLeads, setSourceLeads] = useState([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [transferring, setTransferring] = useState(false);
  const [agentsDropdownList, setAgentsDropdownList] = useState([]);
  const [loadingDropdown, setLoadingDropdown] = useState(false);
  const [targetAgentSearch, setTargetAgentSearch] = useState("");

  const handleOpenTransferModal = async (agent) => {
    setSelectedSourceAgent(agent);
    setTargetAgentId("");
    setTargetAgentSearch("");
    setSourceLeads([]);
    setLoadingLeads(true);
    setShowTransferModal(true);

    const token = localStorage.getItem("token");

    // Check if source agent is a mock agent
    const isMock = !isNaN(agent._id) || agent._id.length < 5;
    if (isMock) {
      const mockDetails = sampleAgentsDetails[agent._id];
      setSourceLeads(mockDetails?.leads || []);
      setLoadingLeads(false);
      setAgentsDropdownList(mockAgents.filter(a => a._id !== agent._id));
    } else {
      try {
        const response = await axios.get(
          `${BASE_URL}/admin/agent/getAgentById/${agent._id}?page=1&limit=99999&leadPage=1&leadLimit=99999`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSourceLeads(response.data?.data?.leads || []);
      } catch (err) {
        console.error("Error fetching agent leads:", err);
        toast.error("Failed to fetch agent leads");
      } finally {
        setLoadingLeads(false);
      }

      setLoadingDropdown(true);
      try {
        const response = await axios.get(
          `${BASE_URL}/admin/agent/getAllAgents?page=1&limit=99999`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const allAgents = response.data?.data || [];
        setAgentsDropdownList(allAgents.filter(a => a._id !== agent._id));
      } catch (err) {
        console.error("Error fetching agents for dropdown:", err);
      } finally {
        setLoadingDropdown(false);
      }
    }
  };

  const handleConfirmTransfer = async () => {
    if (!targetAgentId) {
      toast.error("Please select a target agent");
      return;
    }
    if (sourceLeads.length === 0) {
      toast.error("This agent has no leads to transfer");
      return;
    }

    setTransferring(true);
    const leadIds = sourceLeads.map(l => l._id);
    const token = localStorage.getItem("token");

    const isMockTransfer =
      ["v1", "v2", "1", "2", "3", "4"].includes(targetAgentId) ||
      leadIds.some(id => typeof id === "string" && id.startsWith("l"));

    if (isMockTransfer) {
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success(`${leadIds.length} lead(s) transferred successfully!`);
      setShowTransferModal(false);
      const transferredLeads = (selectedSourceAgent.leads || [])
        .filter(l => leadIds.includes(l._id))
        .map(l => ({ ...l, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }));
      
      // Update global sampleDetails to keep state consistent across views
      if (sampleAgentsDetails[selectedSourceAgent._id]) {
        sampleAgentsDetails[selectedSourceAgent._id].leads = (sampleAgentsDetails[selectedSourceAgent._id].leads || []).filter(l => !leadIds.includes(l._id));
      }
      if (sampleAgentsDetails[targetAgentId]) {
        sampleAgentsDetails[targetAgentId].leads = [...(sampleAgentsDetails[targetAgentId].leads || []), ...transferredLeads];
      }

      setMockAgents(prev => prev.map(a => {
        if (a._id === selectedSourceAgent._id) {
          const updatedLeads = (a.leads || []).filter(l => !leadIds.includes(l._id));
          return {
            ...a,
            leads: updatedLeads,
            submittedLeads: updatedLeads.filter(x => x.status === "Pending" || x.status?.toLowerCase() === "pending").length,
            approvedLeads: updatedLeads.filter(x => x.status === "Approved" || x.status?.toLowerCase() === "approved").length,
            rejectedLeads: updatedLeads.filter(x => x.status === "Rejected" || x.status?.toLowerCase() === "rejected").length,
            totalLeads: updatedLeads.length
          };
        }
        if (a._id === targetAgentId) {
          const updatedLeads = [...(a.leads || []), ...transferredLeads];
          return {
            ...a,
            leads: updatedLeads,
            submittedLeads: updatedLeads.filter(x => x.status === "Pending" || x.status?.toLowerCase() === "pending").length,
            approvedLeads: updatedLeads.filter(x => x.status === "Approved" || x.status?.toLowerCase() === "approved").length,
            rejectedLeads: updatedLeads.filter(x => x.status === "Rejected" || x.status?.toLowerCase() === "rejected").length,
            totalLeads: updatedLeads.length
          };
        }
        return a;
      }));
      setTransferring(false);
      return;
    }

    try {
      await axios.put(
        `${BASE_URL}/admin/agent/transfer`,
        { leadIds, newAgentId: targetAgentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`${leadIds.length} lead(s) transferred successfully!`);
      setShowTransferModal(false);
      dispatch(fetchAllAgents());
      dispatch(fetchAllVendors());
    } catch (err) {
      console.error("Transfer error:", err);
      toast.error(err.response?.data?.message || "Transfer failed. Please try again.");
    } finally {
      setTransferring(false);
    }
  };

  useEffect(() => {
    dispatch(fetchAllAgents());
  }, [dispatch, currentFilters.page, currentFilters.limit, currentFilters.search]);

  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        dispatch(setAgentFilters({ search: value, page: 1 }));
      }, 500),
    [dispatch]
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const goToPage = (p) => {
    dispatch(setAgentFilters({ page: p }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this agent?")) return;
    console.log("Delete agent:", id);
  };

  const [agentsWithRealCounts, setAgentsWithRealCounts] = useState([]);

  useEffect(() => {
    if (agents && agents.length > 0) {
      setAgentsWithRealCounts(agents);
      
      agents.forEach(async (agt) => {
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get(`${BASE_URL}/admin/agent/getAgentById/${agt._id}?page=1&limit=99999&leadPage=1&leadLimit=99999`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const realLeads = res.data?.data?.leads || [];
          const submitted = realLeads.filter(l => l.status?.toLowerCase() === "pending" || l.status === "Pending").length;
          const approved = realLeads.filter(l => l.status?.toLowerCase() === "approved" || l.status === "Approved").length;
          const rejected = realLeads.filter(l => l.status?.toLowerCase() === "rejected" || l.status === "Rejected").length;
          const total = realLeads.length;
          
          setAgentsWithRealCounts(prev => prev.map(item => {
            if (item._id === agt._id) {
              return {
                ...item,
                leads: realLeads,
                submittedLeads: submitted,
                approvedLeads: approved,
                rejectedLeads: rejected,
                totalLeads: total
              };
            }
            return item;
          }));
        } catch (e) {
          console.error("Failed to fetch real lead counts for agent", agt._id, e);
        }
      });
    } else {
      setAgentsWithRealCounts([]);
    }
  }, [agents]);

  const sampleAgents = getSampleAgentsList();
  const [mockAgents, setMockAgents] = useState(sampleAgents);

  const checkIsActive = (agent) => {
    if (agent.isActive !== undefined && agent.isActive !== null) {
      return agent.isActive;
    }
    if (agent.status) {
      return agent.status.toLowerCase() === "active";
    }
    return false;
  };

  const rawDisplayAgents = (agents && agents.length > 0) ? agentsWithRealCounts : mockAgents;

  const displayAgents = useMemo(() => {
    if (statusFilter === "active") {
      return rawDisplayAgents.filter(agent => checkIsActive(agent));
    }
    if (statusFilter === "inactive") {
      return rawDisplayAgents.filter(agent => !checkIsActive(agent));
    }
    return rawDisplayAgents;
  }, [rawDisplayAgents, statusFilter]);

  const handleToggleStatus = (agentId) => {
    const isMock = !isNaN(agentId) || agentId.length < 5;
    if (isMock) {
      setMockAgents(prev =>
        prev.map(agent =>
          agent._id === agentId
            ? {
              ...agent,
              isActive: !checkIsActive(agent),
              status: checkIsActive(agent) ? "Blocked" : "Active"
            }
            : agent
        )
      );
    } else {
      const agent = displayAgents.find(a => a._id === agentId);
      if (agent) {
        const nextIsActive = !checkIsActive(agent);
        dispatch(updateAgentStatus({ agentId, isActive: nextIsActive }));
      }
    }
  };

  // Badge style for registration source
  const getSourceBadge = (source) => {
    const styles = {
      vendor: "bg-purple-100 text-purple-700 border border-purple-200",
      admin: "bg-blue-100 text-blue-700 border border-blue-200",
      self: "bg-green-100 text-green-700 border border-green-200",
    };
    const key = source?.toLowerCase();
    return styles[key] || "bg-gray-100 text-gray-600 border border-gray-200";
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} limit={1} />
      <div className="p-6 min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 shadow-xl mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <UserCog className="w-7 h-7" />
                Agent Managements
              </h1>
              <div className="text-sm text-orange-100 flex items-center gap-2 mt-3">
                <NavLink to="/dashboard" className="flex items-center gap-1 hover:text-white transition-colors">
                  <span className="bg-white/20 px-3 py-1 rounded-lg">Dashboard</span>
                </NavLink>
                <span className="text-white/60">›</span>
                <span className="text-white font-medium">Agent Management</span>
              </div>
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-lg">
              <p className="text-white text-sm font-medium">{pagination.totalAgents} Total Agents</p>
            </div>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          {/* Status Filter Tabs */}
          <div className="flex bg-gray-100 p-1.5 rounded-xl border border-gray-200 gap-1 w-full md:w-auto">
            <button
              onClick={() => setSearchParams({})}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                statusFilter === "all"
                  ? "bg-white text-orange-600 shadow-sm font-bold"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Users className="w-4 h-4" />
              All Agents ({rawDisplayAgents.length})
            </button>
            <button
              onClick={() => setSearchParams({ status: "active" })}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                statusFilter === "active"
                  ? "bg-emerald-500 text-white shadow-sm font-bold"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <UserCheck className="w-4 h-4" />
              Active ({rawDisplayAgents.filter(a => checkIsActive(a)).length})
            </button>
            <button
              onClick={() => setSearchParams({ status: "inactive" })}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                statusFilter === "inactive"
                  ? "bg-red-500 text-white shadow-sm font-bold"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <UserX className="w-4 h-4" />
              Inactive ({rawDisplayAgents.filter(a => !checkIsActive(a)).length})
            </button>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto flex-1">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search agents by name (All Pages)..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white shadow-sm"
              />
            </div>
            <button
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 whitespace-nowrap"
              onClick={() => navigate("/agent/form")}
            >
              <PlusCircle className="w-5 h-5" />
              Add Agent
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white flex justify-center items-center">
            <h2 className="text-xl font-bold text-gray-800">Agent Analytics</h2>
          </div>

          <div className="overflow-x-auto min-h-[300px]">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr className="text-xs text-gray-700 font-semibold border-b border-gray-200">
                  <th className="px-1.5 py-3 text-center whitespace-nowrap">Sr. No</th>
                  <th className="px-2 py-3 text-left whitespace-nowrap">Name</th>
                  <th className="px-2 py-3 text-center whitespace-nowrap">Phone</th>
                  <th className="px-1.5 py-3 text-center whitespace-nowrap">Submitted</th>
                  <th className="px-1.5 py-3 text-center whitespace-nowrap">Approved</th>
                  <th className="px-1.5 py-3 text-center whitespace-nowrap">Rejected</th>
                  <th className="px-1.5 py-3 text-center whitespace-nowrap">Total</th>
                  <th className="px-2 py-3 text-center whitespace-nowrap">Registered Via</th>
                  <th className="px-2 py-3 text-center whitespace-nowrap">Status</th>
                  <th className="px-2 py-3 text-center whitespace-nowrap">Created By</th>
                  <th className="px-2 py-3 text-center whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-center">
                {loading ? (
                  <tr>
                    <td colSpan="11" className="px-4 py-16"><LoaderSpinner /></td>
                  </tr>
                ) : displayAgents.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="px-4 py-12 text-center text-gray-500 text-sm">
                      {error || (searchTerm ? `No results found for "${searchTerm}"` : "No agents found")}
                    </td>
                  </tr>
                ) : (
                  displayAgents.map((agent, index) => (
                    <tr key={agent._id} className="hover:bg-gray-50 transition-colors text-xs md:text-sm">
                      <td className="px-2 py-3 font-semibold text-gray-800">
                        {(pagination.currentPage - 1) * pagination.limit + index + 1}
                      </td>
                      <td className="px-2.5 py-3 font-semibold text-gray-800 text-left whitespace-nowrap">{agent.name || "—"}</td>
                      <td className="px-2.5 py-3 text-gray-700 whitespace-nowrap">{agent.phone || "—"}</td>
                      <td className="px-2 py-3 text-blue-700 font-medium">{agent.submittedLeads}</td>
                      <td className="px-2 py-3 text-green-700 font-medium">{agent.approvedLeads}</td>
                      <td className="px-2 py-3 text-red-700 font-medium">{agent.rejectedLeads}</td>
                      <td className="px-2 py-3 font-bold text-gray-800">{agent.totalLeads}</td>

                      <td className="px-2.5 py-3 whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getSourceBadge(agent.registrationSource)}`}
                        >
                          {agent.registrationSource || "—"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(agent._id)}
                          disabled={statusUpdating === agent._id}
                          className={`relative inline-flex items-center gap-2 px-3 py-1.5 cursor-pointer rounded-full text-xs font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed ${checkIsActive(agent)
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-red-100 text-red-700 hover:bg-red-200"
                            }`}
                        >
                          {statusUpdating === agent._id ? (
                            <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <span
                              className={`w-2 h-2 rounded-full ${checkIsActive(agent) ? "bg-green-500" : "bg-red-500"
                                }`}
                            />
                          )}
                          {checkIsActive(agent) ? "Active" : "Blocked"}
                        </button>
                      </td>

                      <td className="px-2.5 py-3 text-gray-700 font-medium whitespace-nowrap">
                        {agent.registrationSource?.toLowerCase() === "self" ? "—" : (agent.creatorName || "—")}
                      </td>

                      <td className="px-2.5 py-3 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button onClick={() => navigate(`/agent/view/${agent._id}`)} className="p-1 text-blue-600 hover:bg-blue-50 rounded-md" title="View"><FiEye size={16} /></button>
                          <button onClick={() => navigate(`/agent/edit/${agent._id}`)} className="p-1 text-orange-600 hover:bg-orange-50 rounded-md" title="Edit"><Edit size={16} /></button>
                          <button onClick={() => handleOpenTransferModal(agent)} className="p-1 text-teal-600 hover:bg-teal-50 rounded-md" title="Transfer Leads"><ArrowLeftRight size={16} /></button>
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
              {Math.min((pagination.currentPage - 1) * pagination.limit + 1, pagination.totalAgents)}{" "}
              to{" "}
              {Math.min(pagination.currentPage * pagination.limit, pagination.totalAgents)}{" "}
              of {pagination.totalAgents} entries
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
                    className={`w-9 h-9 rounded-lg font-bold text-sm transition-all shadow-sm ${pagination.currentPage === idx + 1
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
      </div>

      {/* Transfer Leads Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center pb-4 border-b border-gray-150">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <ArrowLeftRight className="w-5 h-5 text-orange-500" />
                Transfer Leads
              </h2>
              <button
                onClick={() => setShowTransferModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
              >
                <ChevronRight className="w-6 h-6 rotate-180" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              {/* Source Agent Info */}
              <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-4">
                <p className="text-xs font-bold text-orange-500 uppercase tracking-wider">Source Agent</p>
                <p className="text-base font-bold text-gray-800 mt-1">{selectedSourceAgent?.name}</p>
                <p className="text-xs text-gray-500 mt-1">{selectedSourceAgent?.phone}</p>

                <div className="mt-3 pt-3 border-t border-orange-100/50 flex justify-between items-center">
                  <span className="text-xs font-semibold text-gray-600">Leads to Transfer:</span>
                  {loadingLeads ? (
                    <div className="w-4 h-4 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
                  ) : (
                    <span className="text-sm font-bold text-orange-600 bg-orange-100 px-2.5 py-0.5 rounded-full">
                      {sourceLeads.length} Leads
                    </span>
                  )}
                </div>
              </div>

              {/* Target Agent Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Select Target Agent</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search agents..."
                    value={targetAgentSearch}
                    onChange={(e) => setTargetAgentSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-gray-50/30"
                  />
                </div>

                <div className="border border-gray-150 rounded-xl max-h-48 overflow-y-auto divide-y divide-gray-100 bg-white shadow-inner">
                  {loadingDropdown ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="w-6 h-6 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
                    </div>
                  ) : agentsDropdownList.filter(a => a.name?.toLowerCase().includes(targetAgentSearch.toLowerCase())).length > 0 ? (
                    agentsDropdownList
                      .filter(a => a.name?.toLowerCase().includes(targetAgentSearch.toLowerCase()))
                      .map((agentItem) => {
                        const isSelected = targetAgentId === agentItem._id;
                        return (
                          <button
                            key={agentItem._id}
                            type="button"
                            onClick={() => setTargetAgentId(agentItem._id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-orange-50/50 ${isSelected ? "bg-orange-50" : ""
                              }`}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${isSelected ? "bg-orange-500 text-white" : "bg-orange-100 text-orange-600"
                              }`}>
                              {agentItem.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className={`text-sm font-semibold truncate ${isSelected ? "text-orange-600" : "text-gray-800"}`}>
                                {agentItem.name}
                              </p>
                              {agentItem.phone && (
                                <p className="text-[10px] text-gray-400 tracking-wider mt-0.5">
                                  {agentItem.phone}
                                </p>
                              )}
                            </div>
                          </button>
                        );
                      })
                  ) : (
                    <p className="text-sm text-gray-400 text-center py-8">No agents found</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-150">
              <button
                type="button"
                onClick={() => setShowTransferModal(false)}
                disabled={transferring}
                className="px-4 py-2 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmTransfer}
                disabled={!targetAgentId || loadingLeads || sourceLeads.length === 0 || transferring}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-2"
              >
                {transferring ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Transferring...
                  </>
                ) : (
                  "Transfer Leads"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}