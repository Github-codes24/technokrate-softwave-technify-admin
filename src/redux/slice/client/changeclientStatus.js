import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 1. Fetch Dropdown Options
export const fetchLeadStatuses = createAsyncThunk(
  "client/fetchStatuses",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/admin/leads/getLeadStatusDropdown`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data; // Yeh ["Pending", "Approved", ...] return karega
    } catch (error) {
      return rejectWithValue(error.response.data.message || "Failed to fetch statuses");
    }
  }
);

// 2. Update Status
export const updateClientStatus = createAsyncThunk(
  "client/updateStatus",
  async ({ id, status, reason, price }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${BASE_URL}/admin/leads/updateStatus/${id}`,
        { status, reason, price },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || "Update failed");
    }
  }
);

const changeclientStatusSlice = createSlice({
  name: "changeStatus",
  initialState: {
    dropdownStatuses: [], // Dropdown ke liye array
    loading: false,
    updateLoading: false,
    success: false,
    error: null,
  },
  reducers: {
    resetStatusState: (state) => {
      state.success = false;
      state.error = null;
      state.updateLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Dropdown Case
      .addCase(fetchLeadStatuses.fulfilled, (state, action) => {
        state.dropdownStatuses = action.payload;
      })
      // Update Case
      .addCase(updateClientStatus.pending, (state) => {
        state.updateLoading = true;
      })
      .addCase(updateClientStatus.fulfilled, (state) => {
        state.updateLoading = false;
        state.success = true;
      })
      .addCase(updateClientStatus.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetStatusState } = changeclientStatusSlice.actions;
export default changeclientStatusSlice.reducer;