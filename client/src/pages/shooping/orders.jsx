import OrderDetails from '../../components/shooping-view/oder-details'
import { useEffect, useState } from 'react';
import {useDispatch,useSelector} from 'react-redux'
import {getAllOrdersByUser,getOrderDetail} from '../../store/shop-slice/order-slice/index'

function ShopingOrders() {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth);
    const {orderList,orderDetails}=useSelector((state)=>state.shopOrder)

    console.log(user,"user")





    function handleFetchOrderDetails(getId){
      dispatch(getOrderDetail(getId))
    }
    useEffect(() => {
      if (user?._id) {
        dispatch(getAllOrdersByUser(user._id));
      }
    }, [dispatch, user?._id]);
    
    useEffect(() => {
      console.log(orderDetails,"orderDetails")
      if (orderDetails && orderDetails._id) {
        setSelectedOrder(orderDetails);
      }
    }, [orderDetails]);

    const statusColorMap = {
      confirmed: 'bg-green-600 text-white',
      Processing: 'bg-blue-500 text-white',
      Shipped: 'bg-yellow-500 text-white',
      Delivered: 'bg-emerald-600 text-white',
      Cancelled: 'bg-red-600 text-white',
      pending: 'bg-gray-400 text-white',
    };
    
    
    
    return ( 
        
                <div className="bg-white shadow-md rounded-2xl p-4">
      <h2 className="text-xl font-semibold mb-4">Shopping Orders</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 font-medium text-gray-700">Order ID</th>
              <th className="px-4 py-2 font-medium text-gray-700">Order Date</th>
              <th className="px-4 py-2 font-medium text-gray-700">Order Status</th>
              <th className="px-4 py-2 font-medium text-gray-700">Order Price</th>
              <th className="px-4 py-2 font-medium text-gray-700">
                <span className="sr-only">Details</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orderList && orderList.length>0?orderList.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{order._id}</td>
                <td className="px-4 py-2">{order.orderDate}</td>
                <td className="px-4 py-2">
                <span
  className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
    statusColorMap[order.orderStatus] || 'bg-gray-300 text-gray-700'
  }`}
>
  {order.orderStatus}
</span>
                </td>
                <td className="px-4 py-2">${order.totalAmount}</td>
                <td className="px-4 py-2">
                  <button className="text-blue-600 hover:underline" onClick={()=>{handleFetchOrderDetails(order._id)}}>View</button>
                </td>
              </tr>
            )):null}
          </tbody>
        </table>
      </div>
      {selectedOrder && (
        <div className="mt-6 ">
          <OrderDetails order={selectedOrder} />
          <div className="grid gap-2">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Shipping Info</h4>
            <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 space-y-1">
            <p><span className="font-medium">Username:</span> {user.username}</p>
            <p><span className="font-medium">Address:</span> {selectedOrder.address?.address}</p>
          <p><span className="font-medium">City:</span> {selectedOrder.address?.city}</p>
          <p><span className="font-medium">Pincode:</span> {selectedOrder.address?.pincode}</p>
          <p><span className="font-medium">Phone:</span> {selectedOrder.address?.phone}</p>
            </div>
          </div>
        </div>
      )}
    </div>

     );
}

export default ShopingOrders;