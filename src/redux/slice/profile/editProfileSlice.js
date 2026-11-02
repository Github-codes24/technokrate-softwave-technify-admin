




// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// // Async thunk for API call
// export const updateAdminProfile = createAsyncThunk(
//   "profile/updateAdmin",
//   async (formData, { rejectWithValue }) => {
//     try {
//       // 1. LocalStorage se token nikalna
//       const token = localStorage.getItem("token"); 

//       const response = await fetch(
//         "https://softwave-technify-be-2wbg.onrender.com/api/admin/login/update",
//         {
//           method: "PUT", 
//           headers: {
//             "Content-Type": "application/json",
//             // 2. Authorization header add karna
//             "Authorization": `Bearer ${token}`, 
//           },
//           body: JSON.stringify(formData),
//         }
//       );

//       const data = await response.json();

//       // Agar token invalid hai ya expire ho gaya hai (401 Unauthorized)
//       if (response.status === 401) {
//         return rejectWithValue("Session expired. Please login again.");
//       }

//       if (!response.ok) return rejectWithValue(data.message || "Update failed");
      
//       return data;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// const editProfileSlice = createSlice({
//   name: "editProfile",
//   initialState: {
//     loading: false,
//     success: false,
//     error: null,
//     adminData: null, // Optional: updated data store karne ke liye
//   },
//   reducers: {
//     resetStatus: (state) => {
//       state.success = false;
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(updateAdminProfile.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateAdminProfile.fulfilled, (state, action) => {
//         state.loading = false;
//         state.success = true;
//         state.adminData = action.payload; // Response data save karna
//       })
//       .addCase(updateAdminProfile.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { resetStatus } = editProfileSlice.actions;
// export default editProfileSlice.reducer;







// in this api also have existing data jo admin ka existing data rahega vo bhi aayega if verify otp
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
// 1. Current Profile Fetch karne ke liye Thunk (Purana data lane ke liye)
export const getAdminProfile = createAsyncThunk(
  "profile/getAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BASE_URL}/admin/profile`, 
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || "Failed to fetch profile");
      
      // Maan lete hain data 'data' ya 'admin' field mein aa raha hai
      return data.admin || data.data || data; 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 2. Update karne ke liye Thunk
export const updateAdminProfile = createAsyncThunk(
  "profile/updateAdmin",
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://softwave-technify-be-2wbg.onrender.com/api/admin/login/update",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (response.status === 401) return rejectWithValue("Session expired.");
      if (!response.ok) return rejectWithValue(data.message || "Update failed");
      
      return data.admin || data.data || data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const editProfileSlice = createSlice({
  name: "editProfile",
  initialState: {
    loading: false,
    success: false,
    error: null,
    adminData: null, // Yahan database se aaya purana data save hoga
  },
  reducers: {
    resetStatus: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile Logic
      .addCase(getAdminProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAdminProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.adminData = action.payload; // Data milte hi yahan save ho jayega
      })
      .addCase(getAdminProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Profile Logic
      .addCase(updateAdminProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdminProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.adminData = action.payload; 
      })
      .addCase(updateAdminProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetStatus } = editProfileSlice.actions;
export default editProfileSlice.reducer;