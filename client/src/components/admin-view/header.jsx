import { AlignJustify, UserCircle, LogOut, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from '../../store/auth-slice/index';
import axios from 'axios'; // Import axios for making HTTP requests

function AdminHeader({ toggleSidebar }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const handleLogout = async () => {
        try {
            console.log('clicked on logout')
            await axios.post(`${import.meta.env.VITE_API_URL}/api/logout`, {}, { withCredentials: true });
            await dispatch(logoutUser());
            navigate("/auth/login", { replace: true });
            console.log('logout Finished')
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }
    
    return ( 
        <header className="fixed top-0 left-0 w-full flex items-center justify-between px-6 py-4 bg-gray-800 shadow-md text-white z-50">
            {/* Sidebar Toggle (Only for Small Screens) */}
            <button className="p-2 rounded-md hover:bg-gray-700 md:hidden" onClick={toggleSidebar}>
                <AlignJustify className="w-6 h-6 "/>
                <span className="sr-only">Toggle Navigation</span>
            </button>

            {/* Center: Admin Panel Title */}
            <h1 className="text-lg font-semibold tracking-wide flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-yellow-400" size={30} onClick={() => navigate('/admin/dashboard')}/> 
                Admin Dashboard
            </h1>

            {/* Right: Admin Profile & Logout */}
            <div className="flex items-center gap-4">
                <UserCircle className="w-8 h-8" />
                <button className="flex items-center gap-1 p-2 bg-red-600 hover:bg-red-700 rounded-md">
                    <LogOut className="w-5 h-5" />
                    <span className="hidden md:inline" onClick={handleLogout}>Logout</span>
                </button>
            </div>
        </header>
    );
}

export default AdminHeader;
