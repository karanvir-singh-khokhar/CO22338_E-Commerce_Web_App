const Product = require('../../models/product') 

const getFilteredProducts=async(req,res)=>{
    try{
        const {category=[],brand=[],sortedBy="Price: Low to High"}=req.query
        let filter={}
        if(category.length){
            filter.category={$in: category.split(',')}
        }
        if(brand.length){
            filter.brand={$in: brand.split(',')}
        }

        let sort={}
        switch (sortedBy) {
            case 'Price: Low to High':
                sort.price=1
                break;
                case 'Price: High to Low':
                sort.price=-1
                break;
                case 'Newest First':
                 sort.createdAt=-1
            
                break;
                
        
            default:
                sort.price=1
                break;
        }

        const products = await Product.find(filter).sort(sort);
        console.log("Fetched Products:", products);
        res.status(200).json({
          message: "Products found",
          products,
        });
    }
    catch(e){
        console.log(e)
        res.status(500).json({
            message:"Error in fetching products",
            error:e
        })
    }
}
const getProductDetails=async(req,res)=>{
    try{
        const{id}=req.params;
        const product=await Product.findById(id);
        if(!product){
            return res.status(404).json({
                message:"Product not found",
                error:"Product not found"
            })
        }
        res.status(200).json({
            message:"Product found",
            product
        })

    }catch(e){
        console.log(e)
        res.status(500).json({
            message:"Error in fetching products",
            error:e
        })
    }
}
module.exports={getFilteredProducts,getProductDetails};
