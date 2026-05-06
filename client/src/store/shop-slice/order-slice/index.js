import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState={
    approvalUrl:null,
    isLoading:false,
    orders:null,
    orderList:[],
    orderDetails:null
}
export const createNewOrder=createAsyncThunk('/order/creatNewOrder',async(orderData)=>{
    const response=await axios.post(`${import.meta.env.VITE_API_URL}/api/shop/orders/create`,orderData)
    return response.data;
})
export const capturePayment=createAsyncThunk('/order/capturePayment',async({paymentId,payerId,orderId})=>{
    const response=await axios.post(`${import.meta.env.VITE_API_URL}/api/shop/orders/capture`,
        {
            paymentId,
            payerId,
            orderId
        }
    )
    return response.data;
})
export const getAllOrdersByUser=createAsyncThunk('/order/getAllOrdersByUser',async(userId)=>{
  const response=await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/orders/list/${userId}`)
  return response.data;
})

export const getOrderDetail=createAsyncThunk('/order/getOrderDetail',async(id)=>{
  const response=await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/orders/details/${id}`)
  return response.data;
})
const  shoopingOrderSlice=createSlice({
    name:"shoopingOrderSlice",
    initialState,
    reducers:{
        resetPaypalSession: (state) => {
            state.approvalUrl = null;
            state.orderId = null;
            state.isLoading = false;
          }
        
    },
    extraReducers: (builder) => {
        builder
          .addCase(createNewOrder.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(createNewOrder.fulfilled, (state, action) => {
            state.isLoading = false;
            state.approvalUrl = action.payload.approval_url;
            state.orderId = action.payload.orderId;
            sessionStorage.setItem("currentOrderId", JSON.stringify(action.payload.orderId));
          })
          .addCase(createNewOrder.rejected, (state) => {
            state.isLoading = false;
            state.approvalUrl = null;
            state.orderId = null;
          })
    
          .addCase(capturePayment.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(capturePayment.fulfilled, (state, action) => {
            state.isLoading = false;
            state.orders = action.payload.data  || null;
          })
          .addCase(capturePayment.rejected, (state) => {
            state.isLoading = false;
          }).addCase(getAllOrdersByUser.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(getAllOrdersByUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.orderList = action.payload.data;
          })
          .addCase(getAllOrdersByUser.rejected, (state) => {
            state.isLoading = false;
            state.orderList=[]
          }).addCase(getOrderDetail.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(getOrderDetail.fulfilled, (state, action) => {
            state.isLoading = false;
            state.orderDetails = action.payload.data;
            
          })
          .addCase(getOrderDetail.rejected, (state) => {
            state.isLoading = false;
            state.orderDetails=null
          })
      }
    

})
export const { resetPaypalSession } = shoopingOrderSlice.actions;
export default shoopingOrderSlice.reducer