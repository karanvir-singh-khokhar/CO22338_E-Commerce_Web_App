const Order = require('../../models/order');
const paypal = require('../../helper/paypal');
const Cart=require('../../models/card')
const Product=require('../../models/product')


const createOrder = async (req, res) => {
  try {
    const {userId,cartItems,address,orderStatus,paymentMethod,paymentStatus,totalAmount,orderDate,orderUpdateDate,paymentId,payerId,cartId} = req.body;

    const create_payment_json = {
      intent: 'sale', 
      payer: {
        payment_method: 'paypal'
      },
      redirect_urls: {
        return_url: `${process.env.CLIENT_BASE_URL}/shop/paypal-return`,
        cancel_url: `${process.env.CLIENT_BASE_URL}/shop/paypal-cancel`
      },
      transactions: [
        {
          item_list: {
            items: cartItems.map(item => ({
              name: item.title,
              sku: item.productId,
              price: item.price.toFixed(2),
              currency: 'USD',
              quantity: item.quantity
            }))
          },
          amount: {
            currency: 'USD',
            total: totalAmount.toFixed(2)
          },
          description: 'description'
        }
      ]
    };

    paypal.payment.create(create_payment_json, async (error,paymentInfo)=>{
      if (error){
        console.error('PayPal error:', error.response ||error);
        return res.status(400).json({
          success: false,
          message: 'Error while creating PayPal payment',
          details: error.response
        });
      }

      const newlyCreatedOrder = new Order({
        userId,
        cartItems,
        address,
        orderStatus,
        paymentMethod,
        paymentStatus,
        totalAmount,
        orderDate,
        orderUpdateDate,
        paymentId,
        payerId,
        cartId
      });

      await newlyCreatedOrder.save();

      const approval_url = paymentInfo.links.find(link => link.rel === 'approval_url')?.href;

      return res.status(201).json({
        success: true,
        approval_url,
        orderId: newlyCreatedOrder._id
      });
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: 'Error creating order',
      success: false
    });
  }
};

const capturePayment=async(req,res)=>{
    try{
      const {paymentId,payerId,orderId}=req.body
      let order=await Order.findById(orderId)
      if(!order){
        return res.status(404).json({
          success:false,
          message:'Order not found',
        })
      }
      order.paymentStatus='paid'
      order.orderStatus='confirmed'
      order.payerId=payerId
      order.paymentId=paymentId

      for(let item of order.cartItems){
        let product=await Product.findById(item.productId)
        if(!product){
          return res.status(404).json({
            success:false,
            message:'Product not found',
          })
        }
        product.stock-=item.quantity
        await product.save()
      }

      const getCart=order.cartId

      await Cart.findOneAndDelete(getCart)

      await order.save();

      res.status(200).json({
        success: true,
        message: 'Payment captured successfully',
        data:order
      })

    }catch(e){
        console.log(e)
        res.status(500).json({
            message:"Error while capture Payment",
            success:false
        })
    }
}
const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId });
    console.log("Orders found:", orders.length);
    
    res.status(200).json({
      success: true,
      message: orders.length ? 'Orders found successfully' : 'No orders found for this user',
      data: orders
    });
    
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Error while getting ALL Orders By user ID",
      success: false
    });
  }
};
const getOrderDetail=async(req,res)=>{
  try{
    const {id}=req.params;
    const order=await Order.findById(id)
    if(!order){
      res.status(404).json({
        success:false,
        message:'No orders detailed Found',
      })
    }
    res.status(200).json({
      success:true,
      message:'Orders Details Found successfully',
      data:order
    })
  }catch(e){
    console.log(e)
        res.status(500).json({
            message:"Error while getting ALL Orders By user ID",
            success:false
        })

  }
}
module.exports={createOrder,capturePayment,getOrderDetail,getAllOrdersByUser}

