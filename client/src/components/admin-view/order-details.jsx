function OrderDetails({ order }) {
    return (
      <div className="grid gap-4">
        <h3 className="text-lg font-semibold mb-2">Order Details</h3>
        <div className="flex justify-between">
          <span className="font-medium">Order ID:</span>
          <span>{order._id}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Date:</span>
          <span>{order.orderDate}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Status:</span>
          <span>{order.orderStatus}</span>
        </div>
        <div className="flex justify-between items-center">
      <span className="font-medium text-gray-600">Payment Method:</span>
      <span className="text-gray-900">{order.paymentMethod}</span>
            </div>

      <div className="flex justify-between items-center">
          <span className="font-medium text-gray-600">Payment Status:</span>
        <span className="text-gray-900">{order.paymentStatus}</span>
      </div>

      <div className="flex justify-between items-center">
        <span className="font-medium text-gray-600">Total:</span>
        <span className="text-gray-900 font-semibold">${order.totalAmount}</span>
      </div>

      <div>
        <h4 className="text-lg font-medium mt-4 mb-2">Items in this Order</h4>
        <div className="divide-y border rounded-lg bg-white">
          {order.cartItems?.map((item) => (
            <div key={item._id} className="flex justify-between px-4 py-2 text-sm">
              <div className="font-medium text-gray-800">{item.title}</div>
              <div className="text-gray-600">Qty: {item.quantity}</div>
              <div className="text-gray-900 font-semibold">${Number(item.price) * item.quantity}</div>
            </div>
          ))}
        </div>
      </div>

      </div>
    );
  }
  
  export default OrderDetails;

  