import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function Checkauth({ children }) {
    const location = useLocation();
    console.log("Current Path:", location.pathname);

    const authState = useSelector((state) => state.auth);
    console.log("Auth Redux State after logout:", authState);


    const { isAuthenticated, user } = authState;

    // Redirect unauthenticated users to login, except when on login/register pages
    if (!isAuthenticated && !(location.pathname.startsWith('/auth/login') || location.pathname.startsWith('/auth/register'))) {
        return <Navigate to="/auth/login" />;
    }

    // Prevent logged-in users from accessing the login page
    if (isAuthenticated && location.pathname.startsWith('/auth/login')) {
        return user?.role === 'admin' 
            ? <Navigate to="/admin/dashboard" />
            : <Navigate to="/shop/home" />;
    }

    // Prevent non-admin users from accessing admin routes
    if (isAuthenticated && user?.role !== 'admin' && location.pathname.startsWith('/admin')) {
        return <Navigate to="/unauth-page" />;
    }

    // Restrict admins from accessing certain shop routes (except home & listing)
    if (isAuthenticated && user?.role === 'admin' && location.pathname.startsWith('/shop') && 
        !['/shop/home', '/shop/listing'].includes(location.pathname)) {
        return <Navigate to="/admin/dashboard" />;
    }

    return <>{children}</>;
}

export default Checkauth;
