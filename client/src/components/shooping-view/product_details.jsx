import { addToCart, fetchCartItems } from "../../store/shop-slice/cart";
import { useSelector, useDispatch } from "react-redux";
import { toast, Toaster } from "react-hot-toast";
import StarRatingComponent from '../common/star-rating'
import { useEffect, useState } from "react";
import {addReview,getReview} from "../../store/shop-slice/review-slice/index"

function ProductDetailsDialog({ open, setOpen, productDetails }) {
    if (!open || !productDetails) return null;
    const [reviewMsg,setReviewMsg]=useState('')
    const [rating, setRating] = useState(0);
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.shoppingCart);
    const { productList = [] } = useSelector((state) => state.shoppingProduct);
    const {reviews}=useSelector((state)=>state.reviews)
    console.log(user,"username")




    console.log(cartItems, "cartItems");
    console.log(productList, "productList");

    function handleRatingChange(getRating){
        setRating(getRating)
    }

    console.log(productDetails,"productDetails")
    useEffect(()=>{
        if(productDetails!==null){
            dispatch(getReview(productDetails?._id))
        }

    },[productDetails])
    console.log(reviews,"reviews")
    const handleSubmitReview = () => {

        if (!user || !user._id) {
            toast.error("You must be logged in to submit a review");
            return;
        }
    
        if (!reviewMsg.trim()) {
            toast.error("Please write a review before submitting");
            return;
        }
        console.log({
            productId: productDetails._id,
            userId: user._id,
            username:user?.username,
            rating,
            review: reviewMsg,
        });

    
        dispatch(addReview({
            productId:productDetails?._id,
            userId:user?._id,
            username:user?.username,
            reviewMessage:reviewMsg,
            rating:rating
        })).then(data=>{
            console.log(data);
        })
        toast.success("Review submitted!");
        setReviewMsg('');
        setRating(0);
    };
    
    const handleAddtoCart = (productId) => {
        if (!user || !user._id) {
            console.error("User is not logged in!");
            return;
        }

        const product = productList.find(p => p._id === productId);
        if(!product){
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
            if(data?.payload?.success){
                dispatch(fetchCartItems({ UserId: user._id }));
                toast.success("Product added to cart successfully");
            }
        });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
            <Toaster />
            <div className="relative w-[95%] sm:max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl p-6 sm:p-10 transition-all transform hover:shadow-2xl hover:scale-[1.02] duration-300">
            <button
                    onClick={() => setOpen(false)}
                    className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-md 
                    focus:outline-none focus:ring-2 focus:ring-red-400 transition-all"
                    aria-label="Close"
                >
                    ✕
                </button>
                <div className="relative w-full h-96 flex items-center justify-center">
                    <img
                        src={productDetails.image}
                        alt={productDetails.title}
                        className="w-full h-full object-contain rounded-lg shadow-md"
                    />
                </div>
                <h2 className="text-3xl font-bold mt-6 text-gray-900 text-center">{productDetails.title}</h2>
                <p className="text-lg text-gray-700 text-center mt-3 leading-relaxed">{productDetails.description}</p>
                <div className="flex items-center justify-center gap-x-4">
                    <p className="text-gray-400 line-through">${productDetails.price}</p>
                    <p className="text-lg text-gray-900 text-center">${productDetails.salePrice}</p>
                </div>
                <div className="flex items-center justify-center">
                    {productDetails.stock > 0 ?(
                        <button
                            onClick={() => handleAddtoCart(productDetails._id)}
                            className="mt-4 w-40 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                        >
                            Add to Cart
                        </button>
                    ):<button
                    className="mt-4 w-40 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                    >
                        Out of Stock
                    </button>}
                </div>
                <div className="mt-6">
                <label className="block mb-2 font-medium text-gray-700">Write a Review</label>
                <div className="mb-3">
                 <StarRatingComponent rating={rating} handleRatingChange={handleRatingChange} />
                </div>
                <input
                name="reviewMsg"
                value={reviewMsg}
                onChange={(e) => setReviewMsg(e.target.value)} 
                placeholder="Write a review..."
                className="w-full p-2 border rounded-md border-gray-300 focus:outline-none focus:ring focus:ring-blue-200"
            />
            <button
                onClick={handleSubmitReview}
                className="mt-4 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
            >
                Submit Review
            </button>
        </div>
        <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Customer Reviews</h3>
            {reviews && reviews.length > 0 ? (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div
                            key={review._id}
                            className="border p-4 rounded-lg bg-gray-50 shadow-sm"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-semibold text-gray-700">{review.username}</p>
                                <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                            </div>
                            <StarRatingComponent rating={review.rating} readonly />
                            <p className="mt-2 text-gray-800">{review.reviewMessage}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
            )}
        </div>
                    </div>
                </div>
            );
        }

export default ProductDetailsDialog;
