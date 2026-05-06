
const Product=require('../../models/product')

const searchProducts=async(req,res)=>{
    try{
        const {keyword}=req.params;
        if(!keyword || typeof keyword !=='string'){
           return res.status(400).json({
                success:false,
                message:"Keyword not present or Keyword type is not string"
            })
        }
        const reqEx=new RegExp(keyword,'i');
        const createsearchquery={
            $or:[
                {title:reqEx},
                {description:reqEx},
                {category:reqEx},
                {brand:reqEx}
            ]
        }
        const products=await Product.find(createsearchquery)
        return res.status(200).json({
            success:true,
            data:products
        })


    }catch(e){
        console.log(e)
        res.status(500).json({
            message:"Error while search",
            success:false,
            error:e
        })
    }
}
module.exports=searchProducts;