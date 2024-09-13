const orderController = {}
const Order = require("../models/Order");
const itemController = require("./item.controller");
const { randomStringGenerator } = require("../utils/randomStringGenerator");

orderController.createOrder = async(req,res) => {
    try{ 
        // userId from middleware
        const {userId} = req;
        const {shipTo, contact, totalPrice, orderList} = req.body;

        // check stocks in checkItemListStock by bringing an orderList 
        const insufficientStockItems = await itemController.checkItemListStock(orderList);

        // if there's lack of stocks among items => throw an error
        if(insufficientStockItems.length > 0) {
            const errorMessage = insufficientStockItems.reduce(
                (total,items) => total += items.message,""); //"" means return in String type
            throw new Error(errorMessage);
        }

        //create a new order
        const newOrder = new Order({
            userId,
            totalPrice,
            shipTo,
            contact,
            items: orderList,
            orderNum:randomStringGenerator()
        });

        await newOrder.save();
        // after save, need to make the cart empty
        
        return res.status(200).json({status:"success", orderNum: newOrder.orderNum});
        
    } catch(error) {
        console.log(error);
        return res.status(400).json({status:"failed", error: error.message});
    }
};


module.exports = orderController;