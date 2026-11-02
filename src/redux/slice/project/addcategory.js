import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const addcategory = createAsyncThunk(
  "category/addcategory",
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

     
      const response = await axios.post(
        `${BASE_URL}/admin/projectCategory/createProjectCategory`,
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

const addCategorySlice = createSlice({
  name: "addCategory",
  initialState: {
    categories: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetCategoryState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addcategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addcategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.categories = [...state.categories, action.payload.data];
      })
      .addCase(addcategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetCategoryState } = addCategorySlice.actions;
export default addCategorySlice.reducer;