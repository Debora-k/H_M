const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const itemSchema = Schema({
    sku:{type:String, required:true, unique:true},
    name:{type:String, required:true},
    image:{type:String, required:true},
    category:{type:Array, required:true}, //an item can be in tops and jackets 
    stock:{type:Object, required:true},
    description:{type:String, required:true},
    size:{type:Array, required:true},
    price:{type:Number, required:true},
    status:{type:String, default:"active"},
    isDeleted:{type:Boolean, default:false},
}, {timestamps:true})

// methods.toJSON helps to control displays to customers
itemSchema.methods.toJSON = function () {
    const obj = this._doc
    delete obj.__v // version info
    delete obj.updateAt
    delete obj.createAt
    return obj // after which removed, returns "obj" to customers
}

const Item = mongoose.model("Item", itemSchema);
module.exports = Item;
