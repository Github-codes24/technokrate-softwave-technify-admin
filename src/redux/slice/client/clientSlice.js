// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
// const BASE_URL = import.meta.env.VITE_API_BASE_URL;
// export const fetchClientLeads = createAsyncThunk(
//   "clients/fetchLeads",
//   async (_, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem("token"); // Getting token from localStorage
//       const response = await axios.get(
//         `${BASE_URL}/admin/leads/getAllClientLeads`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// const clientSlice = createSlice({
//   name: "clients",
//   initialState: {
//     leads: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchClientLeads.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchClientLeads.fulfilled, (state, action) => {
//         state.loading = false;
//         state.leads = action.payload.data;
//       })
//       .addCase(fetchClientLeads.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export default clientSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchClientLeads = createAsyncThunk(
  "clients/fetchLeads",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/admin/leads/getAllClientLeads`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

// ✅ Delete Lead Thunk
export const deleteClientLead = createAsyncThunk(
  "clients/deleteLead",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      // ✅ Fix: axios.put(url, body, config) — headers config mein alag jana chahiye
      await axios.put(
        `${BASE_URL}/admin/leads/deleteLead/${id}`,
        {}, // body empty
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

const clientSlice = createSlice({
  name: "clients",
  initialState: {
    leads: [],
    loading: false,
    deleteLoading: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchClientLeads.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchClientLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = action.payload.data;
      })
      .addCase(fetchClientLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteClientLead.pending, (state, action) => {
        state.deleteLoading = action.meta.arg;
      })
      .addCase(deleteClientLead.fulfilled, (state, action) => {
        state.deleteLoading = null;
        state.leads = state.leads.filter((item) => item._id !== action.payload);
      })
      .addCase(deleteClientLead.rejected, (state, action) => {
        state.deleteLoading = null;
        state.error = action.payload;
      });
  },
});

export default clientSlice.reducer;
