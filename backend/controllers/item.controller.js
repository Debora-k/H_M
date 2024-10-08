const Item = require("../models/Item");


const PAGE_SIZE = 1;
const itemController = {}

itemController.createItem = async (req,res) => {
    try {
        const {
            sku, 
            name, 
            size, 
            image, 
            category, 
            description, 
            price,
            stock, 
            status, 
        } = req.body;
        const item = new Item({
            sku, 
            name, 
            size, 
            image, 
            category, 
            description, 
            price, 
            stock, 
            status,
        });
        await item.save();
        res.status(200).json({status:"success", item});
    } catch (error) {
        res.status(400).json({status:"fail", error: error.message});
    }
};

itemController.getItems = async (req,res) => {
    try {
        const {page,name, specialty} = req.query;
        const condition = name
        ? {name:{$regex:name,$options:"i"}, isDeleted:false}
        : {isDeleted: false};
        let query = Item.find(condition);
        let response = {status:"success"};


        if(page && !specialty){
            //mongoose: skip() and limit()
            //display only 5 items in one page
            query.skip((page-1)*PAGE_SIZE).limit(PAGE_SIZE);
            // total pages & total datas of items
            const totalItemNum = await Item.find(condition).countDocuments();
            const totalPageNum = Math.ceil(totalItemNum/PAGE_SIZE);
            response.totalPageNum = totalPageNum;
        };

        // this if statement is for setting up landing page pagination
        if(specialty && page) {
            
            query.skip((page-1)*10).limit(10);
            const totalItemNum = await Item.find(condition).countDocuments();
            const totalPageNum = Math.ceil(totalItemNum/10);
            response.totalPageNum = totalPageNum;
        };
        

        // exec: runs
        const itemList = await query.exec();
        response.data = itemList;
        // if(name) {
        //     // $regex:name : doesn't need to search by exact names
        //     // $options:"i" : uppercase / lowercase both are okay (case insensitive)
        //     const items = await Item.find({name:{$regex:name,$options:"i"}});
        // } else {
        //     const items = await Item.find({});
        // }
        const items = await Item.find({}); 
        res.status(200).json(response);
    } catch(error) {
        res.status(400).json({status:"fail", error: error.message});
    }
};

itemController.updateItem = async(req,res) => {
    try{
      //bring the "/:id"
        const itemId = req.params.id;
        const {
            sku,
            name,
            size,
            image,
            price,
            description,
            category,
            stock,
            status
        } = req.body;

        const item = await Item.findByIdAndUpdate({_id:itemId}, 
        {
            sku,
            name,
            size,
            image,
            price,
            description,
            category,
            stock,
            status
        },{new:true}); // :want to get new returns then this
    
        if(!item) throw new Error("The item doesn't exist.");
        res.status(200).json({status:"success", data: item});
    } catch(error) {
        res.status(400).json({status:"fail", error:error.message});
    }
};

itemController.deleteItem = async(req,res) => {
    try{
        const itemId = req.params.id;

        const item = await Item.findByIdAndUpdate(
            {_id:itemId}, 
            {isDeleted:true});
            // {status:"inactive",isDeleted:true}
            

        res.status(200).json({status:"success"});

    } catch(error){
        res.status(400).json({status:"fail", error:error.message});
    }
};

itemController.getItemById = async(req,res) => {
    try {
        const itemId = req.params.id;
        const item = await Item.findById(itemId);
        if(!item) throw new Error("No item found!");
        res.status(200).json({status:"success", data:item});
    } catch(error) {
        return res.status(400).json({staus:"fail", error:error.message});
    }
};


itemController.checkStock = async (item) => {
    // Bring each item from a customer's orderList
    const eachItem = await Item.findById(item.itemId);

    //compare between how many of stocks a customer wants to buy and real stocks
    // item.qty from orderList (a customer)
    // eachItem 안에있는 재고[자세한사이즈]와 내가 주문하려는 수량을 비교한다
    if(eachItem.stock[item.size] < item.qty) {
        return {isVerify:false, message: `Currently, ${item.size.toUpperCase()} size of ${eachItem.name} is low in stock. We are so sorry.`};
    }

    //enough stocks then process and update stocks after purchase
    const newStock = {...eachItem.stock};
    // after ordering this, deducted stocks of the item(item.size)
    newStock[item.size] -= item.qty;
    eachItem.stock = newStock;

    await eachItem.save();
    return {isVerify:true};
};


itemController.checkItemListStock = async (orderList) => {
    const insufficientStockItems = []; //to save items which don't have stock
    
    // there are some awaits, so using Promise.all to finish this earlier
    await Promise.all(
    // check the stocks
    orderList.map(async (item) => {
        const stockCheck = await itemController.checkStock(item);
        console.log(stockCheck);
        if(!stockCheck.isVerify) {
            insufficientStockItems.push({item, message:stockCheck.message});
        }
        return stockCheck;
    }));


    return insufficientStockItems;
}

module.exports = itemController;