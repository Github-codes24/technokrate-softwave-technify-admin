import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchAllProjectCategory = createAsyncThunk(
    "projectCategory/fetchAllProjectCategory",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${BASE_URL}/admin/projectCategory/getallProjectCategories`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

const getAllProjectCategorySlice = createSlice({
    name: "allProjectCategories",
    initialState: {
        projectCategories: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllProjectCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllProjectCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.projectCategories = action.payload.data; // Accessing the "data" array from response
            })
            .addCase(fetchAllProjectCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default getAllProjectCategorySlice.reducer;