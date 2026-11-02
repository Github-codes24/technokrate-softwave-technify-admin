import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const addproject = createAsyncThunk(
  "project/addproject",
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      

      const response = await axios.post(
        `${BASE_URL}/admin/project/createProject`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const getCategoryDropdown = createAsyncThunk(
  "project/getCategoryDropdown",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/admin/projectCategory/getProjectCategorybyName`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  }
);

const addProjectSlice = createSlice({
  name: "addProject",
  initialState: {
    projects: [],
    categories: [],
    loading: false,
    categoriesLoading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetProjectState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addproject.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addproject.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.projects = [...state.projects, action.payload.data];
      })
      .addCase(addproject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(getCategoryDropdown.pending, (state) => {
        state.categoriesLoading = true;
      })
      .addCase(getCategoryDropdown.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload.data || [];
      })
      .addCase(getCategoryDropdown.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetProjectState } = addProjectSlice.actions;
export default addProjectSlice.reducer;