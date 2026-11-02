import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://softwave-technify-be-xbff.onrender.com/api";

// API to Fetch Categories for Dropdown
export const fetchCategories = createAsyncThunk(
  'leads/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${BASE_URL}/admin/projectCategory/getProjectCategorybyName`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.data; // Returning the array of categories
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

// API to Create Lead
export const createLead = createAsyncThunk(
  'leads/createLead',
  async (leadData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/admin/leads/createByAdmin`,
        leadData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

const addLeadSlice = createSlice({
  name: 'addLead',
  initialState: {
    categories: [],
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      // Create Lead
      .addCase(createLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLead.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetState } = addLeadSlice.actions;
export default addLeadSlice.reducer;