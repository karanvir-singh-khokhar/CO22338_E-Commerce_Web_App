import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const fetchAllFilteredProducts = createAsyncThunk(
    "Products/fetchAllFilteredProducts",
    async ({ filters, sortBy }, { rejectWithValue }) => {
      try {
        const params = new URLSearchParams();
        if(filters?.category)params.append("category",filters.category.join(","))
        if(filters?.brand) params.append("brand",filters.brand.join(","))
        if(sortBy)params.append("sortedBy", sortBy)
          
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/products?${params.toString()}`);
        console.log("Fetched Products:", response.data.products); 
        return response.data.products;
      } catch (error) {
        return rejectWithValue(error.response?.data || "Error fetching products");
      }
    }
  );
  export const getProductDetails = createAsyncThunk(
    "Products/getProductDetails",
    async (id,{ rejectWithValue }) => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/products/${id}`);
        console.log("Fetched Products:", response.data.products); 
        return response.data.product;
      } catch (error) {
        return rejectWithValue(error.response?.data || "Error fetching products");
      }
    }
  );
const shoopingProductslice=createSlice({
    name:"shoppingProducts",
    initialState:{
        isLoading:false,
        productList: [],
        productDetails:null
    },
    reducers:{
      setProductDetails:(state)=>{
        state.productDetails=null
      }
    },
    extraReducers: (builder) =>{
        builder.addCase(fetchAllFilteredProducts.pending,(state,action)=>{
            state.isLoading=true;
        }).addCase(fetchAllFilteredProducts.fulfilled,(state,action)=>{
            console.log(action.payload,"action.payload")
            state.isLoading=false;
            state.productList=action.payload;
        }).addCase(fetchAllFilteredProducts.rejected,(state,action)=>{
            state.isLoading=false;
            state.productList=[];
        }),
        builder.addCase(getProductDetails.pending,(state,action)=>{
          state.isLoading=true;
      }).addCase(getProductDetails.fulfilled,(state,action)=>{
          state.isLoading=false;
          state.productDetails=action.payload;
      }).addCase(getProductDetails.rejected,(state,action)=>{
          state.isLoading=false;
          state.productDetails=null;
      })

    }
})
export const {setProductDetails}=shoopingProductslice.actions
export default shoopingProductslice.reducer