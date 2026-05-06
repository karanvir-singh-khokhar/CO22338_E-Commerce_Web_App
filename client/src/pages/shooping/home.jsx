import { useSelector, useDispatch } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Shirt,
  CloudLightning,
  Baby,
  Watch,
  Footprints,
} from "lucide-react";

import bannerOne from "../../assets/bannerOne.webp";
import bannerTwo from "../../assets/bannerTwo.webp";
import bannerThree from "../../assets/bannerThree.webp";

import {
  fetchAllFilteredProducts,
  getProductDetails,
  setProductDetails,
} from "../../store/shop-slice/products";
import { addToCart, fetchCartItems } from "../../store/shop-slice/cart";

import ShoppingProductTile from "../../components/shooping-view/shoopingproduct_tile";
import ProductDetailsDialog from "../../components/shooping-view/product_details";

import puma from "../../assets/puma.png";
import levis from "../../assets/levis.jpg";
import nike from "../../assets/nike.png";
import reebok from "../../assets/reebok.jpeg";
import HM from "../../assets/HM.png";
import adidas from "../../assets/adidas.webp";

import { toast } from "react-hot-toast";

function Home() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { productList = [], productDetails } = useSelector((state) => state.shoppingProduct);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderInterval = useRef(null);

  const slides = [bannerOne, bannerTwo, bannerThree];

  useEffect(() => {
    sliderInterval.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(sliderInterval.current);
  }, []);

  useEffect(() => {
    if (productDetails && productDetails._id) {
      setOpen(true);
    }
  }, [productDetails]);

  useEffect(() => {
    dispatch(fetchAllFilteredProducts({ filters: {}, sortBy: "Price: Low to High" }));
  }, [dispatch]);

  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % slides.length);

  const handleDialogClose = () => {
    setOpen(false);
    dispatch(setProductDetails());
  };

  const handleProductDetails = (productId) => {
    dispatch(getProductDetails(productId));
  };

  const handleAddToCart = (productId) => {
    if (!user || !user._id) {
      console.error("User is not logged in!");
      return;
    }

    dispatch(addToCart({
      UserId: user._id,
      ProductId: productId,
      quantity: 1,
    })).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems({ UserId: user._id }));
        toast.success("Product added to cart successfully");
      }
    });
  };

  const handleNavigateToListingPage = (item) => {
    if (!item || !item.label) {
      console.error("Invalid item:", item);
      return;
    }

    const filterKey = ["men", "women", "kids", "accessories", "footwear"].includes(item.label)
      ? "categories"
      : "brand";

    const currentFilter = { [filterKey]: [item.label] };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    const queryString = new URLSearchParams({ [filterKey]: item.label }).toString();
    navigate(`/shop/listing?${queryString}`);
  };

  if (!isAuthenticated) return <Navigate to="/auth/login" />;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Banner Carousel */}
      <div className="relative w-full h-[600px] overflow-hidden">
        <img
          src={slides[currentSlide]}
          alt={`Slide ${currentSlide + 1}`}
          className="w-full h-full object-cover transition-all duration-700 ease-in-out rounded-lg"
          onMouseEnter={() => clearInterval(sliderInterval.current)}
          onMouseLeave={() => {
            sliderInterval.current = setInterval(() => {
              setCurrentSlide((prev) => (prev + 1) % slides.length);
            }, 5000);
          }}
        />
        <button
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80 p-3 rounded-full shadow-md hover:bg-white"
          onClick={prevSlide}
        >
          <ChevronLeft className="text-gray-700" />
        </button>
        <button
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80 p-3 rounded-full shadow-md hover:bg-white"
          onClick={nextSlide}
        >
          <ChevronRight className="text-gray-700" />
        </button>
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentSlide ? "bg-blue-500" : "bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Shop by Category */}
      <p className="text-5xl font-extrabold text-center text-gray-900 tracking-wider mt-10 drop-shadow-lg">
        Shop by Category
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 px-6 mt-8">
        {[
          { icon: <Shirt className="w-14 h-14 text-blue-500" />, label: "men" },
          { icon: <CloudLightning className="w-14 h-14 text-pink-500" />, label: "women" },
          { icon: <Baby className="w-14 h-14 text-yellow-500" />, label: "kids" },
          { icon: <Watch className="w-14 h-14 text-green-500" />, label: "accessories" },
          { icon: <Footprints className="w-14 h-14 text-purple-500" />, label: "footwear" },
        ].map((category, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={() => handleNavigateToListingPage(category)}
          >
            {category.icon}
            <p className="mt-3 text-lg font-semibold">{category.label}</p>
          </div>
        ))}
      </div>

      {/* Shop by Brand */}
      <p className="text-5xl font-extrabold text-center text-gray-900 tracking-wider mt-12 drop-shadow-lg">
        Shop by Brand
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 px-6 mt-8">
        {[
          { src: nike, label: "Nike" },
          { src: adidas, label: "Adidas" },
          { src: puma, label: "Puma" },
          { src: reebok, label: "Reebok" },
          { src: HM, label: "H&M" },
          { src: levis, label: "Levis" },
        ].map((brand, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={() => handleNavigateToListingPage(brand)}
          >
            <img src={brand.src} alt={brand.label} className="w-20 h-20 object-contain" />
            <p className="mt-3 text-lg font-semibold">{brand.label}</p>
          </div>
        ))}
      </div>

      {/* Featured Products */}
      <p className="text-5xl font-extrabold text-center text-gray-900 tracking-wider mt-12 drop-shadow-lg">
        Featured Products
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-6 py-8">
        {productList && productList.length > 0 ? (
          productList.map((product) => (
            <div
              key={product._id}
              className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <ShoppingProductTile
                product={product}
                handleProductDetails={handleProductDetails}
                handleAddtoCart={handleAddToCart}
              />
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">No products found.</p>
        )}
      </div>

      {/* Product Detail Dialog */}
      <ProductDetailsDialog
        open={open}
        setOpen={setOpen}
        productDetails={productDetails}
        onOpenChange={handleDialogClose}
      />
    </div>
  );
}

export default Home;
