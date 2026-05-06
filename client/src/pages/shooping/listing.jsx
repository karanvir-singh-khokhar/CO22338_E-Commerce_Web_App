import { useState, useEffect } from "react";
import { ArrowDownUp } from "lucide-react";
import ShoppingProductTile from '../../components/shooping-view/shoopingproduct_tile';
import { useSelector, useDispatch } from "react-redux";
import { fetchAllFilteredProducts, getProductDetails, setProductDetails } from "../../store/shop-slice/products/index";
import { useSearchParams } from "react-router-dom";
import ProductDetailsDialog from "../../components/shooping-view/product_details";
import { addToCart, fetchCartItems } from "../../store/shop-slice/cart";
import { toast, Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";


function Listing() {

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState([]);
    const [sortBy, setSortBy] = useState("");
    const [open, setOpen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const dispatch = useDispatch();
    const { productList = [], productDetails } = useSelector((state) => state.shoppingProduct);
    const { cartItems } = useSelector((state) => state.shoppingCart);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        const categoriesFromURL = searchParams.get("categories")?.split(",") || [];
        console.log("URL Params:", searchParams.toString());

        const brandFromURL = searchParams.get("brand")?.split(",") || [];
        const sortByFromURL = searchParams.get("sortBy") || "";

        setSelectedCategories(categoriesFromURL);
        setSelectedBrand(brandFromURL);
        setSortBy(sortByFromURL);
    }, [searchParams]);

    useEffect(() => {
        dispatch(fetchAllFilteredProducts({ filters: { category: selectedCategories, brand: selectedBrand }, sortBy }));
    }, [selectedCategories, selectedBrand, sortBy, dispatch]);

    const handleCategoryChange = (category) => {
        const newCategories = selectedCategories.includes(category)
            ? selectedCategories.filter((c) => c !== category)
            : [...selectedCategories, category];

        setSelectedCategories(newCategories);
        updateSearchParams({ categories: newCategories });
    };

    const handleBrandChange = (brand) => {
        const newBrands = selectedBrand.includes(brand)
            ? selectedBrand.filter((b) => b !== brand)
            : [...selectedBrand, brand];

        setSelectedBrand(newBrands);
        updateSearchParams({ brand: newBrands });
    };

    const handleSortChange = (criteria) => {
        setSortBy(criteria);
        updateSearchParams({ sortBy: criteria });
        setIsDropdownOpen(false);
    };

    function updateSearchParams(updatedParams) {
        const newParams = {
            categories: selectedCategories,
            brand: selectedBrand,
            sortBy,
            ...updatedParams,
        };

        const queryString = Object.entries(newParams)
            .filter(([_, value]) => value.length > 0)
            .map(([key, value]) =>
                Array.isArray(value) ? `${key}=${encodeURIComponent(value.join(","))}` : `${key}=${encodeURIComponent(value)}`
            )
            .join("&");

        setSearchParams(new URLSearchParams(queryString));
    }

    const handleProductDetails = (productId) => {
        dispatch(getProductDetails(productId));
    };
    
    const handleAddtoCart = (productId) => {
        if (!user || !user._id) {
            toast.error("Please log in to add items to your cart.");
            return;
        }
    
        const product = productList.find(p => p._id === productId);
        if (!product) {
            toast.error("Product not found");
            return;
        }
    
        const cartItem = cartItems.find(item => {
            const id = typeof item.ProductId === 'object' ? item.ProductId._id : item.ProductId;
            return id === productId;
        });
    
        const cartQuantity = cartItem ? cartItem.quantity : 0;
    
        if (cartQuantity >= product.stock) {
            toast.error("You cannot add more than available stock");
            return;
        }
        dispatch(addToCart({
            UserId: user._id,
            ProductId: productId,
            quantity: 1
        })).then((data) => {
            if (data?.payload?.success) {
                dispatch(fetchCartItems({ UserId: user._id }));
                toast.success("Product added to cart successfully");
            }else{
                toast.error("Something went wrong");
            }
        });
    };
    

    function handleDialogclose(){
        setOpen(false)
        dispatch(setProductDetails())
    }

    useEffect(() => {
        return () => {
            dispatch(setProductDetails()); 
        };
    }, [dispatch]);
    

    useEffect(() => {
        if (productDetails !== null) {
            setOpen(true);
        }
    }, [productDetails]);
    // const filteredProducts = productList
    //     .filter((product) =>
    //         (selectedCategories.length === 0 || selectedCategories.includes(product.category)) &&
    //         (selectedBrand.length === 0 || selectedBrand.includes(product.brand))
    //     )
    const filteredProducts = productList.filter((product) =>
        (selectedCategories.length === 0 || selectedCategories.some(category => category.toLowerCase() === product.category.toLowerCase())) &&
        (selectedBrand.length === 0 || selectedBrand.includes(product.brand))
    ).sort((a, b) => {
            if (sortBy === "Price: Low to High") return a.price - b.price;
            if (sortBy === "Price: High to Low") return b.price - a.price;
            if (sortBy === "Newest First") return new Date(b.dateAdded) - new Date(a.dateAdded);
            return 0;
        });
        console.log(filteredProducts,"filteredProducts")

    return (
        <div className="min-h-screen p-6 bg-gray-50 flex">
            <Toaster />
            {/* sidebar filters */}
            <div className="w-1/5 bg-white p-6 border rounded-lg shadow-md">
                <h2 className="font-bold text-lg mb-4">Filters</h2>

                {/* categories */}
                <div className="mb-6">
                    <h3 className="font-semibold text-md mb-2">Category</h3>
                    <div className="space-y-3">
                        {["men", "women", "kids", "accessories", "footwear"].map((item) => (
                            <label key={item} className="flex items-center gap-2 cursor-pointer hover:text-blue-500">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 accent-blue-500"
                                    checked={selectedCategories.includes(item)}
                                    onChange={() => handleCategoryChange(item)}
                                />{" "}
                                {item}
                            </label>
                        ))}
                    </div>
                </div>

                {/* brands */}
                <div>
                    <h3 className="font-semibold text-md mb-2">Brand</h3>
                    <div className="space-y-3">
                        {["Nike", "Adidas", "Puma", "Reebok", "H&M", "Levis"].map((brand) => (
                            <label key={brand} className="flex items-center gap-2 cursor-pointer hover:text-blue-500">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-blue-500"
                                    checked={selectedBrand.includes(brand)}
                                    onChange={() => handleBrandChange(brand)}
                                />{" "}
                                {brand}
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            <div className="w-4/5 p-6">
                <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-md">
                    <span className="font-bold text-lg">All Products</span>

                    {/* sorting dropdown */}
                    <div className="relative group">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="p-2 px-4 border rounded-lg bg-white hover:bg-gray-200 flex items-center gap-2"
                        >
                            <ArrowDownUp size={18} />
                            <span className="text-sm">Sort</span>
                            <span>{productList.length}</span>
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                                <ul className="py-2 text-sm text-gray-700">
                                    <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleSortChange("Price: Low to High")}>
                                        Price: Low to High
                                    </li>
                                    <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleSortChange("Price: High to Low")}>
                                        Price: High to Low
                                    </li>
                                    <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleSortChange("Newest First")}>
                                        Newest First
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    {filteredProducts.length > 0 ? filteredProducts.map((product) => (
                        <ShoppingProductTile key={product._id} product={product} handleProductDetails={handleProductDetails} handleAddtoCart={handleAddtoCart} />
                    )) : <p className="text-gray-500 col-span-full text-center">No products available.</p>}
                </div>
            </div>
            <ProductDetailsDialog open={open} setOpen={setOpen} productDetails={productDetails} onOpenChange={handleDialogclose} />
        </div>
    );
}

export default Listing;
