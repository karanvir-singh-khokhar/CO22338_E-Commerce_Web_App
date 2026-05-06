function OrderDetails({ order }) {
  return (
    <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm grid gap-4 text-sm text-gray-700">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Order Details</h3>

      <div className="flex justify-between items-center">
        <span className="font-medium text-gray-600">Order ID:</span>
        <span className="text-gray-900">{order._id}</span>
      </div>

      <div className="flex justify-between items-center">
        <span className="font-medium text-gray-600">Date:</span>
        <span className="text-gray-900">{order.orderDate}</span>
      </div>

      <div className="flex justify-between items-center">
        <span className="font-medium text-gray-600">Status:</span>
        <span className={`font-semibold px-2 py-1 rounded-full text-xs 
          ${order.orderStatus === 'confirmed' 
            ? 'bg-green-100 text-green-700' 
            : 'bg-yellow-100 text-yellow-700'}`}>
          {order.orderStatus}
        </span>
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
