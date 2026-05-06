import { configureStore } from "@reduxjs/toolkit";
import authSlice, { setUser, logoutUser } from "./auth-slice/index";
import adminProductSlice from "../store/admin-slice/products/index";
import shoopingProductslice from "../store/shop-slice/products/index"
import shoppingCartSlice from'../store/shop-slice/cart/index'
import { apiRequest } from "../store/api";
import addressSlice from "../store/shop-slice/address-slice/index"
import shoopingOrderSlice from '../store/shop-slice/order-slice/index'
import adminOrderSlice from '../store/admin-slice/order-slice/index'
import searchSlice from '../store/shop-slice/search-slice/index'
 import reviewsSlice from '../store/shop-slice/review-slice/index'

const store = configureStore({
  reducer: {
    auth: authSlice,
    adminProduct: adminProductSlice,
    shoppingProduct: shoopingProductslice,
    shoppingCart: shoppingCartSlice,
    address: addressSlice,
    shopOrder:shoopingOrderSlice,
    adminOrder:adminOrderSlice,
    search:searchSlice,
    reviews:reviewsSlice,
  },
});

export const checkAuth = () => async (dispatch) => {
  try {
    const data = await apiRequest(`${import.meta.env.VITE_API_URL}/api/check-auth`);
    if (data.success) {
      dispatch(
        setUser({
          user: data.user,
          role: data.user.role,
          token: data.token,
        })
      );
    } else {
      dispatch(logoutUser());
    }
  } catch (error) {
    if (error.response?.status === 401) {
      dispatch(logoutUser());
    }
  }
};

export default store;
