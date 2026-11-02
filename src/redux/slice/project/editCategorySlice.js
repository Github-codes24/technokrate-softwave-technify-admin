import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Fetch Single Category by ID
export const fetchCategoryById = createAsyncThunk(
  "category/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/admin/projectCategory/getProjectCategorybyId/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch category");
    }
  }
);

// Update Category
export const updateCategory = createAsyncThunk(
  "category/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${BASE_URL}/admin/projectCategory/getProjectCategorybyId/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Update failed");
    }
  }
);

const editCategorySlice = createSlice({
  name: "editCategory",
  initialState: {
    category: null,
    loading: false,
    updateLoading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetEditState: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cases
      .addCase(fetchCategoryById.pending, (state) => { state.loading = true; })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.category = action.payload.data;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Cases
      .addCase(updateCategory.pending, (state) => { state.updateLoading = true; })
      .addCase(updateCategory.fulfilled, (state) => {
        state.updateLoading = false;
        state.success = true;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetEditState } = editCategorySlice.actions;
export default editCategorySlice.reducer;