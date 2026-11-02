import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
// Async Thunk to fetch bank details
export const fetchBankDetails = createAsyncThunk(
  "bankDetails/fetchBankDetails",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token"); // Token from localStorage
      const response = await axios.get(
        `${BASE_URL}/admin/user-status/bank-details/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data; // Assuming API returns { data: { ... } }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch bank details"
      );
    }
  }
);

const bankDetailsSlice = createSlice({
  name: "bankDetails",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearBankState: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBankDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBankDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchBankDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBankState } = bankDetailsSlice.actions;
export default bankDetailsSlice.reducer;