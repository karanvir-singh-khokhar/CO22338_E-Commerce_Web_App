const { imageUpload } = require("../../helper/cloudinary");
const Product = require('../../models/product') // Corrected import path


// Upload Image
const handleUploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload directly from buffer
    const result = await imageUpload(req.file.buffer, req.file.mimetype);

    res.json({
      success: true,
      imageUrl: result.secure_url, // Cloudinary image URL
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error uploading image",
      error: error.message,
    });
  }
};

// Add Product
const addProduct = async (req, res) => {
  try {
    console.log(" Received Data:", req.body); // Log request body

    const { image, title, description, category, brand, price, salePrice, stock } = req.body;

    if (!image || !title || price === undefined || isNaN(price)) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    //  Log parsed values
    console.log(" Parsed Values: ", {
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : 0,
      stock: stock ? Number(stock) : 0
    });

    // Create a new product
    const newProduct = new Product({
      title,
    description,
    category,
    brand,
    price,
    salePrice,
     stock: Number(stock) || 0,
     image, 
    });

    await newProduct.save();

    console.log("Product Saved:", newProduct); // Log saved product

    res.status(201).json({ 
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    console.log(" Error adding product:", error);
    res.status(500).json({
      message: "Error adding product",
      error: error.message,
    });
  }
};


// Get All Products
const findAllProduct = async (req, res) => {
  try {
    const products = await Product.find({});
    console.log("Fetched Products:", products);
    res.status(200).json({
      message: "Products found",
      products,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error fetching products",
      error: error.message,
    });
  }
};

// Edit Product
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    if (updatedData.price) updatedData.price = Number(updatedData.price);
    if (updatedData.salePrice) updatedData.salePrice = Number(updatedData.salePrice);
    if (updatedData.stock) updatedData.stock = Number(updatedData.stock);

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error updating product",
      error: error.message,
    });
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product deleted successfully",
      product: deletedProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error deleting product",
      error: error.message,
    });
  }
};

module.exports = {
  handleUploadImage,
  addProduct,
  findAllProduct,
  editProduct,
  deleteProduct,
};
