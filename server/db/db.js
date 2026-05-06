const mongoose=require('mongoose')

const ConnectDb=mongoose.connect(process.env.MONGO_URL).then(()=>console.log('Connected to database succesfully')).catch((e)=>console.log('error in connecting',e))

module.exports=ConnectDb;