

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const sendLoginOtp = createAsyncThunk(
  "auth/sendLoginOtp",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/admin/login/login-admin/otp`,
        { email } // Payload updated to email
      );
      return { email, otp: response.data.message }; 
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const loginSlice = createSlice({
  name: "login",
  initialState: {
    loading: false,
    email: "", // Changed from phone
    receivedOtp: "", 
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendLoginOtp.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendLoginOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.email = action.payload.email;
        state.receivedOtp = action.payload.otp;
      })
      .addCase(sendLoginOtp.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default loginSlice.reducer;