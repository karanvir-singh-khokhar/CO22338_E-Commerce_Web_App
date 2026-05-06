const Address=require('../../models/address')
const addAddress=async (req,res)=>{
    try{
        const {userId,address,city,pincode,number,notes}=req.body
        if(!userId || !address || !city || !pincode || !number ||  !notes ){
            return res.status(400).json({
                message:"Please fill all the fields",
                success:false
            })
        }
        const newAddress=new Address({
            userId,
            address,
            city,
            pincode,
            number,
            notes
        })
        await newAddress.save();
        res.status(201).json({
            message:"Address added successfully",
            success:true
        })
    }catch(e){
        console.log(e)
        res.status(500).json({
            message:"Error",
            error:e,
            success:false,
        })
    }
}

const fetchAllAddress=async(req,res)=>{
    try{
        const {userId}=req.params

        if(!userId){
            return res.status(400).json({
                message:"Please provide user id",
                success:false
            })
        }
        const addresses=await Address.find({userId})
        res.status(200).json({
            message:"Addresses fetched successfully",
            data:addresses,
        })
    }catch(e){
        console.log(e)
        res.status(500).json({
            message:"Error",
            error:e,
            success:false,
        })
    }

}

const editAddress=async(req,res)=>{
    try{
        const {userId,addressId}=req.params
        const formData=req.body

        if(!userId || !addressId){
            return res.status(400).json({
                message:"Please provide user id and address id",
                success:false
            })
        }

        const address = await Address.findOneAndUpdate(
            { _id: addressId, userId },
            formData,
            { new: true } 
          );
          

        if(!address){
            return res.status(404).json({
                message:"Address not found",
                success:false
            })
        }

        res.status(200).json({
            message:"Address updated successfully",
            success: true,
            data:address

        })
    }catch(e){
        console.log(e)
        res.status(500).json({
            message:"Error",
            error:e,
            success:false,
        })
    }

}

const deleteAddress=async(req,res)=>{
    try{
        const {userId,addressId}=req.params

        if(!userId || !addressId){
            return res.status(400).json({
                message:"Please provide user id and address id",
                success:false
            })
        }

        const address=await Address.findOneAndDelete(
            {
                _id:addressId,
                userId
            }
        )
        if(!address){
            return res.status(404).json({
                message:"Address not found",
                success:false
            })
        }
        res.status(200).json({
            message:"Address deleted successfully",
            success:true,
            data:address
        })
    }catch(e){
        console.log(e)
        res.status(500).json({
            message:"Error",
            error:e,
            success:false,
        })
    }

}

module.exports={addAddress,fetchAllAddress,editAddress,deleteAddress}