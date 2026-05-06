const express = require("express");
const { upload } = require("../../helper/cloudinary");
const { handleUploadImage, addProduct, findAllProduct, editProduct, deleteProduct } = require("../../controllers/admin/products-controller"); // Ensure all functions are imported correctly


const router = express.Router();

// Fix route name (match frontend)
router.post("/upload_image", upload.single("image"), handleUploadImage); // Route for image upload

router.post("/add", addProduct); // Route for adding a new product

router.get("/all_product", findAllProduct); // Route for fetching all products

router.put('/edit/:id', editProduct); // Route for editing a product

router.delete('/delete/:id', deleteProduct); // Route for deleting a product


module.exports = router;
