const cloudinary = require('cloudinary').v2;
const { model } = require('mongoose');
const multer=require('multer')
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET_KEY
})

const storage=new multer.memoryStorage();

async function imageUpload(fileBuffer, mimetype) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ resource_type: "auto" }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(fileBuffer);
    });
  }  

const upload=multer({storage})

module.exports={imageUpload,upload}
