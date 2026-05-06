import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import axios from "axios";



const initialState={
    orderList:[],
    orderDetails:null,
    isLoading:false
}
export const getAllOrdersAllUsers=createAsyncThunk('/orders/getAllOrdersAllUsers',async()=>{
    const response=await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/orders/get`)
    return response.data;
  })
  
  export const getOrderDetailForAdmin=createAsyncThunk('/orders/getOrderDetailForAdmin',async(id)=>{
    const response=await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/orders/details/${id}`)
    return response.data;
  })

  export const updateOrderStatus=createAsyncThunk('/orders/updateOrderStatus',async({id,orderStatus})=>{
    const response=await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/orders/update/${id}`,
      {
        orderStatus
      }
    )
    return response.data;
  })

  const adminOrderSlice=createSlice({
    name:'adminOrderSlice',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(getAllOrdersAllUsers.pending, (state) => {
                    state.isLoading = true;
                  })
                  .addCase(getAllOrdersAllUsers.fulfilled, (state, action) => {
                    state.isLoading = false;
                    state.orderList = action.payload.data;
                  })
                  .addCase(getAllOrdersAllUsers.rejected, (state) => {
                    state.isLoading = false;
                    state.orderList=[]
                  }).addCase(getOrderDetailForAdmin.pending, (state) => {
                    state.isLoading = true;
                  })
                  .addCase(getOrderDetailForAdmin.fulfilled, (state, action) => {
                    state.isLoading = false;
                    state.orderDetails = action.payload.data;
                    
                  })
                  .addCase(getOrderDetailForAdmin.rejected, (state) => {
                    state.isLoading = false;
                    state.orderDetails=null
                  })

    }
  })

  export default adminOrderSlice.reducer