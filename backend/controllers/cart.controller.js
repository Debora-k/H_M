const { populate } = require("dotenv");
const Cart = require("../models/Cart");
const cartController={};


cartController.addItemToCart = async(req,res) => {
    try {
        const {userId} =req;
        //bring these info from frontend
        const {itemId, size, qty} = req.body;
        // based on user's id(unique thing), look for a shopping cart
        let cart = await Cart.findOne({userId:userId});

        // if a user doesn't have a cart, then create one for them
        if(!cart) {
            cart = new Cart({userId});
            await cart.save();
        }

        // check the same items already in the shopping cart or not
        // consider itemId and size both
        const existItem = cart.items.find((item) => 
            // equals: because type of itemId is mongoose.ObjectId
            item.itemId.equals(itemId) && 
            // type of size is String
            item.size === size);

        // if so, then throw an error
        if(existItem) {
            throw new Error("The item was already added.");
        }
        
        // otherwise, add (new)items into (an existed)shopping cart
        cart.items = [...cart.items, {itemId, size, qty}];
        await cart.save();
        res.status(200).json({status:"success", data:cart, cartItemQty:cart.items.length});
    } catch(error) {
        res.status(400).json({status:"fail", error:error.message});
    }
};

cartController.getCartList = async(req,res) => {
    try {
        const {userId} = req;
        const cart = await Cart.findOne({userId}).populate({
            path:"items",
            populate:{
                path:"itemId",
                model:"Item",
            }});
        
        res.status(200).json({status:"success", data:cart.items});
    } catch(error) {
        res.status(400).json({status:"fail", error:error.message});
    }
};

cartController.deleteCartItem = async(req,res) => {
    try {
        const {userId} = req;
        const {itemId} = req.body;
        const cartItem = await Cart.findById({_id:itemId});
        res.status(200).json({status:"success"});
    } catch(error) {
        res.status(400).json({status:"fail"});
    }
};


module.exports = cartController;