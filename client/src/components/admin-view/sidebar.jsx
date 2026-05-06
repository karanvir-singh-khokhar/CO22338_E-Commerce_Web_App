import { LayoutDashboard, ShoppingBasket, ListOrdered } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Sidebar({ isSidebarOpen,setIsSidebarOpen }) {
    const navigate = useNavigate();
    
    return ( 
        <aside className={`bg-gray-900 text-white w-64 min-h-screen p-4 transition-transform transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:relative z-50`}>
            <h2 className="text-lg font-semibold mb-4">Menu</h2>
            <ul className="space-y-2">
                <li>
                    <button 
                        onClick={() => {navigate("/admin/dashboard") 
                            setIsSidebarOpen(false)
                        }} 
                        
                        className="flex items-center gap-2 w-full text-left py-2 px-4 hover:bg-gray-700 rounded-md"
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                    </button>
                </li>
                <li>
                    <button 
                        onClick={() => {
                            navigate("/admin/orders")
                            setIsSidebarOpen(false)
                        }} 
                        
                        className="flex items-center gap-2 w-full text-left py-2 px-4 hover:bg-gray-700 rounded-md"
                    >
                        <ListOrdered className="w-5 h-5" />
                        Orders
                    </button>
                </li>
                <li>
                    <button 
                        onClick={() => {navigate("/admin/products")
                            setIsSidebarOpen(false)
                        }} 
                        className="flex items-center gap-2 w-full text-left py-2 px-4 hover:bg-gray-700 rounded-md"
                >
                        <ShoppingBasket className="w-5 h-5" />
                        Products
                    </button>
                </li>
            </ul>
        </aside>
    );
}

export default Sidebar;
