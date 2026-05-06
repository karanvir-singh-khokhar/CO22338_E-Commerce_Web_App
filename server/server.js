require('dotenv').config()
const express=require('express')
const ConnectDb=require('./db/db');
const Authroute=require('./routes/auth-routes/authr')
const AdminProductsrouter=require('./routes/admin/products-routes')
const AdminOrdersrouter=require('./routes/admin/order-routes')
const shopProductsrouter=require('./routes/shop/products-routes')
const shopCartrouter=require('./routes/shop/shop-routes')
const shopAdressrouter=require('./routes/shop/address-routes')
const shopOrderrouter=require('./routes/shop/order-routes')
const shopSearchrouter=require('./routes/shop/search-routes')
const shopProductReviewRouter=require('./routes/shop/review-routes')

const cookieparser=require('cookie-parser')
const cors=require('cors')
const app=express()

const port = process.env.PORT || 5000;

ConnectDb

app.use(cors({
    origin: 'https://e-commerce-uyi9.vercel.app',
    methods:['GET','POST','DELETE','PUT'],
    allowedHeaders:[
        'Content-Type',
        'Authorization',
        'Cache-Control', 
        'Expires',
        'Pragma'
    ],
    credentials:true
}))
app.use(cookieparser())
app.use(express.json())

app.use("/api", Authroute);
app.use("/api/admin/products", AdminProductsrouter);
app.use("/api/admin/orders",AdminOrdersrouter );

app.use("/api/shop", shopProductsrouter);
app.use("/api/shop/cart",shopCartrouter);
app.use("/api/shop/address",shopAdressrouter);
app.use("/api/shop/orders",shopOrderrouter);
app.use("/api/shop/search",shopSearchrouter)
app.use("/api/shop/review",shopProductReviewRouter)



app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})
