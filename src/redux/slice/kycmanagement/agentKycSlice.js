import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchAllUserStatus = createAsyncThunk(
  "userStatus/fetchAll",
  async (_, { getState, rejectWithValue }) => {
    try {
      // Current state se filters uthayenge
      const { currentFilters } = getState().userkyc;
      const token = localStorage.getItem("token");
      
      const response = await fetch(
        `${BASE_URL}/admin/user-status/all?page=${currentFilters.page}&limit=${currentFilters.limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || "Failed to fetch");
      return data; 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userStatusSlice = createSlice({
  name: "userStatus",
  initialState: {
    users: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalUsers: 0,
      limit: 10,
    },
    currentFilters: { 
      page: 1, 
      limit: 10 
    },
    loading: false,
    error: null,
  },
  reducers: {
    setKycFilters: (state, action) => {
      state.currentFilters = { ...state.currentFilters, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUserStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllUserStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalUsers: action.payload.totalUsers,
          limit: state.currentFilters.limit
        };
      })
      .addCase(fetchAllUserStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setKycFilters } = userStatusSlice.actions;
export default userStatusSlice.reducer;