const Cart=require('../../models/card')
const Product=require('../../models/product')
const mongoose = require('mongoose');

const addToCart = async (req, res) => {
    try {
        const { UserId, ProductId, quantity } = req.body;
        
        if (!UserId || !ProductId || !quantity || quantity <= 0) {
            return res.status(400).json({ success: false, message: "Invalid input fields" });
        }
        
        if (!mongoose.Types.ObjectId.isValid(UserId) || !mongoose.Types.ObjectId.isValid(ProductId)) {
            return res.status(400).json({ success: false, message: "Invalid UserId or ProductId" });
        }

        const product = await Product.findById(ProductId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        let cart = await Cart.findOne({ UserId });
        if (!cart) {
            cart = new Cart({ UserId, items: [] });
        }

        const itemIndex = cart.items.findIndex(item => item.ProductId.toString() === ProductId);
        if (itemIndex === -1) {
            cart.items.push({ ProductId, quantity });
        } else {
            cart.items[itemIndex].quantity += quantity;
        }

        await cart.save();
        await cart.populate('items.ProductId', 'image title price salePrice');

        res.status(200).json({ success: true, message: "Product added to cart successfully", data: cart.items });
    } catch (e) {
        console.error("Error adding to cart:", e);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const fetchCartItems = async (req, res) => {
    try {
        const { UserId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(UserId)) {
            return res.status(400).json({ success: false, message: "Invalid UserId" });
        }

        const cart = await Cart.findOne({ UserId }).populate('items.ProductId', 'image title price salePrice');

        if (!cart || cart.items.length === 0) {
            return res.status(404).json({ success: false, message: "Cart is empty" });
        }

        res.status(200).json({ success: true, message: "Cart items fetched successfully", data: cart.items });
    } catch (e) {
        console.error("Error fetching cart items:", e);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const updateToCart = async (req, res) => {
    try {
        const { UserId, ProductId, quantity } = req.body;
        
        if (!UserId || !ProductId || !quantity || quantity <= 0) {
            return res.status(400).json({ success: false, message: "Invalid input fields" });
        }

        let cart = await Cart.findOne({ UserId });
        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        const itemIndex = cart.items.findIndex(item => item.ProductId.toString() === ProductId);
        if (itemIndex === -1) {
            return res.status(404).json({ success: false, message: "Product not found in cart" });
        }

        cart.items[itemIndex].quantity = quantity;
        await cart.save();
        await cart.populate('items.ProductId', 'image title price salePrice');

        res.status(200).json({ success: true, message: "Cart updated successfully", data: cart.items });
    } catch (e) {
        console.error("Error updating cart:", e);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const deleteToCart = async (req, res) => {
    try {
        const { UserId, ProductId } = req.params; 

        console.log("Deleting from cart - UserId:", UserId, "ProductId:", ProductId);

        if (!mongoose.Types.ObjectId.isValid(UserId) || !mongoose.Types.ObjectId.isValid(ProductId)) {
            return res.status(400).json({ success: false, message: "Invalid UserId or ProductId" });
        }

        let cart = await Cart.findOne({ UserId });
        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        const itemIndex = cart.items.findIndex(item => item.ProductId.toString() === ProductId);
        if (itemIndex === -1) {
            return res.status(404).json({ success: false, message: "Product not found in cart" });
        }

        cart.items.splice(itemIndex, 1);

        await cart.save();
        await cart.populate("items.ProductId", "title price salePrice image");

        res.status(200).json({ success: true, message: "Product removed from cart", data: cart.items });
    } catch (e) {
        console.error("Error deleting from cart:", e);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
module.exports = { addToCart, fetchCartItems, updateToCart, deleteToCart };
