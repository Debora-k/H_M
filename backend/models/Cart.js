const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./User");
const cartSchema = Schema({
    userId:{type: mongoose.ObjectId, ref:User},
    items:[{
        itemId: {type:mongoose.ObjectId, ref:Item}, 
        size: {type:String, required:true},
        qty: {type:Number, default:1, required:true},
    },
],
}, {timestamps:true})

// methods.toJSON helps to control displays to customers
cartSchema.methods.toJSON = function () {
    const obj = this._doc
    delete obj.__v // version info
    delete obj.updateAt
    delete obj.createAt
    return obj // after which removed, returns "obj" to customers
}

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
