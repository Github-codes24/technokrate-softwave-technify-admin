import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://softwave-technify-be-xbff.onrender.com/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const fetchAllLeads = createAsyncThunk(
  "leads/fetchAllLeads",
  async (customParams, { getState, rejectWithValue }) => {
    try {
      const { currentFilters } = getState().allLeads;
      const filters = { ...currentFilters, ...(customParams || {}) };

      let url = `${BASE_URL}/admin/leads/getAllLeads?page=${filters.page || 1}&limit=${filters.limit || 10}`;

      if (filters.search) {
        url += `&search=${encodeURIComponent(filters.search)}`;
      }
      if (filters.cardKey) {
        url += `&cardKey=${encodeURIComponent(filters.cardKey)}`;
      }
      if (filters.dateFilter && filters.dateFilter !== "All" && filters.dateFilter.toLowerCase() !== "all") {
        url += `&dateFilter=${encodeURIComponent(filters.dateFilter.toLowerCase())}`;
      }
      if (filters.status && filters.status !== "All" && filters.status.toLowerCase() !== "all") {
        url += `&status=${encodeURIComponent(filters.status)}`;
      }
      if (filters.leadType) {
        url += `&leadType=${encodeURIComponent(filters.leadType)}`;
      }
      if (filters.platform) {
        url += `&platform=${encodeURIComponent(filters.platform)}`;
      }
      if (filters.leadFromDate && filters.leadToDate) {
        url += `&leadFromDate=${encodeURIComponent(filters.leadFromDate)}&leadToDate=${encodeURIComponent(filters.leadToDate)}`;
      }

      const response = await axios.get(url, { headers: getAuthHeaders() });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch leads");
    }
  }
);

export const fetchDashboardStats = createAsyncThunk(
  "leads/fetchDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();

      // 1. Try dedicated dashboard-stats endpoint
      try {
        const res = await axios.get(`${BASE_URL}/admin/leads/dashboard-stats`, { headers });
        if (res.data?.data || res.data?.overallStats || res.data?.keyDashboardCards) {
          return res.data;
        }
      } catch (err) {
        // Fallback to stats endpoint
      }

      // 2. Try standalone stats endpoint
      try {
        const res = await axios.get(`${BASE_URL}/admin/leads/stats`, { headers });
        if (res.data?.data || res.data?.overallStats || res.data?.keyDashboardCards) {
          return res.data;
        }
      } catch (err) {
        // Fallback to getAllLeads
      }

      // 3. Fallback: getAllLeads with limit 1 returns all stats sections
      const res = await axios.get(`${BASE_URL}/admin/leads/getAllLeads?page=1&limit=1`, { headers });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch dashboard stats");
    }
  }
);

const initialState = {
  leads: [],
  loading: false,
  error: null,
  statsLoading: false,
  statsError: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalLeads: 0,
    limit: 10,
  },
  currentFilters: {
    page: 1,
    limit: 10,
    search: "",
    cardKey: "",
    dateFilter: "All",
    status: "All",
    leadType: "",
    platform: "",
  },
  overallStats: null,
  dateAnalytics: null,
  keyDashboardCards: null,
  salesPerformance: null,
  statusCounts: null,
};

const extractStatsFromPayload = (state, payload) => {
  if (!payload) return;
  const data = payload?.data && !Array.isArray(payload.data) ? payload.data : payload;

  if (data?.overallStats) state.overallStats = data.overallStats;
  else if (payload?.overallStats) state.overallStats = payload.overallStats;

  if (data?.dateAnalytics) state.dateAnalytics = data.dateAnalytics;
  else if (payload?.dateAnalytics) state.dateAnalytics = payload.dateAnalytics;

  if (data?.keyDashboardCards) state.keyDashboardCards = data.keyDashboardCards;
  else if (payload?.keyDashboardCards) state.keyDashboardCards = payload.keyDashboardCards;

  if (data?.salesPerformance) state.salesPerformance = data.salesPerformance;
  else if (payload?.salesPerformance) state.salesPerformance = payload.salesPerformance;

  if (data?.statusCounts) state.statusCounts = data.statusCounts;
  else if (payload?.statusCounts) state.statusCounts = payload.statusCounts;

  const total =
    data?.totalRecords ??
    payload?.totalRecords ??
    data?.total ??
    payload?.total ??
    data?.totalLeads ??
    payload?.totalLeads ??
    data?.overallStats?.totalLeads ??
    payload?.overallStats?.totalLeads ??
    payload?.pagination?.total ??
    data?.pagination?.total ??
    null;

  if (total != null) {
    state.pagination.totalLeads = total;
  }
};

const getAllLeadSlice = createSlice({
  name: "allLeads",
  initialState,
  reducers: {
    setLeadFilters: (state, action) => {
      state.currentFilters = { ...state.currentFilters, ...action.payload };
    },
    resetLeadFilters: (state) => {
      state.currentFilters = {
        page: 1,
        limit: 10,
        search: "",
        cardKey: "",
        dateFilter: "All",
        status: "All",
        leadType: "",
        platform: "",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAllLeads
      .addCase(fetchAllLeads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllLeads.fulfilled, (state, action) => {
        state.loading = false;
        const rawData = action.payload;
        const leadsArray = Array.isArray(rawData?.data)
          ? rawData.data
          : Array.isArray(rawData?.data?.leads)
          ? rawData.data.leads
          : Array.isArray(rawData?.leads)
          ? rawData.leads
          : Array.isArray(rawData)
          ? rawData
          : [];

        state.leads = leadsArray;

        const total =
          rawData?.totalRecords ??
          rawData?.total ??
          rawData?.pagination?.total ??
          rawData?.data?.totalRecords ??
          rawData?.data?.total ??
          rawData?.overallStats?.totalLeads ??
          leadsArray.length ??
          0;
        const limit = state.currentFilters.limit || 10;

        state.pagination = {
          currentPage: rawData?.currentPage || rawData?.data?.currentPage || rawData?.pagination?.page || state.currentFilters.page || 1,
          totalPages: rawData?.totalPages || rawData?.pagination?.totalPages || Math.ceil(total / limit) || 1,
          totalLeads: total,
          limit: limit,
        };

        extractStatsFromPayload(state, rawData);
      })
      .addCase(fetchAllLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchDashboardStats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.statsLoading = true;
        state.statsError = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        extractStatsFromPayload(state, action.payload);
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.statsError = action.payload;
      });
  },
});

export const { setLeadFilters, resetLeadFilters } = getAllLeadSlice.actions;
export default getAllLeadSlice.reducer;