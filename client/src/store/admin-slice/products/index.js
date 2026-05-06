import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
  error: null,
  lastUpdated: null, // Track last update time
  isAuthenticated: true, // Assuming authentication state
  user: null,
  role: null,
  token: null,
};

export const findAllProduct = createAsyncThunk(
  "adminProduct/findAllProduct",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/products/all_product`);
      console.log("Fetched Products:", response.data.products); 
      return response.data.products;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching products");
    }
  }
);

export const addNewProduct = createAsyncThunk(
  "adminProduct/addNewProduct",
  async (formData, { rejectWithValue }) => {
    try {
      console.log(" Sending Data to Backend:", formData);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/products/add`, formData);
      console.log(" Response from Backend:", response.data);
      return response.data;
    } catch (error) {
      console.error(" Error in addNewProduct:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || "Error adding product");
    }
  }
);

export const updateProduct = createAsyncThunk(
  "adminProduct/updateProduct",
  async ({ id, updatedProduct }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/products/edit/${id}`,
        updatedProduct
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error updating product");
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "adminProduct/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/products/delete/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error deleting product");
    }
  }
);

const adminProductSlice = createSlice({
  name: "adminProduct",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(findAllProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(findAllProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(findAllProduct.rejected, (state, action) => {
        console.error("findAllProduct rejected:", action.payload);
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch products";
      })
      .addCase(addNewProduct.fulfilled, (state, action) => {
        state.productList.push(action.payload);
      })
      .addCase(addNewProduct.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const updatedProduct = action.payload;
        const index = state.productList.findIndex((p) => p._id === updatedProduct._id);
        if (index !== -1) {
          state.productList[index] = updatedProduct;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.productList = state.productList.filter((p) => p._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { logoutUser } = adminProductSlice.actions; 

export default adminProductSlice.reducer;
