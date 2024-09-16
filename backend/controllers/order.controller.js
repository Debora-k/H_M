const orderController = {}
const Order = require("../models/Order");
const itemController = require("./item.controller");
const { randomStringGenerator } = require("../utils/randomStringGenerator");


const PAGE_SIZE = 10;

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

orderController.getOrder = async(req,res) => {
    try{
        const {userId} = req;
        const orderList = await Order.find({userId: userId}).populate({
            path:"items",
            populate: {
                path:"itemId",
                model:"Item",
                select: "image name",
            },
        });
        const totalItemNum = await Order.find({userId: userId}).countDocuments();
        const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
        return res.status(200).json({status:"success", data:orderList, totalPageNum});
    } catch(error){
        return res.status(400).json({status:"failed", error: error.message});
    }
};

orderController.getOrderList = async(req,res) => {
    try{
        const {page, orderNum} = req.query;

        let condition = {};
        if (orderNum) {
            condition = {
                orderNum: {$regex: orderNum, $options: "i"}
            };
        }

        const orderList = await Order.find(condition)
            .populate("userId")
            .populate({
                path: "items",
                populate: {
                    path:"itemId",
                    model: "Item",
                    select: "image name",
                },

            })
            .skip((page - 1) * PAGE_SIZE)
            .limit(PAGE_SIZE);

        const totalItemNum = await Order.find(condition).countDocuments();
        const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
        return res.status(200).json({status:"success", data:orderList, totalPageNum});
    } catch(error) {
        return res.status(400).json({status:"failed", error: error.message});
    }
};

orderController.updateOrder = async (req, res, next) => {
    try {
        const {id} = req.params;
        const {status} = req.body;
        const order = await Order.findByIdAndUpdate(
            id,
            {status: status},
            {new:true}
        );
        if(!order) throw new Error("Can't find the order");
        return res.status(200).json({status:"success", data:order});
    } catch(error) {
        return res.status(400).json({status:"failed", error: error.message});
    }
}

module.exports = orderController;