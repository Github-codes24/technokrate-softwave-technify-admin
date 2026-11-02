import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchApproveLeadsCommission = createAsyncThunk(
  "commission/fetchApproveLeads",
  async (_, { rejectWithValue }) => {
    try {
      // LocalStorage se token nikalna
      const token = localStorage.getItem("token"); 

      const response = await axios.get(
        `${BASE_URL}/admin/commission-management/getApproveLeadsCommission`,
        {
          headers: {
            // Standard Authorization header format
            Authorization: `Bearer ${token}`, 
          },
        }
      );
      return response.data;
    } catch (error) {
      // Agar backend error message deta hai toh use handle karein
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

const commissionSlice = createSlice({
  name: "commission",
  initialState: {
    leads: [],
    stats: {
      totalCount: 0,
      totalAmount: 0,
    },
    loading: false,
    error: null,
  },
  reducers: {
    // Optional: Error clear karne ke liye reducer
    clearCommissionError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApproveLeadsCommission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApproveLeadsCommission.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = action.payload.data;
        state.stats.totalCount = action.payload.approvedLeadsCount;
        state.stats.totalAmount = action.payload.totalCommissionAmount;
      })
      .addCase(fetchApproveLeadsCommission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCommissionError } = commissionSlice.actions;
export default commissionSlice.reducer;