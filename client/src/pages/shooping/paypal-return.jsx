import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { capturePayment } from '../../store/shop-slice/order-slice';

function PaypalReturnPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paymentId = params.get('paymentId');
  const payerId = params.get('PayerID');

  useEffect(() => {
    if (paymentId && payerId) {
      const orderId = JSON.parse(sessionStorage.getItem('currentOrderId'));

      if (!orderId) {
        console.error('Order ID missing from sessionStorage');
        return;
      }

      dispatch(capturePayment({ paymentId, payerId, orderId }))
        .unwrap()
        .then((data) => {
          console.log('Capture response:', data);
          if (data?.success) {
            sessionStorage.removeItem('currentOrderId');
            window.location.href = '/shop/payment-success';
          } else {
            console.error('Payment capture failed:', data);
          }
        })
        .catch((error) => {
          console.error('Capture payment error:', error);
        });
    }
  }, [paymentId, payerId, dispatch]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <h1 className="text-3xl font-semibold">Processing Payment... Please Wait</h1>
    </div>
  );
}

export default PaypalReturnPage;
