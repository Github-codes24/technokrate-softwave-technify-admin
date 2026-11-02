import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchSingleAgent = createAsyncThunk(
  "agent/fetchSingle",
  async (arg, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const id = typeof arg === "string" ? arg : arg.id;
      const page = typeof arg === "object" ? arg.page || 1 : 1;
      const limit = typeof arg === "object" ? arg.limit || 10 : 10;
      const leadSearch = typeof arg === "object" ? arg.leadSearch || "" : "";
      const leadFromDate = typeof arg === "object" ? arg.leadFromDate || "" : "";
      const leadToDate = typeof arg === "object" ? arg.leadToDate || "" : "";

      let q = `?page=${page}&limit=${limit}&leadPage=${page}&leadLimit=${limit}`;
      if (leadSearch) q += `&leadSearch=${encodeURIComponent(leadSearch)}`;
      if (leadFromDate) q += `&leadFromDate=${leadFromDate}`;
      if (leadToDate) q += `&leadToDate=${leadToDate}`;

      const response = await axios.get(
        `${BASE_URL}/admin/agent/getAgentById/${id}${q}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data; // Expected { success: true, data: { ... } }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch agent details");
    }
  }
);

const getSingleAgentSlice = createSlice({
  name: "singleAgent",
  initialState: {
    agent: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearAgentDetails: (state) => {
      state.agent = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSingleAgent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleAgent.fulfilled, (state, action) => {
        state.loading = false;
        state.agent = action.payload.data;
      })
      .addCase(fetchSingleAgent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAgentDetails } = getSingleAgentSlice.actions;
export default getSingleAgentSlice.reducer;