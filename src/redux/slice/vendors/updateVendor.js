import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const updateVendor = createAsyncThunk(
  "vendor/update",
  async ({ id, vendorData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token"); // Token fetch
      const response = await axios.put(
        `${BASE_URL}/admin/vendor/updateVendor/${id}`,
        vendorData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Update failed");
    }
  }
);

const updateVendorSlice = createSlice({
  name: "updateVendor",
  initialState: { loading: false, success: false, error: null },
  reducers: {
    resetUpdateState: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateVendor.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateVendor.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updateVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetUpdateState } = updateVendorSlice.actions;
export default updateVendorSlice.reducer;