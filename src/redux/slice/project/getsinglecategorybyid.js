import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;


const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};


export const fetchCategoryDetail = createAsyncThunk(
  "category/fetchCategoryDetail",
  async (categoryId, { rejectWithValue }) => {
    try {
      console.log("Fetching category details for ID:", categoryId);
      
     
      const response = await axios.get(
        `${BASE_URL}/admin/projectCategory/getProjectCategorybyId/${categoryId}`,
        {
          headers: getAuthHeader()
        }
      );
      
      console.log("API Response:", response.data);
      if (response.data.success && response.data.data) {
        return response.data.data; 
      }
      
      return rejectWithValue("Invalid response format");
      
    } catch (error) {
      console.error("API Error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch category details"
      );
    }
  }
);

const singleCategorySlice = createSlice({
  name: "singleCategory",
  initialState: {
    categoryData: null, 
    loading: false,
    error: null,
  },
  reducers: {
    clearCategoryState: (state) => {
      state.categoryData = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchCategoryDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryData = action.payload; 
        state.error = null;
      })
      .addCase(fetchCategoryDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.categoryData = null;
      });
  },
});

export const { clearCategoryState } = singleCategorySlice.actions;
export default singleCategorySlice.reducer;