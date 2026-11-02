// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// export const fetchLeadStatusDropdown = createAsyncThunk(
//   "leadDropdown/fetchStatus",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(
//         "https://softwave-technify-be-2wbg.onrender.com/api/admin/leads/getLeadStatusDropdown"
//       );
//       // Assuming API returns { success: true, data: [...] } ya direct array
//       return response.data.data || response.data; 
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Failed to fetch dropdown");
//     }
//   }
// );

// const leadDropdownSlice = createSlice({
//   name: "leadDropdown",
//   initialState: {
//     statuses: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchLeadStatusDropdown.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchLeadStatusDropdown.fulfilled, (state, action) => {
//         state.loading = false;
//         state.statuses = action.payload;
//       })
//       .addCase(fetchLeadStatusDropdown.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export default leadDropdownSlice.reducer;







import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://softwave-technify-be-xbff.onrender.com/api";

export const fetchLeadStatusDropdown = createAsyncThunk(
  "leadDropdown/fetchStatus",
  async (_, { rejectWithValue }) => {
    try {
      // LocalStorage se token nikalna
      const token = localStorage.getItem("token"); // 'token' ki jagah wo key use karein jo aapne set ki hai

      const response = await axios.get(
        `${BASE_URL}/admin/leads/getLeadStatusDropdown`,
        {
          headers: {
            // Authentication Header add kiya
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // API structure ke according data return karna
      return response.data.data || response.data;
    } catch (error) {
      // Error handling agar token expire ho ya server issue ho
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dropdown"
      );
    }
  }
);

const leadDropdownSlice = createSlice({
  name: "leadDropdown",
  initialState: {
    statuses: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeadStatusDropdown.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeadStatusDropdown.fulfilled, (state, action) => {
        state.loading = false;
        state.statuses = action.payload;
      })
      .addCase(fetchLeadStatusDropdown.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default leadDropdownSlice.reducer;