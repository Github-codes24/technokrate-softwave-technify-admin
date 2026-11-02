import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Async thunk to fetch single client by ID
export const fetchClientById = createAsyncThunk(
  "clientView/fetchClientById",
  async (id, { rejectWithValue }) => {
    try {
      // localStorage se token le rahe hain
      const token = localStorage.getItem("token"); 

      const response = await axios.get(
        `${BASE_URL}/admin/leads/getClientLeadById/${id}`,
        {
          headers: {
            // Token ko header mein bhej rahe hain
            Authorization: `Bearer ${token}`, 
          },
        }
      );
      
      // API response: { success: true, data: { ... } }
      return response.data; 
    } catch (error) {
      // Backend error message handle karna
      return rejectWithValue(
        error.response?.data?.message || "Authentication failed or Lead not found"
      );
    }
  }
);

const viewClientSlice = createSlice({
  name: "viewClient",
  initialState: {
    clientData: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearClientData: (state) => {
      state.clientData = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClientById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClientById.fulfilled, (state, action) => {
        state.loading = false;
        state.clientData = action.payload.data; // payload.data use kar rahe hain kyunki response structure waisa hai
      })
      .addCase(fetchClientById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearClientData } = viewClientSlice.actions;
export default viewClientSlice.reducer;