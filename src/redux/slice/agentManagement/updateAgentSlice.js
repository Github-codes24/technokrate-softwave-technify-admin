import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const updateAgent = createAsyncThunk(
  "agent/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${BASE_URL}/admin/agent/updateAgent/${id}`,
        formData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update agent");
    }
  }
);

const updateAgentSlice = createSlice({
  name: "updateAgent",
  initialState: {
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    resetUpdateState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateAgent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAgent.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updateAgent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetUpdateState } = updateAgentSlice.actions;
export default updateAgentSlice.reducer;