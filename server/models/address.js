const mongoose=require('mongoose')

const AdressSchema=new mongoose.Schema({
    userId:String,
    address:String,
    city:String,
    pincode:String,
    number:String,
    notes:String,
},
{timestamps:true}
)
module.exports=mongoose.model('Address',AdressSchema)