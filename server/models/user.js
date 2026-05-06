const mongoose=require('mongoose')

const Userschema= mongoose.Schema({
    Username:{
        type:String,
        required:true,
        unique:true
    },
    Email:{
        type:String,
        required:true,
        unique:true
    },
    Password:{
        type:String,
        required:true
    },
    Role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
})

const User=mongoose.model("User",Userschema)
module.exports=User;
