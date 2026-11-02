import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const createAgent = createAsyncThunk(
  "agent/create",
  async (agentData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token"); // Admin token
      const response = await axios.post(
        `${BASE_URL}/admin/agent/createAgentByAdmin`,
        agentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add agent"
      );
    }
  }
);


export const fetchVendors = createAsyncThunk(
  "agent/fetchVendors",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/admin/vendor/getVendorsDropdown`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.data; // Array of vendors
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch vendors");
    }
  }
);

const addAgentSlice = createSlice({
  name: "addAgent",
  initialState: {
    loading: false,
    success: false,
    error: null,
    vendors: [], // Vendors store karne ke liye
    vendorsLoading: false,
  },
  reducers: {
    resetAddState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAgent.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createAgent.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createAgent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(fetchVendors.pending, (state) => {
        state.vendorsLoading = true;
      })
      .addCase(fetchVendors.fulfilled, (state, action) => {
        state.vendorsLoading = false;
        state.vendors = action.payload;
      })
      .addCase(fetchVendors.rejected, (state) => {
        state.vendorsLoading = false;
      });
  },
});

export const { resetAddState } = addAgentSlice.actions;
export default addAgentSlice.reducer;