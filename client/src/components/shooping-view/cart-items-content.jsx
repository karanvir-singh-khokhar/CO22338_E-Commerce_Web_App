import { Minus, Plus, Trash } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { deleteToCart, updateToCart } from '../../store/shop-slice/cart/index';
import { toast, Toaster } from "react-hot-toast";

function UserCartItemContent({ cartItem }) {
    const { productList = [] } = useSelector((state) => state.shoppingProduct);
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);

    const product = productList.find(p => p._id === cartItem.ProductId._id);
    
    if (!product) {
        return null; 
    }

    const price = product.salePrice > 0 ? product.salePrice : product.price;

    function updateQuantity(cartItem, typeAction) {
        const newQuantity = typeAction === 'plus' ? cartItem.quantity + 1 : cartItem.quantity - 1;

        // dont allow quantity below 1
        if (newQuantity < 1) {
            toast.error("Quantity cannot be less than 1");
            return;
        }

        // prevent going above stock
        if (newQuantity > product.stock) {
            toast.error("You cannot add more than available stock");
            return;
        }

        dispatch(updateToCart({
            UserId: user._id,
            ProductId: cartItem.ProductId._id,
            quantity: newQuantity
        }))
        .then(data => {
            if (data?.type === 'cart/updateToCart/fulfilled') {
                toast.success("Product Updated Successfully");
            } else {
                toast.error("Failed to update cart");
            }
        })
        .catch(error => {
            toast.error(error?.message || "Something went wrong");
        });
    }

    function onDelete(cartItem) {
        if (!user || !user._id || !cartItem?.ProductId?._id) {
            toast.error("Invalid delete request");
            return;
        }

        dispatch(deleteToCart({ UserId: user._id, ProductId: cartItem.ProductId._id }))
            .then(data => {
                if (data?.type === 'cart/deleteToCart/fulfilled') {
                    toast.success("Item removed from cart");
                } else {
                    toast.error("Failed to remove item");
                }
            })
            .catch(error => {
                toast.error(error?.message || "Failed to remove item");
            });
    }

    return (
        <div className="border-b py-2 flex justify-between items-center">
            <Toaster />

            <img
                src={product.image}
                alt={product.title}
                className="w-16 h-16 object-cover rounded"
            />
            <div className="flex flex-col flex-grow px-4">
                <span className="font-semibold">{product.title}</span>
                <span className="text-gray-600">
                    ${price} x {cartItem.quantity}
                </span>
            </div>

            <div className="flex items-center space-x-2">
                <button
                    onClick={() => updateQuantity(cartItem, 'minus')}
                    className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition"
                    disabled={cartItem.quantity <= 1}
                >
                    <Minus size={16} />
                </button>

                <span className="font-semibold">{cartItem.quantity}</span>

                <button
                    onClick={() => updateQuantity(cartItem, 'plus')}
                    className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition"
                >
                    <Plus size={16} />
                </button>
            </div>

            <span className="text-gray-900 font-bold">
                ${price * cartItem.quantity}
            </span>
            <button
                onClick={() => onDelete(cartItem)}
                className="p-1 rounded-full bg-red-200 hover:bg-red-300 transition"
            >
                <Trash size={16} className="text-red-600" />
            </button>
        </div>
    );
}

export default UserCartItemContent;
