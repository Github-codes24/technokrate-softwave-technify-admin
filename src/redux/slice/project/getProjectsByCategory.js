import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;


const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};


export const fetchCategoryDetail = createAsyncThunk(
  "project/fetchCategoryDetail",
  async (categoryId, { rejectWithValue }) => {
    try {
      console.log("Fetching category details for ID:", categoryId);
      
           const response = await axios.get(
        `${BASE_URL}/admin/projectCategory/getProjectCategorybyId/${categoryId}`,
        {
          headers: getAuthHeader()
        }
      );
      
      console.log("Category API Response:", response.data);
      
      
      if (response.data.success && response.data.data) {
        return response.data.data; 
      }
      
      return rejectWithValue("Invalid response format");
      
    } catch (error) {
      console.error("Category API Error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch category details"
      );
    }
  }
);
export const toggleProjectStatus = createAsyncThunk(
  "project/toggleProjectStatus",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/admin/project/toggle-status/${id}`,
        {}, 
        { headers: getAuthHeader() }
      );
      // API response se naya status bhej rahe hain
      return { id, status: response.data.data.status }; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Status update failed");
    }
  }
);

export const fetchProjectsByCategory = createAsyncThunk(
  "project/fetchProjectsByCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      console.log("Fetching projects for category:", categoryId);
      
     
      const response = await axios.get(
        `${BASE_URL}/admin/project/getProjectsByCategory`,
        {
          params: { categoryId }, 
          headers: getAuthHeader()
        }
      );
      
      console.log("Projects API Response:", response.data);
      
      
      return response.data.data || [];
      
    } catch (error) {
      console.error("Projects API Error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch projects by category"
      );
    }
  }
);


export const updateProject = createAsyncThunk(
  "project/updateProject",
  async ({ id, price, features }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/admin/project/projectupdatebyId/${id}`,
        { price, features },
        { headers: getAuthHeader() }
      );
      return { id, price, features, message: response.data.message };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update project"
      );
    }
  }
);

const singleProjectSlice = createSlice({
  name: "singleProject",
  initialState: {
    categoryData: null, 
    projects: [], 
    categoryLoading: false,
    projectsLoading: false,
    updateLoading: false,
    categoryError: null,
    projectsError: null,
    loadingProjectId: null,
  },
  reducers: {
    clearProjectState: (state) => {
      state.categoryData = null;
      state.projects = [];
      state.categoryError = null;
      state.projectsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchCategoryDetail.pending, (state) => {
        state.categoryLoading = true;
        state.categoryError = null;
      })
      .addCase(fetchCategoryDetail.fulfilled, (state, action) => {
        state.categoryLoading = false;
        state.categoryData = action.payload; // Stores { category, maxPrice, minPrice }
        state.categoryError = null;
      })
      .addCase(fetchCategoryDetail.rejected, (state, action) => {
        state.categoryLoading = false;
        state.categoryError = action.payload;
        state.categoryData = null;
      })
      
      
      .addCase(fetchProjectsByCategory.pending, (state) => {
        state.projectsLoading = true;
        state.projectsError = null;
      })
      .addCase(fetchProjectsByCategory.fulfilled, (state, action) => {
        state.projectsLoading = false;
        state.projects = action.payload;
        state.projectsError = null;
      })
      .addCase(fetchProjectsByCategory.rejected, (state, action) => {
        state.projectsLoading = false;
        state.projectsError = action.payload;
        state.projects = [];
      })
      
      
      .addCase(updateProject.pending, (state) => {
        state.updateLoading = true;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.updateLoading = false;
        
        if (state.projects?.length > 0) {
          const projectIndex = state.projects.findIndex(
            (p) => p._id === action.payload.id
          );
          if (projectIndex !== -1) {
            state.projects[projectIndex] = {
              ...state.projects[projectIndex],
              price: action.payload.price,
              features: action.payload.features,
            };
          }
        }
      })
      .addCase(updateProject.rejected, (state) => {
        state.updateLoading = false;
      })
      .addCase(toggleProjectStatus.pending, (state,action) => {
        state.updateLoading = true;
        state.loadingProjectId = action.meta.arg;
      })
      .addCase(toggleProjectStatus.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.loadingProjectId = null;
        // State mein us specific project ka status update karna
        const index = state.projects.findIndex((p) => p._id === action.payload.id);
        if (index !== -1) {
          state.projects[index].status = action.payload.status;
        }
      })
      .addCase(toggleProjectStatus.rejected, (state) => {
        state.updateLoading = false;
        state.loadingProjectId = null;
      });

  },
});

export const { clearProjectState } = singleProjectSlice.actions;
export default singleProjectSlice.reducer;