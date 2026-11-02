import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://softwave-technify-be-xbff.onrender.com/api";

// Helper to get token
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

// 1. Fetch Single Lead by ID
export const fetchLeadById = createAsyncThunk(
  "lead/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/admin/leads/getLeadById/${id}`,
        { headers: getAuthHeader() }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch lead");
    }
  }
);

// 2. Update Lead Status
export const updateLeadStatus = createAsyncThunk(
  "lead/updateStatus",
  async ({ id, status, reason }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/admin/leads/updateStatus/${id}`,
        { status, reason },
        { headers: getAuthHeader() }
      );
      return { id, status, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update status");
    }
  }
);

const singleLeadSlice = createSlice({
  name: "singleLead",
  initialState: {
    lead: null,
    loading: false,
    updateLoading: false,
    error: null,
  },
  reducers: {
    clearLeadState: (state) => {
      state.lead = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Lead Cases
      .addCase(fetchLeadById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeadById.fulfilled, (state, action) => {
        state.loading = false;
        state.lead = action.payload;
      })
      .addCase(fetchLeadById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Status Cases
      .addCase(updateLeadStatus.pending, (state) => {
        state.updateLoading = true;
      })
      .addCase(updateLeadStatus.fulfilled, (state, action) => {
        state.updateLoading = false;
        if (state.lead) {
          state.lead.status = action.payload.status; // Update local state status
        }
      })
      .addCase(updateLeadStatus.rejected, (state) => {
        state.updateLoading = false;
      });
  },
});

export const { clearLeadState } = singleLeadSlice.actions;
export default singleLeadSlice.reducer;