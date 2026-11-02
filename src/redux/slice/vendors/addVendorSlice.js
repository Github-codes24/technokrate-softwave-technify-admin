import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const createVendor = createAsyncThunk(
  "vendor/create",
  async (vendorData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_URL}/admin/vendor/Createvendorbyadmin`,
        vendorData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create vendor");
    }
  }
);

const addVendorSlice = createSlice({
  name: "addVendor",
  initialState: {
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    // 2. Isse 'actions' se nikal kar export karna hoga
    resetState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVendor.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Yeh line ensure karein
export const { resetState } = addVendorSlice.actions; 
export default addVendorSlice.reducer;