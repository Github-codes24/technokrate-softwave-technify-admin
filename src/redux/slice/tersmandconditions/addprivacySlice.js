import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const createPolicy = createAsyncThunk(
  'policy/createPolicy',
  async (policyData, { rejectWithValue }) => {
    try {
     const token = localStorage.getItem('token'); 
      const response = await axios.post(
        `${BASE_URL}/admin/terms-policy/create-policy`,
        policyData,
        {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

const addprivacySlice = createSlice({
  name: 'addPolicy',
  initialState: {
    isSubmitting: false,
    success: false,
    error: null,
  },
  reducers: {
    resetState: (state) => {
      state.isSubmitting = false;
      state.success = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPolicy.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(createPolicy.fulfilled, (state) => {
        state.isSubmitting = false;
        state.success = true;
      })
      .addCase(createPolicy.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
      });
  },
});

export const { resetState } = addprivacySlice.actions;
export default addprivacySlice.reducer;