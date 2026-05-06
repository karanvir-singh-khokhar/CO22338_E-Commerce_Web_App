const express=require('express')
const router=express.Router()
const {getAllOrdersAllUsers,getOrderDetailForAdmin,updateOrderStatus}=require('../../controllers/admin/order-controller')

router.get('/get',getAllOrdersAllUsers)
router.get('/details/:id',getOrderDetailForAdmin)
router.put('/update/:id',updateOrderStatus)


module.exports=router;