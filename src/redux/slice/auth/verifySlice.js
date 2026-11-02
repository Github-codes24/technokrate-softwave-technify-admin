import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const verifyAdminOtp = createAsyncThunk(
  "auth/verifyAdminOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/admin/login/login-admin/verify`,
        { email, otp }, 
      );

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("admin", JSON.stringify(response.data.admin));
      }

      toast.success("Login Successful!");
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Invalid OTP";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

const defaultAdmin = {
  _id: "6992db642e2d0af8fc8d14a2",
  name: "Chetan Chitriv",
  email: "chitrivchetan35@gmail.com",
  phone: "8381009662",
  role: "admin",
  isAdmin: true,
  isActive: true
};

const getInitialAdminData = () => {
  try {
    const item = localStorage.getItem("admin");
    return item && item !== "undefined" ? JSON.parse(item) : defaultAdmin;
  } catch (error) {
    return defaultAdmin;
  }
};

const verifySlice = createSlice({
  name: "verify",
  initialState: {
    loading: false,
    isVerified: false,
    adminData: getInitialAdminData(),
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      localStorage.removeItem("admin");
      state.adminData = null;
      state.isVerified = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyAdminOtp.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyAdminOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.isVerified = true;
        state.adminData = action.payload.admin;
      })
      .addCase(verifyAdminOtp.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { logout } = verifySlice.actions;
export default verifySlice.reducer;
