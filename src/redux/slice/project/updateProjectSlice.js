import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Update Project Thunk
export const updateProject = createAsyncThunk(
  'project/updateProject',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      // Note: Make sure BASE_URL doesn't end with / if your path starts with /
      const response = await axios.put(
        `${BASE_URL}/admin/project/projectupdatebyId/${id}`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

const updateProjectSlice = createSlice({
  name: 'updateProject',
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
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetUpdateState } = updateProjectSlice.actions;
export default updateProjectSlice.reducer;