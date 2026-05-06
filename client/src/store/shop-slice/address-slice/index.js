import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  addressList: [],
};

export const addAddress = createAsyncThunk(
  'address/addAddress',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/shop/address/add`, formData);
      return response.data;
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);

export const fetchAllAddress = createAsyncThunk(
  'address/fetchAllAddress',
  async ({ userId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/address/get/${userId}`);
      return response.data;
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);

export const editAddress = createAsyncThunk(
  'address/editAddress',
  async ({ userId, addressId, ...formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/shop/address/edit/${userId}/${addressId}`,formData
      );
      return response.data;
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);


export const deleteAddress = createAsyncThunk(
  'address/deleteAddress',
  async ({ userId, addressId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/shop/address/delete/${userId}/${addressId}`);
      return response.data;
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload.data;
      })
      .addCase(addAddress.rejected, (state) => {
        state.isLoading = false;
        toast.error("Failed to add address");
      })

      .addCase(fetchAllAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllAddress.fulfilled, (state, action) => {
        console.log("EDIT SUCCESS PAYLOAD:", action.payload);
        state.isLoading = false;
        state.addressList = action.payload.data;
      })
      .addCase(fetchAllAddress.rejected, (state) => {
        state.isLoading = false;
        toast.error("Failed to fetch address");
      })

      .addCase(editAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload.data;
      })
      .addCase(editAddress.rejected, (state) => {
        state.isLoading = false;
        toast.error("Failed to edit address");
      })

      .addCase(deleteAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload.data;
      })
      .addCase(deleteAddress.rejected, (state) => {
        state.isLoading = false;
        toast.error("Failed to delete address");
      });
  },
});

export default addressSlice.reducer;
