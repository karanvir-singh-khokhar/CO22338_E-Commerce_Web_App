import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { searchProducts } from "../../store/shop-slice/search-slice/index";
import {  getProductDetails } from "../../store/shop-slice/products/index";
import { addToCart, fetchCartItems } from "../../store/shop-slice/cart";
import { toast, Toaster } from "react-hot-toast";
import ShoppingProductTile from '../../components/shooping-view/shoopingproduct_tile'


function SearchProducts() {
  const [keyword, setKeyword] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { searchResults, isLoading } = useSelector(state => state.search);
  const { productList = [], productDetails } = useSelector((state) => state.shoppingProduct);
  const { cartItems } = useSelector((state) => state.shoppingCart);
  const { user } = useSelector((state) => state.auth);



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


  useEffect(() => {
    const handler = setTimeout(() => {
      if (keyword && keyword.trim().length > 2) {
        setSearchParams(new URLSearchParams({ keyword }));
        dispatch(searchProducts(keyword));
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [keyword]);

  return (
      <div className="container mx-auto px-4 py-8">
        <Toaster/>
      <div className="flex justify-center mb-8">
      <div className="w-full max-w-xl">
      <input
      type="text"
      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={keyword}
      onChange={(e) => setKeyword(e.target.value)}
      placeholder="Search Products..."
      />
      </div>
      </div>
      <div>
        <div className="text-xl font-semibold mb-4">Search Results</div>
        <div>
        {isLoading ? (
        <div>Loading...</div>
         ) : searchResults.length === 0 ? (
         <div>No results found</div>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {searchResults.map((product) => (
          <ShoppingProductTile
          key={product._id}
          product={product}
          handleProductDetails={handleProductDetails}
          handleAddtoCart={handleAddtoCart}
        />
      ))}
    </div>
  )}
</div>

      </div>
    </div>
  );
}

export default SearchProducts;
