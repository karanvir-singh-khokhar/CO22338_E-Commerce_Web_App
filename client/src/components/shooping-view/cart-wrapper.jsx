
import UserCartItemContent from "../../components/shooping-view/cart-items-content";

function UserCartWrapper({ cartItems }) {
    return (
        <div className="flex flex-col space-y-4 p-4">
            <p className="text-center text-lg font-semibold text-gray-800">User Cart</p>

            {cartItems && cartItems.length > 0 ? (
                cartItems.map((item) => (
                    <UserCartItemContent key={item._id} cartItem={item} />
                ))
            ) : (
                <p className="text-center text-gray-500">Your cart is empty.</p>
            )}

            <div className="flex justify-between items-center border-t pt-4 text-lg font-semibold text-gray-900">
                <span>Total</span>
                <span className="text-indigo-600">
                ${cartItems.reduce((acc, item) => acc + item.ProductId.salePrice * item.quantity, 0)}
                </span>            </div>
        </div>
    );
}

export default UserCartWrapper;
