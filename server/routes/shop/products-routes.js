const express=require("express")
const router=express.Router()

const {getFilteredProducts,getProductDetails} =require('../../controllers/shop/products-controller')

router.get('/products',getFilteredProducts)
router.get('/products/:id',getProductDetails)


module.exports=router