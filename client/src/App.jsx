import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import {useDispatch} from 'react-redux'

import AuthLayout from "./components/auth-view/authLayout";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";

import Adminlayout from "./components/admin-view/layout";
import Dashboard from "./pages/admin/dashboard";
import Orders from "./pages/admin/orders";
import Products from "./pages/admin/products";

import Shoppinglayout from "./components/shooping-view/Layout";
import Home from "./pages/shooping/home";
import Account from "./pages/shooping/account";
import Listing from "./pages/shooping/listing";
import Checkout from "./pages/shooping/checkout";
import PaypalReturnPage from "./pages/shooping/paypal-return"
import PaypalCancelPage from './pages/shooping/paypal-cancel'

 import PaymentSuccess from './pages/shooping/payment-success'

import Checkauth from "./components/common/check-auth";
import Pagenotfound from "./pages/not-found/index";
import Unauthpage from "./pages/unauth-page/unauth-page";
import SearchProducts from "./pages/shooping/searchProducts"

import {checkAuth} from './store/store'


function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const user = useSelector((state) => state.auth.user);
    const loading=useSelector((state)=>state.auth.loading)
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(checkAuth()); 
    }, [dispatch]);
    console.log(loading)

    return (
        <Router>
            <Routes>
                <Route path="/auth" element={
                    <Checkauth isAuthenticated={isAuthenticated} user={user}>
                    <AuthLayout />
                    </Checkauth>
                }>
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                </Route>
                <Route path="/admin" element={
                    <Checkauth isAuthenticated={isAuthenticated} user={user}>
                    <Adminlayout />
                    </Checkauth>
                }>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="products" element={<Products />} />
                </Route>
                <Route path="/shop" element={
                    <Checkauth isAuthenticated={isAuthenticated} user={user}>
                    <Shoppinglayout />
                    </Checkauth>
                }>
                    <Route path="home" element={<Home />} />
                    <Route path="account" element={<Account />} />
                    <Route path="listing" element={<Listing />} />
                    <Route path="checkout" element={<Checkout />} />
                    <Route path="paypal-return" element={<PaypalReturnPage/>} />
                    <Route path="paypal-cancel" element={<PaypalCancelPage/>} />
                    <Route path="payment-success" element={<PaymentSuccess />} />
                    <Route path="search-products" element={<SearchProducts />} />

                </Route>
                <Route path="*" element={<Pagenotfound />} />
                <Route path="/unauth-page" element={<Unauthpage />} />
            </Routes>
        </Router>
    );
}

export default App;
