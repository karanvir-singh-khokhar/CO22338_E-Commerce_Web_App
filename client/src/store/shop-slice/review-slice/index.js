import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState={
    isLoading:false,
    reviews:[]
}
export const addReview = createAsyncThunk(
    "order/addReview",
    async (formData, { rejectWithValue}) => {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/shop/review/add`,formData);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data ||"error");
      }
    }
  );

export const getReview = createAsyncThunk(
    "order/getReview",
    async (productId, { rejectWithValue}) => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/review/${productId}`);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data ||"error" );
      }
    }
  );
  
const reviewsSlice=createSlice({
    name:"reviewsSlice",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(getReview.pending,(state)=>{
            state.isLoading=true;
        }).addCase(getReview.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.reviews=action.payload.data;
        }).addCase(getReview.rejected,(state)=>{
            state.isLoading=false;
            state.reviews=[]
        })
    }

})
export default reviewsSlice.reducer