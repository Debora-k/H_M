const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./User");
const Item = require("./Item");
const Cart = require("./Cart");

const orderSchema = Schema({
    userId: {type: mongoose.ObjectId, ref:User, required:true},
    status: {type: String, default: "preparing"},
    totalPrice: {type: Number, required:true, default:0},
    shipTo:{type: Object, required:true},
    contact:{type: Object, required:true},
    orderNum: {type:String},
    items:[{
            itemId: {type:mongoose.ObjectId, ref:Item, required:true}, 
            size: {type:String, required:true},
            qty: {type:Number, default:1, required:true},
            price: {type:Number, required:true},
        },
    ],
}, {timestamps:true})

// methods.toJSON helps to control displays to customers
orderSchema.methods.toJSON = function () {
    const obj = this._doc
    delete obj.__v // version info
    delete obj.updateAt
    delete obj.createAt
    return obj // after which removed, returns "obj" to customers
}
// after an order completed, it will be changed to empty with this order.Schema.post
orderSchema.post("save", async function () {
    const cart = await Cart.findOne({userId:this.userId});
    cart.items = [];
    await cart.save();
})

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
