import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  searchResults: []
};

export const searchProducts = createAsyncThunk(
  "Products/searchProducts",
  async (keyword, { rejectWithValue}) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/search/${keyword}`);
      console.log("Fetched Products:", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching products");
    }
  }
);

const searchSlice = createSlice({
  name: 'searchSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload.data;
      })
      .addCase(searchProducts.rejected, (state) => {
        state.isLoading = false;
      });
  }
});

export default searchSlice.reducer;
