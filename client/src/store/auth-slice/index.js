import { createSlice } from "@reduxjs/toolkit";

const removeCookies = () => {
    document.cookie.split(";").forEach((cookie) => {
        const cookieName = cookie.split("=")[0].trim(); // Extract cookie name
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
    });
};

// Load auth state from localStorage
const storedUser = JSON.parse(localStorage.getItem("authUser")) || null;
const storedToken = localStorage.getItem("authToken") || null;

const initialState = {
    isAuthenticated: !!(storedUser && storedToken),
    user: storedUser,
    role: storedUser ? storedUser.role : null,
    token: storedToken,
    loading: false,
    error: null,
    initialized: true
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        requestStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        setUser: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.role = action.payload.role;
            state.token = action.payload.token;
            state.loading = false;
            state.initialized = true;

            // Store auth data in localStorage
            localStorage.setItem("authUser", JSON.stringify(action.payload.user));
            localStorage.setItem("authToken", action.payload.token);
        },
        logoutUser: (state) => {
            console.log("Logging out user...");

            state.isAuthenticated = false;
            state.user = null;
            state.role = null;
            state.token = null;
            state.loading = false;
            state.initialized = true;

            // Clear auth data from localStorage and sessionStorage
            localStorage.removeItem("authUser");
            localStorage.removeItem("authToken");
            sessionStorage.clear();

            console.log("Removing cookies...");
            removeCookies();


            console.log("User logged out and cookies removed.");
        },
        authError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        }
    }
});

export const { requestStart, setUser, logoutUser, authError } = authSlice.actions;
export default authSlice.reducer;
