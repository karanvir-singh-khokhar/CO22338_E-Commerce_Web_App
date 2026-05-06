import { useEffect, useState } from 'react';
import OrderDetails from '../../components/admin-view/order-details';
import {useSelector,useDispatch} from 'react-redux'
import {getAllOrdersAllUsers,getOrderDetailForAdmin,updateOrderStatus} from '../../store/admin-slice/order-slice/index'
import { toast, Toaster } from "react-hot-toast";

function AdminOrders() {
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const dispatch = useDispatch()
  const {orderList,orderDetails}=useSelector(state=>state.adminOrder)
  const { user } = useSelector((state) => state.auth);


  useEffect(()=>{
    dispatch(getAllOrdersAllUsers())
  },[dispatch])
console.log(orderList,"orderList")
console.log(orderDetails,"orderDetails")

const handleStatusChange = (orderId, newStatus) => {
  dispatch(updateOrderStatus({ id: orderId, orderStatus: newStatus }))
    .then(() => {
      dispatch(getAllOrdersAllUsers()); // Optional: Refetch all orders
      if (selectedOrder?._id === orderId) {
        dispatch(getOrderDetailForAdmin(orderId)); // Refresh selected order details
      }
      toast.success("Order Status Updated Successfully")
    })
    .catch((error) => {
      console.error('Status update failed', error);
    });
};
      function handleFetchOrderDetails(getId){
        dispatch(getOrderDetailForAdmin(getId))
      }
  useEffect(() => {
        if (user?._id) {
          dispatch(getAllOrdersAllUsers(user._id));
        }
      }, [dispatch, user?._id]);

      useEffect(() => {
            console.log(orderDetails,"orderDetails")
            if (orderDetails && orderDetails._id) {
              setSelectedOrder(orderDetails);
            }
          }, [orderDetails]);
  return (
    <div className="bg-white shadow-md rounded-2xl p-4">
      <Toaster/>
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
                <select
                 className="border rounded px-2 py-1 text-sm"
                  value={order.orderStatus}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                >
                <option value="confirmed">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
                <option value="confirmed">confirmed</option>
                <option value="pending">pending</option>
            </select>
          </td>
                <td className="px-4 py-2">${order.totalAmount}</td>
                <td className="px-4 py-2">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => handleFetchOrderDetails(order._id)}
                  >
                    View
                  </button>
                </td>
              </tr>
            )):null}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="mt-6 border-t pt-4 grid gap-6">
          <OrderDetails order={selectedOrder} />

          <div className="grid gap-2">
            <div className="font-medium text-lg">Shipping Info</div>
            <div className="grid gap-0.5 text-gray-600">
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

export default AdminOrders;
