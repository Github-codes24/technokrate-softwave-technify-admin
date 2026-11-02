import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ─── 1. Fetch vendor detail (paginated) ─────────────────────────────────────
export const fetchVendorById = createAsyncThunk(
  "vendor/fetchById",
  async (
    {
      id,
      agentPage = 1,
      leadPage = 1,
      agentLimit = 5,
      leadLimit = 5,
      agentSearch = "",
      leadSearch = "",
      leadDateFilter = "",
      agentFromDate = "",
      agentToDate = "",
      leadFromDate = "",
      leadToDate = "",
    },
    { rejectWithValue },
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("Authentication token not found.");

      let q = `?agentPage=${agentPage}&agentLimit=${agentLimit}&leadPage=${leadPage}&leadLimit=${leadLimit}`;
      if (agentSearch) q += `&agentSearch=${encodeURIComponent(agentSearch)}`;
      if (leadSearch) q += `&leadSearch=${encodeURIComponent(leadSearch)}`;
      if (leadDateFilter && leadDateFilter !== "All") q += `&leadDateFilter=${encodeURIComponent(leadDateFilter)}`;
      if (agentFromDate) q += `&agentFromDate=${agentFromDate}`;
      if (agentToDate) q += `&agentToDate=${agentToDate}`;
      if (leadFromDate) q += `&leadFromDate=${leadFromDate}`;
      if (leadToDate) q += `&leadToDate=${leadToDate}`;

      const response = await axios.get(
        `${BASE_URL}/admin/vendor/getVendor/${id}${q}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      return {
        vendor: response.data.data,
        pagination: response.data.pagination,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch vendor details",
      );
    }
  },
);

// ─── 2. Fetch all lead IDs (for select-all across pages) ────────────────────
export const fetchAllLeadIds = createAsyncThunk(
  "vendor/fetchAllLeadIds",
  async (
    { id, leadSearch = "", leadFromDate = "", leadToDate = "" },
    { rejectWithValue },
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("Authentication token not found.");
      let q = `?agentPage=1&agentLimit=1&leadPage=1&leadLimit=99999`;
      if (leadSearch) q += `&leadSearch=${encodeURIComponent(leadSearch)}`;
      if (leadFromDate) q += `&leadFromDate=${leadFromDate}`;
      if (leadToDate) q += `&leadToDate=${leadToDate}`;

      const response = await axios.get(
        `${BASE_URL}/admin/vendor/getVendor/${id}${q}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const leads = response.data.data?.leads || [];
      return leads.map((l) => l._id);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch all lead IDs",
      );
    }
  },
);

// ─── 3. Transfer leads to another vendor ────────────────────────────────────
export const transferLeads = createAsyncThunk(
  "vendor/transferLeads",
  async ({ vendorId, leadIds }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${BASE_URL}/admin/vendor/transfer`,
        { leadIds, newVendorId: vendorId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to transfer leads",
      );
    }
  },
);

// ─── 4. Bulk upload leads via Excel ─────────────────────────────────────────
export const bulkUploadLeads = createAsyncThunk(
  "vendor/bulkUploadLeads",
  async ({ vendorId, formData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("Authentication token not found.");

      const response = await axios.post(
        `${BASE_URL}/admin/vendor/bulk-upload/${vendorId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data; // { success, message, data: { totalRows, successCount, errorCount, duplicateCount, results } }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Bulk upload failed",
      );
    }
  },
);

// ─── 5. Delete vendor agent ─────────────────────────────────────────────────
export const deleteVendorAgent = createAsyncThunk(
  "vendor/deleteAgent",
  async (agentId, { getState, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("Authentication token not found.");

      const { vendor } = getState().vendorDetails;
      const vendorObj = vendor?.data || vendor;
      const vendorId = vendorObj?._id || "";

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const baseUrlClean = (BASE_URL || "").replace(/\/+$/, "");
      const domainClean = baseUrlClean.replace(/\/api\/?$/, "");

      const candidateRequests = [
        // 1. Primary /admin/vendor/deleteAgent/:id endpoints
        { method: "delete", url: `${baseUrlClean}/admin/vendor/deleteAgent/${agentId}` },
        { method: "put",    url: `${baseUrlClean}/admin/vendor/deleteAgent/${agentId}` },
        { method: "patch",  url: `${baseUrlClean}/admin/vendor/deleteAgent/${agentId}` },

        { method: "delete", url: `${baseUrlClean}/admin/agent/deleteAgent/${agentId}` },
        { method: "put",    url: `${baseUrlClean}/admin/agent/deleteAgent/${agentId}` },
        { method: "patch",  url: `${baseUrlClean}/admin/agent/deleteAgent/${agentId}` },

        ...(vendorId
          ? [
              { method: "delete", url: `${baseUrlClean}/admin/vendor/deleteAgent/${vendorId}/${agentId}` },
              { method: "put",    url: `${baseUrlClean}/admin/vendor/deleteAgent/${vendorId}/${agentId}` },
              { method: "delete", url: `${baseUrlClean}/admin/vendor/${vendorId}/agent/${agentId}` },
              { method: "put",    url: `${baseUrlClean}/admin/vendor/${vendorId}/agent/${agentId}` },
            ]
          : []),

        { method: "delete", url: `${baseUrlClean}/vendor/deleteAgent/${agentId}` },
        { method: "put",    url: `${baseUrlClean}/vendor/deleteAgent/${agentId}` },
        { method: "patch",  url: `${baseUrlClean}/vendor/deleteAgent/${agentId}` },

        { method: "delete", url: `${baseUrlClean}/admin/vendor/deleteUser/${agentId}` },
        { method: "put",    url: `${baseUrlClean}/admin/vendor/deleteUser/${agentId}` },

        { method: "delete", url: `${baseUrlClean}/admin/agent/${agentId}` },
        { method: "put",    url: `${baseUrlClean}/admin/agent/${agentId}` },

        // 2. Fallbacks with domainClean if BASE_URL didn't include /api
        { method: "delete", url: `${domainClean}/api/admin/vendor/deleteAgent/${agentId}` },
        { method: "put",    url: `${domainClean}/api/admin/vendor/deleteAgent/${agentId}` },
        { method: "delete", url: `${domainClean}/api/vendor/deleteAgent/${agentId}` },
        { method: "put",    url: `${domainClean}/api/vendor/deleteAgent/${agentId}` },
      ];

      let lastError = null;
      for (const req of candidateRequests) {
        try {
          let response;
          if (req.method === "delete") {
            response = await axios.delete(req.url, { headers });
          } else if (req.method === "put") {
            response = await axios.put(req.url, {}, { headers });
          } else if (req.method === "patch") {
            response = await axios.patch(req.url, {}, { headers });
          }
          return { agentId, data: response?.data };
        } catch (err) {
          lastError = err;
        }
      }

      throw lastError;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete agent",
      );
    }
  },
);

// ─── Slice ───────────────────────────────────────────────────────────────────
const getVendorDetailsSlice = createSlice({
  name: "vendorDetails",
  initialState: {
    vendor: null,
    loading: false,
    error: null,

    agentPagination: { currentPage: 1, limit: 5, total: 0, totalPages: 1 },
    leadPagination: { currentPage: 1, limit: 5, total: 0, totalPages: 1 },

    agentFilters: { search: "", fromDate: "", toDate: "" },
    leadFilters: { search: "", fromDate: "", toDate: "" },

    // "select all pages" support
    allLeadIds: [],
    allLeadIdsLoading: false,

    // transfer
    transferLoading: false,
    transferError: null,

    // bulk upload
    bulkUploadLoading: false,
    bulkUploadError: null,
    bulkUploadResult: null,

    // delete agent
    deleteAgentLoading: null,
    deleteAgentError: null,
  },

  reducers: {
    resetVendorDetails: (state) => {
      state.vendor = null;
      state.error = null;
      state.loading = false;
      state.agentPagination = {
        currentPage: 1,
        limit: 5,
        total: 0,
        totalPages: 1,
      };
      state.leadPagination = {
        currentPage: 1,
        limit: 5,
        total: 0,
        totalPages: 1,
      };
      state.agentFilters = { search: "", fromDate: "", toDate: "" };
      state.leadFilters = { search: "", fromDate: "", toDate: "" };
      state.allLeadIds = [];
      state.allLeadIdsLoading = false;
      state.transferLoading = false;
      state.transferError = null;
      state.bulkUploadLoading = false;
      state.bulkUploadError = null;
      state.bulkUploadResult = null;
    },

    setAgentPage: (state, action) => {
      state.agentPagination.currentPage = action.payload;
    },
    setLeadPage: (state, action) => {
      state.leadPagination.currentPage = action.payload;
    },

    setAgentFilters: (state, action) => {
      state.agentFilters = { ...state.agentFilters, ...action.payload };
      state.agentPagination.currentPage = 1;
    },
    setLeadFilters: (state, action) => {
      state.leadFilters = { ...state.leadFilters, ...action.payload };
      state.leadPagination.currentPage = 1;
    },

    removeTransferredLeads: (state, action) => {
      const removedIds = action.payload;
      const vendorObj = state.vendor?.data || state.vendor;
      if (vendorObj?.leads) {
        vendorObj.leads = vendorObj.leads.filter(
          (l) => !removedIds.includes(l._id),
        );
        if (typeof vendorObj.leadCount === "number") {
          vendorObj.leadCount = Math.max(
            0,
            vendorObj.leadCount - removedIds.length,
          );
        }
      }
      if (typeof state.leadPagination.total === "number") {
        state.leadPagination.total = Math.max(
          0,
          state.leadPagination.total - removedIds.length,
        );
      }
      state.allLeadIds = state.allLeadIds.filter(
        (id) => !removedIds.includes(id),
      );
    },

    clearAllLeadIds: (state) => {
      state.allLeadIds = [];
    },

    resetBulkUpload: (state) => {
      state.bulkUploadLoading = false;
      state.bulkUploadError = null;
      state.bulkUploadResult = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // fetchVendorById
      .addCase(fetchVendorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendorById.fulfilled, (state, action) => {
        state.loading = false;
        state.vendor = action.payload.vendor;
        if (action.payload.pagination) {
          if (action.payload.pagination.agents) {
            state.agentPagination.total =
              action.payload.pagination.agents.total;
            state.agentPagination.totalPages =
              action.payload.pagination.agents.totalPages;
          }
          if (action.payload.pagination.leads) {
            state.leadPagination.total = action.payload.pagination.leads.total;
            state.leadPagination.totalPages =
              action.payload.pagination.leads.totalPages;
          }
        }
      })
      .addCase(fetchVendorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchAllLeadIds
      .addCase(fetchAllLeadIds.pending, (state) => {
        state.allLeadIdsLoading = true;
      })
      .addCase(fetchAllLeadIds.fulfilled, (state, action) => {
        state.allLeadIdsLoading = false;
        state.allLeadIds = action.payload;
      })
      .addCase(fetchAllLeadIds.rejected, (state) => {
        state.allLeadIdsLoading = false;
      })

      // transferLeads
      .addCase(transferLeads.pending, (state) => {
        state.transferLoading = true;
        state.transferError = null;
      })
      .addCase(transferLeads.fulfilled, (state) => {
        state.transferLoading = false;
      })
      .addCase(transferLeads.rejected, (state, action) => {
        state.transferLoading = false;
        state.transferError = action.payload;
      })

      // bulkUploadLeads
      .addCase(bulkUploadLeads.pending, (state) => {
        state.bulkUploadLoading = true;
        state.bulkUploadError = null;
        state.bulkUploadResult = null;
      })
      .addCase(bulkUploadLeads.fulfilled, (state, action) => {
        state.bulkUploadLoading = false;
        state.bulkUploadResult = action.payload.data; // { totalRows, successCount, errorCount, duplicateCount, results }
      })
      .addCase(bulkUploadLeads.rejected, (state, action) => {
        state.bulkUploadLoading = false;
        state.bulkUploadError = action.payload;
      })

      // deleteVendorAgent
      .addCase(deleteVendorAgent.pending, (state, action) => {
        state.deleteAgentLoading = action.meta.arg;
        state.deleteAgentError = null;
      })
      .addCase(deleteVendorAgent.fulfilled, (state, action) => {
        state.deleteAgentLoading = null;
        const deletedId = action.payload.agentId;
        const vendorObj = state.vendor?.data || state.vendor;
        if (vendorObj?.agents) {
          vendorObj.agents = vendorObj.agents.filter((a) => a._id !== deletedId);
        }
        if (state.agentPagination.total > 0) {
          state.agentPagination.total -= 1;
        }
      })
      .addCase(deleteVendorAgent.rejected, (state, action) => {
        state.deleteAgentLoading = null;
        state.deleteAgentError = action.payload;
      });
  },
});

export const {
  resetVendorDetails,
  setAgentPage,
  setLeadPage,
  setAgentFilters,
  setLeadFilters,
  removeTransferredLeads,
  clearAllLeadIds,
  resetBulkUpload,
} = getVendorDetailsSlice.actions;

export default getVendorDetailsSlice.reducer;
