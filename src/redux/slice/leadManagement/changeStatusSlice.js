
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
// const BASE_URL = import.meta.env.VITE_API_BASE_URL;
// // Async thunk to update lead status
// export const updateLeadStatusApi = createAsyncThunk(
//   "lead/updateStatus",
//   // here we pass status and reason to do reject in the lead 
//   async ({ id, status,reason }, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem("token"); // Token from localStorage
//       const response = await axios.patch(
//         `${BASE_URL}/admin/leads/updateStatus/${id}`,
//         { status,reason }, // Body
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to update status"
//       );
//     }
//   }
// );

// const changeStatusSlice = createSlice({
//   name: "changeStatus",
//   initialState: {
//     loading: false,
//     success: false,
//     error: null,
//   },
//   reducers: {
//     resetStatusState: (state) => {
//       state.loading = false;
//       state.success = false;
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(updateLeadStatusApi.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateLeadStatusApi.fulfilled, (state) => {
//         state.loading = false;
//         state.success = true;
//       })
//       .addCase(updateLeadStatusApi.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { resetStatusState } = changeStatusSlice.actions;
// export default changeStatusSlice.reducer;








import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://softwave-technify-be-xbff.onrender.com/api";
// Async thunk to update lead status
export const updateLeadStatusApi = createAsyncThunk(
  "lead/updateStatus",
  // here we pass status and reason to do reject in the lead 
  async ({ id, status,reason }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token"); // Token from localStorage
      const response = await axios.patch(
        `${BASE_URL}/admin/leads/updateStatus/${id}`,
        { status,reason }, // Body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update status"
      );
    }
  }
);

const changeStatusSlice = createSlice({
  name: "changeStatus",
  initialState: {
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    resetStatusState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateLeadStatusApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLeadStatusApi.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updateLeadStatusApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetStatusState } = changeStatusSlice.actions;
export default changeStatusSlice.reducer;