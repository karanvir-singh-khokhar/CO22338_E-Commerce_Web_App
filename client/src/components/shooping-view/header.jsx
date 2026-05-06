import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../store/auth-slice/index";
import { useNavigate, Link } from "react-router-dom";
import { House, ShoppingCart, User, LogOut, AlignJustify, X } from "lucide-react";
import UserCartWrapper from '../../components/shooping-view/cart-wrapper';
import { fetchCartItems } from "../../store/shop-slice/cart";
import axios from "axios";
import { useLocation } from "react-router-dom";


function Shoppingheader() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);
    const { cartItems } = useSelector(state => state.shoppingCart);
    const { productList = [], productDetails } = useSelector((state) => state.shoppingProduct);

    const location = useLocation();


    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const categories = ["men", "women", "kids", "accessories", "footwear"];
    console.log(productList,"hallelouta") 

    useEffect(() => {
        if (user?._id) {
            dispatch(fetchCartItems({ UserId: user._id }));
        }
    }, [dispatch, user]);

    const handleLogout = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/logout`, {}, { withCredentials: true });
            await dispatch(logoutUser());
            navigate("/auth/login", { replace: true });
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const handleNavigate = (label) => {
        if (!label) return;

        setIsSidebarOpen(false);

        const filterKey = categories.includes(label) ? "categories" : "brand";
        const currentFilter = { [filterKey]: [label] };
        sessionStorage.setItem("filters", JSON.stringify(currentFilter));
        const queryString = new URLSearchParams({ [filterKey]: label }).toString();
        navigate(`/shop/listing?${queryString}`);
    };

    return (
        <div className="flex items-center justify-between bg-white p-5 shadow-lg border-b border-gray-200 relative">
            <div className="flex items-center space-x-3">
                <button className="md:hidden" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <AlignJustify className="h-6 w-6 text-gray-700" />
                </button>
                <Link to="/shop/home" className="flex items-center text-gray-900 font-semibold text-xl">
                    <House className="mr-3 h-6 w-6 text-indigo-600" />
                    <span className="tracking-wide">E-Commerce</span>
                </Link>
            </div>
            <div className="hidden md:flex space-x-6 text-gray-700 font-medium">
                <Link to='/shop/listing'><span>Products</span></Link>
                <Link to='/shop/search-products'><span>Search</span></Link>
            </div>

            {location.pathname !== "/shop/listing" && (
    <div className="hidden md:flex space-x-6 text-gray-700 font-medium">
        {categories.map((cat) => (
            <button key={cat} onClick={() => handleNavigate(cat)} className="hover:text-indigo-600 transition">
                {cat}
            </button>
        ))}
    </div>
)}
            <div className="hidden md:flex items-center space-x-6">
                <button onClick={() => setIsCartOpen(true)} className="relative">
                    <ShoppingCart className="h-7 w-7" />
                    {cartItems?.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                            {cartItems.length}
                        </span>
                    )}
                </button>

                <button 
                    onClick={handleLogout} 
                    className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition font-medium"
                >
                    <LogOut />
                </button>

                <button onClick={() => navigate("/shop/account")} className="flex items-center space-x-2 text-gray-900 font-medium">
                    <User className="h-6 w-6 text-gray-700" />
                    <span>{user?.username}</span>
                </button>
            </div>

            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsSidebarOpen(false)} />
            )}

            <div className={`fixed left-0 top-0 h-full w-64 bg-white shadow-lg transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out z-50`}>
                <div className="p-5 flex justify-between items-center border-b border-gray-200">
                    <span className="text-xl font-semibold">Menu</span>
                    <button onClick={() => setIsSidebarOpen(false)}>
                        <X className="h-6 w-6 text-gray-700" />
                    </button>
                </div>
                <div className="flex flex-col space-y-4 p-5 text-gray-700 font-medium">
                    {categories.map((cat) => (
                        <button key={cat} onClick={() => handleNavigate(cat)} className="hover:text-indigo-600 transition">
                            {cat}
                        </button>
                    ))}
                    <button onClick={() => setIsCartOpen(true)} className="flex items-center space-x-2">
                        <ShoppingCart className="h-6 w-6" /> <span>Cart</span>
                    </button>
                    <button 
                        onClick={handleLogout} 
                        className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition font-medium flex items-center space-x-2"
                    >
                        <LogOut className="h-6 w-6" /> <span>Logout</span>
                    </button>
                    <button onClick={() => navigate("/shop/account")} className="flex items-center space-x-2 text-gray-900 font-medium">
                        <User className="h-6 w-6 text-gray-700" />
                        <span>{user?.username}</span>
                    </button>
                </div>
            </div>

            {isCartOpen && (
                <>
                    <div className="fixed inset-0 bg-black bg-opacity-40 z-40" onClick={() => setIsCartOpen(false)} />
                    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg z-50 p-5 flex flex-col">
                        <div className="flex justify-between items-center border-b pb-3">
                            <h2 className="text-lg font-semibold">Your Cart</h2>
                            <button onClick={() => setIsCartOpen(false)}>
                                <X className="h-6 w-6 text-gray-700" />
                            </button>
                        </div>
                        {cartItems?.length === 0 ? (
                            <p className="text-center text-gray-500 mt-6">Your cart is empty.</p>
                        ) : (
                            <UserCartWrapper cartItems={cartItems} />
                        )}
                        <div className="mt-auto border-t pt-4">
                            
                            <button
                                onClick={() => {
                                    setIsCartOpen(false);
                                    navigate("/shop/checkout");
                                }}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition"
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Shoppingheader;
