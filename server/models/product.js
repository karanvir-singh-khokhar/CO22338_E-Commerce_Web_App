const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
      image: { type: String, required: true },
      title: { type: String, required: true },
      description: { type: String },
      category: { type: String, required: true },
      brand: { type: String },
      price: { type: Number, required: true },
      salePrice: { type: Number, default: 0 },
      stock: { type: Number, required: true, default: 0 }, 
    },
    { timestamps: true }
  );
  

module.exports = mongoose.model("Product", productSchema);
