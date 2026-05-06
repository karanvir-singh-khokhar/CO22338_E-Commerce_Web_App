const Order = require('../../models/order');


const getAllOrdersAllUsers=async(req,res)=>{
  try{
    const orders=await Order.find({ })
    console.log("Orders found:", orders.length);

    if(!orders.length){
      res.status(404).json({
        success:false,
        message:'No orders found for this user',
      })
    }
    res.status(200).json({
      success:true,
      message:'Orders found successfully',
      data:orders
    })
  }catch(e){
    console.log(e)
        res.status(500).json({
            message:"Error while getting ALL Orders By user ID",
            success:false
        })

  }
}
const getOrderDetailForAdmin=async(req,res)=>{
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

const updateOrderStatus=async(req,res)=>{
  try{
    const {id}=req.params;
    const {orderStatus}=req.body;

    const order=await Order.findById(id);
    if(!order){
      res.status(404).json({
        success:false,
        message:'No orders found',
      })
    }
    await Order.findByIdAndUpdate(id,{orderStatus})

    res.status(200).json({
      success:true,
      message:'Order Status Updated Successfully',
    })

  }catch(e){
    console.log(e)
        res.status(500).json({
            message:"Error while getting ALL Orders By user ID",
            success:false
        })

  }
}

module.exports={getAllOrdersAllUsers,getOrderDetailForAdmin,updateOrderStatus}