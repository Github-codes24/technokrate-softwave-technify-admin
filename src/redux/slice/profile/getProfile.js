// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// // API Fetching Thunk
// export const fetchProfile = createAsyncThunk("profile/fetchProfile", async (_, { rejectWithValue }) => {
//   try {
//     const token = localStorage.getItem("token"); // Assuming you store token here
//     const response = await axios.get("https://softwave-technify-be-2wbg.onrender.com/api/admin/login/get-admin", {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//     return response.data.data;
//   } catch (error) {
//     return rejectWithValue(error.response.data.message || "Something went wrong");
//   }
// });

// const profileSlice = createSlice({
//   name: "profile",
//   initialState: {
//     adminData: null,
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchProfile.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchProfile.fulfilled, (state, action) => {
//         state.loading = false;
//         state.adminData = action.payload;
//       })
//       .addCase(fetchProfile.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export default profileSlice.reducer;






import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const fetchProfile = createAsyncThunk("profile/fetchProfile", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token"); 
    const response = await axios.get(`${BASE_URL}/admin/login/get-admin`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Something went wrong");
  }
});

const profileSlice = createSlice({
  name: "profile",
  initialState: { adminData: null, loading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => { state.loading = true; })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.adminData = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default profileSlice.reducer;