const Order = require('../../models/order');
const Product=require('../../models/product')
const ProductReview=require('../../models/Review')

const addProductReview=async(req,res)=>{
    try{
        const {productId,userId,username,reviewMessage,rating}=req.body
        const order=await Order.findOne({
            userId,
            "cartItems.productId":productId,
            orderStatus:'confirmed'
        })
        console.log(order,"order")
        if(!order){
            return res.status(403).json({message:'You need to Purchase this Product to Review it',
                success:false
            })
        }
        const checkExistingReview=await ProductReview.findOne({
            productId,
            userId
        })
        if(checkExistingReview){
            return res.status(400).json({
                message:'You have already reviewed this product',
                success:false
            })
        }
        const newReview=new ProductReview({
            productId,userId,username,reviewMessage,rating
        })
        await newReview.save()
        const reviews=await ProductReview.find({
            productId
        })
        const reviewLength = reviews.length;
        const averageReview = reviews.reduce(
        (sum, reviewItem) => sum + reviewItem.rating,0
        ) / reviewLength;

        await Product.findOneAndUpdate(
            { _id: productId },
            { averageReview }
        );

        res.status(201).json({
            message:'Product Review Added Successfully',
            success:true,
            data:newReview
        })
    }catch(e){
        console.log(e)
        res.status(500).json({
            success:false,
            message:"Error While adding Product Review 500"
        })

    }
}

const getProductReview=async(req,res)=>{
    try{
        const {productId}=req.params

        const reviews=await ProductReview.find({productId})
        if(!reviews){
            return res.status(404).json({
                message:'No Reviews Found for this Product',
                success:false
            })
        }
        res.status(200).json({
            message:'Product Reviews Retrieved Successfully',
            success:true,
            data:reviews
        })
    }catch(e){
        console.log(e)
        res.status(500).json({
            success:false,
            message:"Error While getting Product Review 500"
        })

    }
}

module.exports={addProductReview,getProductReview}