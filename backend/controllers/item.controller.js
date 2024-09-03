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
        const condition = name?{name:{$regex:name,$options:"i"}}:{}
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
}

module.exports = itemController;