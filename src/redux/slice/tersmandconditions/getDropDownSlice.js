import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchPolicyDropdown = createAsyncThunk(
  'policy/fetchDropdown',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/terms-policy/get-policy-dropdown`);
      return response.data; // This returns the { success, message, data } object
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const getDropDownSlice = createSlice({
  name: 'policyDropdown',
  initialState: {
    options: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPolicyDropdown.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPolicyDropdown.fulfilled, (state, action) => {
        state.isLoading = false;
        state.options = action.payload.data; // Storing only the array of strings
      })
      .addCase(fetchPolicyDropdown.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default getDropDownSlice.reducer;