import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchAllAgents = createAsyncThunk(
  "agents/fetchAll",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { currentFilters } = getState().allAgents;
      const token = localStorage.getItem("token");

      // Search parameter ko URL mein include kiya
      let url = `${BASE_URL}/admin/agent/getAllAgents?page=${currentFilters.page}&limit=${currentFilters.limit}`;

      if (currentFilters.search) {
        url += `&search=${encodeURIComponent(currentFilters.search)}`;
      }

      // Cache-bust to prevent 304 stale responses
      url += `&_t=${Date.now()}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
          "Pragma": "no-cache",
        },
      });
      return response.data;
    } catch (error) {
      console.error("fetchAllAgents error:", error.response || error);
      return rejectWithValue(error.response?.data?.message || "Failed to fetch agents");
    }
  }
);

export const updateAgentStatus = createAsyncThunk(
  "agents/updateStatus",
  async ({ agentId, isActive }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return rejectWithValue("No authentication token found");

      console.log(`[Status Update] Sending PUT to: ${BASE_URL}/admin/agent/updateAgent/${agentId} with isActive: ${isActive}`);
      const response = await axios.put(
        `${BASE_URL}/admin/agent/updateAgent/${agentId}`,
        {
          isActive,
          status: isActive ? "Active" : "Blocked"
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("[Status Update] Response Success:", response.data);
      return response.data;
    } catch (error) {
      console.error("[Status Update] Response Error:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || "Failed to update agent status";
      return rejectWithValue(errorMessage);
    }
  }
);

const getAllAgentSlice = createSlice({
  name: "allAgents",
  initialState: {
    agents: [],
    loading: false,
    error: null,
    statusUpdating: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalAgents: 0,
      limit: 10,
    },
    currentFilters: {
      page: 1,
      limit: 10,
      search: "", // Naya search state
    },
  },
  reducers: {
    setAgentFilters: (state, action) => {
      state.currentFilters = { ...state.currentFilters, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAgents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAgents.fulfilled, (state, action) => {
        state.loading = false;
        state.agents = action.payload?.data || [];
        state.pagination = {
          currentPage: action.payload?.page || state.currentFilters?.page || 1,
          totalPages: Math.ceil((action.payload?.total || 0) / (action.payload?.limit || state.currentFilters?.limit || 10)) || 1,
          totalAgents: action.payload?.total || 0,
          limit: action.payload?.limit || state.currentFilters?.limit || 10,
        };
      })
      .addCase(fetchAllAgents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Agent Status
      .addCase(updateAgentStatus.pending, (state, action) => {
        state.statusUpdating = action.meta.arg.agentId; // agentId
      })
      .addCase(updateAgentStatus.fulfilled, (state, action) => {
        state.statusUpdating = null;
        const targetId = action.meta.arg.agentId;
        const targetIsActive = action.meta.arg.isActive;
        const index = state.agents.findIndex((a) => a._id === targetId);
        if (index !== -1) {
          state.agents[index].isActive = targetIsActive;
          state.agents[index].status = targetIsActive ? "Active" : "Blocked";

          const updated = action.payload?.data;
          if (updated) {
            state.agents[index].isActive = updated.isActive;
            if (updated.status !== undefined) {
              state.agents[index].status = updated.status;
            }
          }
        }
      })
      .addCase(updateAgentStatus.rejected, (state, action) => {
        state.statusUpdating = null;
        state.error = action.payload;
      });
  },
});

export const { setAgentFilters } = getAllAgentSlice.actions;
export default getAllAgentSlice.reducer;