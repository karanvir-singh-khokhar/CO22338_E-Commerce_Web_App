import { useSelector,useDispatch } from "react-redux";
import account from "../../assets/account.jpg";
import Address from "../shooping/address";
import UserCartWrapper from "../../components/shooping-view/cart-wrapper";
import { useState } from "react";
import {createNewOrder} from '../../store/shop-slice/order-slice/index'
import {resetPaypalSession} from '../../store/shop-slice/order-slice/index'
import { toast, Toaster } from "react-hot-toast";


function Checkout() {
    const { cartItems } = useSelector((state) => state.shoppingCart);
    console.log(cartItems,"hello cartItems")
    const { user } = useSelector((state) => state.auth);
    const {approvalUrl} =useSelector((state)=>state.shopOrder)
    const dispatch = useDispatch();
    const [currentSelectedAddress,setCurrentSelectedAddress]=useState(null);
    const [isPaymentStart,setIsPaymentStart]=useState(false)
    console.log(currentSelectedAddress,"selected address")
    const totalAmountCart = cartItems?.reduce(
        (acc, item) =>
            acc + item.quantity * (item.ProductId?.salePrice > 0 ? item.ProductId?.salePrice : item.ProductId?.price),
        0
    );


    function handleInitiatePaypalPayment(){
        if(currentSelectedAddress===null){
            toast.error("No Address is Selected");
        }
        if(cartItems.length ===null){
            toast.error("No item in the Cart");
        }
        dispatch(resetPaypalSession());
        const orderData={
            userId:user?._id,
            cartId:cartItems?._id,
            cartItems: cartItems.map((singleItem) => ({
                productId: singleItem?.ProductId?._id,
                title: singleItem?.ProductId?.title,
                image: singleItem?.ProductId?.image,
                price:
                  singleItem?.ProductId?.salePrice > 0
                    ? singleItem?.ProductId?.salePrice
                    : singleItem?.ProductId?.price,
                quantity: singleItem.quantity,
              })),
            address:{
                addressId:currentSelectedAddress?._id,
                address:currentSelectedAddress?.address,
                city:currentSelectedAddress?.city,
                pincode:currentSelectedAddress?.pincode,
                phone:currentSelectedAddress?.number,
                notes:currentSelectedAddress?.notes
            },
            orderStatus:'pending',
            paymentMethod:'paypal',
            paymentStatus:'pending',
            totalAmount:totalAmountCart,
            orderDate:new Date(),
            orderUpdateDate:new Date(),
            paymentId:'',
            payerId:''
        }
        console.log(orderData,"order data")
        dispatch(createNewOrder(orderData)).then((data) =>{
         console.log(data, "order response");
         if(data?.payload?.success){
            setIsPaymentStart(true)
         }
         else{
            setIsPaymentStart(false)

         }
         }).catch((error) => {
         console.error("Order creation failed:", error);
        });


    }
    if(approvalUrl){
        window.location.href = approvalUrl;
    }

    return (
        
        <div className="w-full min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-start justify-center py-10 px-4">
            <Toaster />
            <div className="w-full max-w-7xl bg-white shadow-xl rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-3 gap-6 p-8">

                <div className="col-span-1 space-y-8">
                    <div className="flex flex-col items-center space-y-4">
                        <img src={account} alt="Account" className="w-28 h-28 rounded-full border-4 border-indigo-500 shadow-lg" />
                        <h2 className="text-xl font-bold text-gray-800">Checkout</h2>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">Shipping Address</h3>
                        <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
                            <Address setCurrentSelectedAddress={setCurrentSelectedAddress} />
                        </div>
                    </div>
                </div>
                <div className="col-span-2">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Your Cart</h3>

                    <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
                        {cartItems?.length > 0 ? (
                            <UserCartWrapper cartItems={cartItems}  />
                        ) : (
                            <p className="text-center text-gray-500">Cart is empty.</p>
                        )}
                    </div>
                    {cartItems?.length > 0 && (
                        <div className="flex justify-end mt-6">
                            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-xl transition duration-200" onClick={handleInitiatePaypalPayment}>
                                Checkout With Paypal
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Checkout;
