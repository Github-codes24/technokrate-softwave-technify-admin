// // for search 
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// export const fetchAllVendors = createAsyncThunk(
//   "vendors/fetchAll",
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const { currentFilters } = getState().allVendors;
//       const token = localStorage.getItem("token");

//       if (!token) return rejectWithValue("No authentication token found");

//       // API call mein search parameter add kiya
//       let url = `${BASE_URL}/admin/vendor/getallVendors?page=${currentFilters.page}&limit=${currentFilters.limit}`;
      
//       if (currentFilters.search) {
//         url += `&search=${encodeURIComponent(currentFilters.search)}`;
//       }

//       const response = await axios.get(url, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       return response.data;
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || "Failed to fetch vendors";
//       return rejectWithValue(errorMessage);
//     }
//   }
// );

// const getallVendorsSlice = createSlice({
//   name: "allVendors",
//   initialState: {
//     vendors: [],
//     loading: false,
//     error: null,
//     pagination: {
//       currentPage: 1,
//       totalPages: 1,
//       totalVendors: 0,
//       limit: 10,
//     },
//     currentFilters: {
//       page: 1,
//       limit: 10,
//       search: "", // Naya search state
//     },
//   },
//   reducers: {
//     setVendorFilters: (state, action) => {
//       state.currentFilters = { ...state.currentFilters, ...action.payload };
//     },
//     clearError: (state) => {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchAllVendors.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchAllVendors.fulfilled, (state, action) => {
//         state.loading = false;
//         state.vendors = action.payload.data;
//         state.pagination = {
//           currentPage: action.payload.currentPage || state.currentFilters.page,
//           totalPages: action.payload.totalPages || 1,
//           totalVendors: action.payload.total || 0,
//           limit: state.currentFilters.limit,
//         };
//         state.error = null;
//       })
//       .addCase(fetchAllVendors.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { clearError, setVendorFilters } = getallVendorsSlice.actions;
// export default getallVendorsSlice.reducer;


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchAllVendors = createAsyncThunk(
  "vendors/fetchAll",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { currentFilters } = getState().allVendors;
      const token = localStorage.getItem("token");

      if (!token) return rejectWithValue("No authentication token found");

      let url = `${BASE_URL}/admin/vendor/getallVendors?page=${currentFilters.page}&limit=${currentFilters.limit}`;

      if (currentFilters.search) {
        url += `&search=${encodeURIComponent(currentFilters.search)}`;
      }
      if (currentFilters.dateFilter && currentFilters.dateFilter !== "All") {
        url += `&dateFilter=${encodeURIComponent(currentFilters.dateFilter)}`;
      }
      if (currentFilters.status && currentFilters.status.toLowerCase() !== "all") {
        url += `&status=${encodeURIComponent(currentFilters.status)}`;
      }

      if (currentFilters.date) {
        url += `&date=${encodeURIComponent(currentFilters.date)}`;
      }
      if (currentFilters.fromDate) {
        url += `&fromDate=${encodeURIComponent(currentFilters.fromDate)}`;
      }
      if (currentFilters.toDate) {
        url += `&toDate=${encodeURIComponent(currentFilters.toDate)}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch vendors";
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateVendorStatus = createAsyncThunk(
  "vendors/updateStatus",
  async (vendorId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return rejectWithValue("No authentication token found");

      const response = await axios.patch(
        `${BASE_URL}/admin/vendor/updateUserStatus/${vendorId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data; // { success, message, data: { _id, name, isActive } }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to update vendor status";
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteVendor = createAsyncThunk(
  "vendors/deleteVendor",
  async (vendorId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("No authentication token found");

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const baseUrlClean = (BASE_URL || "").replace(/\/+$/, "");
      const domainClean = baseUrlClean.replace(/\/api\/?$/, "");

      const candidateRequests = [
        // 1. Primary /admin/vendor/ endpoints
        { method: "delete", url: `${baseUrlClean}/admin/vendor/deleteVendor/${vendorId}` },
        { method: "post",   url: `${baseUrlClean}/admin/vendor/deleteVendor/${vendorId}` },
        { method: "put",    url: `${baseUrlClean}/admin/vendor/deleteVendor/${vendorId}` },
        { method: "patch",  url: `${baseUrlClean}/admin/vendor/deleteVendor/${vendorId}` },

        { method: "delete", url: `${baseUrlClean}/admin/vendor/delete/${vendorId}` },
        { method: "post",   url: `${baseUrlClean}/admin/vendor/delete/${vendorId}` },
        { method: "put",    url: `${baseUrlClean}/admin/vendor/delete/${vendorId}` },
        { method: "patch",  url: `${baseUrlClean}/admin/vendor/delete/${vendorId}` },

        { method: "delete", url: `${baseUrlClean}/admin/vendor/deleteUser/${vendorId}` },
        { method: "post",   url: `${baseUrlClean}/admin/vendor/deleteUser/${vendorId}` },
        { method: "put",    url: `${baseUrlClean}/admin/vendor/deleteUser/${vendorId}` },
        { method: "patch",  url: `${baseUrlClean}/admin/vendor/deleteUser/${vendorId}` },

        { method: "delete", url: `${baseUrlClean}/admin/vendor/${vendorId}` },
        { method: "post",   url: `${baseUrlClean}/admin/vendor/${vendorId}` },
        { method: "put",    url: `${baseUrlClean}/admin/vendor/${vendorId}` },
        { method: "patch",  url: `${baseUrlClean}/admin/vendor/${vendorId}` },

        // 2. Direct /vendor/ endpoints (without /admin)
        { method: "delete", url: `${baseUrlClean}/vendor/deleteVendor/${vendorId}` },
        { method: "post",   url: `${baseUrlClean}/vendor/deleteVendor/${vendorId}` },
        { method: "put",    url: `${baseUrlClean}/vendor/deleteVendor/${vendorId}` },
        { method: "patch",  url: `${baseUrlClean}/vendor/deleteVendor/${vendorId}` },

        { method: "delete", url: `${baseUrlClean}/vendor/delete/${vendorId}` },
        { method: "post",   url: `${baseUrlClean}/vendor/delete/${vendorId}` },
        { method: "put",    url: `${baseUrlClean}/vendor/delete/${vendorId}` },
        { method: "patch",  url: `${baseUrlClean}/vendor/delete/${vendorId}` },

        { method: "delete", url: `${baseUrlClean}/vendor/${vendorId}` },
        { method: "post",   url: `${baseUrlClean}/vendor/${vendorId}` },
        { method: "put",    url: `${baseUrlClean}/vendor/${vendorId}` },
        { method: "patch",  url: `${baseUrlClean}/vendor/${vendorId}` },

        // 3. Fallbacks with domainClean if BASE_URL didn't include /api
        { method: "delete", url: `${domainClean}/api/admin/vendor/deleteVendor/${vendorId}` },
        { method: "post",   url: `${domainClean}/api/admin/vendor/deleteVendor/${vendorId}` },
        { method: "put",    url: `${domainClean}/api/admin/vendor/deleteVendor/${vendorId}` },
        { method: "patch",  url: `${domainClean}/api/admin/vendor/deleteVendor/${vendorId}` },

        { method: "delete", url: `${domainClean}/api/vendor/deleteVendor/${vendorId}` },
        { method: "post",   url: `${domainClean}/api/vendor/deleteVendor/${vendorId}` },
        { method: "put",    url: `${domainClean}/api/vendor/deleteVendor/${vendorId}` },
        { method: "patch",  url: `${domainClean}/api/vendor/deleteVendor/${vendorId}` },
      ];

      let lastError = null;
      for (const req of candidateRequests) {
        try {
          let response;
          if (req.method === "delete") {
            response = await axios.delete(req.url, { headers });
          } else if (req.method === "post") {
            response = await axios.post(req.url, {}, { headers });
          } else if (req.method === "put") {
            response = await axios.put(req.url, {}, { headers });
          } else if (req.method === "patch") {
            response = await axios.patch(req.url, {}, { headers });
          }
          return { vendorId, data: response?.data };
        } catch (err) {
          lastError = err;
        }
      }

      throw lastError;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to delete vendor";
      return rejectWithValue(errorMessage);
    }
  }
);

const getallVendorsSlice = createSlice({
  name: "allVendors",
  initialState: {
    vendors: [],
    loading: false,
    error: null,
    statusUpdating: null, // tracks which vendor's status is being updated
    deleteLoading: null, // tracks which vendor is being deleted
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalVendors: 0,
      limit: 10,
    },
    currentFilters: {
      page: 1,
      limit: 10,
      search: "",
      date: "",
      fromDate: "",
      toDate: "",
    },
  },
  reducers: {
    setVendorFilters: (state, action) => {
      state.currentFilters = { ...state.currentFilters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllVendors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllVendors.fulfilled, (state, action) => {
        state.loading = false;
        const rawData = action.payload;
        const vendorsArray = Array.isArray(rawData?.data)
          ? rawData.data
          : Array.isArray(rawData?.data?.vendors)
          ? rawData.data.vendors
          : Array.isArray(rawData?.vendors)
          ? rawData.vendors
          : Array.isArray(rawData)
          ? rawData
          : [];

        state.vendors = vendorsArray;
        const total =
          rawData?.total ??
          rawData?.totalVendors ??
          rawData?.data?.total ??
          rawData?.data?.totalVendors ??
          vendorsArray.length ??
          0;

        state.pagination = {
          currentPage: rawData?.currentPage || rawData?.data?.currentPage || state.currentFilters.page || 1,
          totalPages: rawData?.totalPages || rawData?.data?.totalPages || Math.ceil(total / (state.currentFilters.limit || 10)) || 1,
          totalVendors: total,
          limit: state.currentFilters.limit || 10,
        };
        state.error = null;
      })
      .addCase(fetchAllVendors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Vendor Status
      .addCase(updateVendorStatus.pending, (state, action) => {
        state.statusUpdating = action.meta.arg; // vendorId
      })
      .addCase(updateVendorStatus.fulfilled, (state, action) => {
        state.statusUpdating = null;
        const updated = action.payload.data; // { _id, name, isActive }
        const index = state.vendors.findIndex((v) => v._id === updated._id);
        if (index !== -1) {
          state.vendors[index].isActive = updated.isActive;
        }
      })
      .addCase(updateVendorStatus.rejected, (state, action) => {
        state.statusUpdating = null;
        state.error = action.payload;
      })

      // Delete Vendor
      .addCase(deleteVendor.pending, (state, action) => {
        state.deleteLoading = action.meta.arg;
      })
      .addCase(deleteVendor.fulfilled, (state, action) => {
        state.deleteLoading = null;
        const deletedId = action.payload.vendorId;
        state.vendors = state.vendors.filter((v) => v._id !== deletedId);
        if (state.pagination.totalVendors > 0) {
          state.pagination.totalVendors -= 1;
        }
      })
      .addCase(deleteVendor.rejected, (state, action) => {
        state.deleteLoading = null;
        state.error = action.payload;
      });
  },
});

export const { clearError, setVendorFilters } = getallVendorsSlice.actions;
export default getallVendorsSlice.reducer;