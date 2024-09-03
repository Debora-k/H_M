const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./User");
const Item = require("./Item");
const orderSchema = Schema({
    userId: {type: mongoose.ObjectId, ref:User, required:true},
    status: {type: String, default: "preparing"},
    totalPrice: {type: Number, required:true, default:0},
    shipTo:{type: Object, required:true},
    contact:{type: Object, required:true},
    orderNum: {type:String, unique:true},
    items:[{
        itemId: {type:mongoose.ObjectId, ref:Item, required:true}, 
        size: {type:String, required:true},
        qty: {type:Number, default:1, required:true},
        price: {type:Number, required:true}
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

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
