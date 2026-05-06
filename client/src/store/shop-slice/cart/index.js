import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    cartItems: [],
    isLoading: false,
};

export const addToCart = createAsyncThunk('cart/addToCart', async ({ UserId, ProductId, quantity }, { dispatch, rejectWithValue }) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/shop/cart/add`, { UserId, ProductId, quantity });
        console.log("Added to cart:", response.data);
        dispatch(fetchCartItems({ UserId }));  // Fetch updated cart after adding
        return response.data;
    } catch (error) {
        console.error("Error adding to cart:", error.response?.data || error.message);
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
});

export const fetchCartItems = createAsyncThunk('cart/fetchCartItems', async ({ UserId }, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/cart/get/${UserId}`);
        console.log("Fetched Cart items:", response.data);
        return response.data.data;  
    } catch (error) {
        console.error("Error fetching cart items:", error.response?.data || error.message);
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
});

export const deleteToCart = createAsyncThunk(
    "cart/deleteToCart",
    async ({ UserId, ProductId }, { dispatch, rejectWithValue }) => {
        try {
            console.log("Deleting cart item:", UserId, ProductId); // Debugging log

            const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/shop/cart/${UserId}/${ProductId}`);

            if (response.data?.success) {
                dispatch(fetchCartItems({ UserId })); // Fetch updated cart after deleting
                return { ProductId };
            } else {
                return rejectWithValue(response.data.message || "Failed to delete item");
            }
        } catch (error) {
            console.error("Error deleting from cart:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);
export const updateToCart = createAsyncThunk('cart/updateToCart', async ({ UserId, ProductId, quantity }, { dispatch, rejectWithValue }) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/shop/cart/update-card`, { UserId, ProductId, quantity });
        dispatch(fetchCartItems({ UserId }));  // Fetch updated cart after updating
        return response.data.data;
    } catch (error) {
        console.error("Error updating cart:", error.response?.data || error.message);
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
});

// Redux Slice
const shoppingCartSlice = createSlice({
    name: "shoppingCart",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addToCart.pending, (state) => { state.isLoading = true; })
            .addCase(addToCart.fulfilled, (state, action) => { state.isLoading = false; state.cartItems = action.payload || []; })
            .addCase(addToCart.rejected, (state) => { state.isLoading = false; })

            .addCase(fetchCartItems.pending, (state) => { state.isLoading = true; })
            .addCase(fetchCartItems.fulfilled, (state, action) => { state.isLoading = false; state.cartItems = action.payload || []; })
            .addCase(fetchCartItems.rejected, (state) => { state.isLoading = false; })

            .addCase(deleteToCart.pending, (state) => { state.isLoading = true; })
            .addCase(deleteToCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = state.cartItems.filter(item => item.ProductId._id !== action.payload.ProductId);
            })
            .addCase(deleteToCart.rejected, (state) => { state.isLoading = false; })

            .addCase(updateToCart.pending, (state) => { state.isLoading = true; })
            .addCase(updateToCart.fulfilled, (state, action) => { state.isLoading = false; state.cartItems = action.payload || []; })
            .addCase(updateToCart.rejected, (state) => { state.isLoading = false; });
    }
});

export default shoppingCartSlice.reducer;
