const express=require('express')
const router=express.Router()

const {addToCart,fetchCartItems,updateToCart,deleteToCart}=require('../../controllers/shop/cart-controller')


router.post('/add',addToCart)
router.get('/get/:UserId',fetchCartItems)
router.put('/update-card',updateToCart)
router.delete('/:UserId/:ProductId',deleteToCart)

module.exports=router