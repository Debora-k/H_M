const User = require("../models/User");
const bcrypt = require("bcryptjs");

const userController={}

userController.createUser = async(req,res) => {
    try {
        // 'level' for admins
        let {email, password, name, level} = req.body;
        const user = await User.findOne({email}); // checking the email that is right one
        if(user) {
            throw new Error("User already exists");
        }

        // make sure every password is encrypted
        const salt = await bcrypt.genSaltSync(10);
        password = await bcrypt.hash(password,salt);
        const newUser = new User({email,password,name,level:level?level:'customer'});
        await newUser.save(); 
        return res.status(200).json({status:"success"});

    } catch(error){
        res.status(400).json({status:"fail", error: error.message});
    }
}

userController.getUser = async(req,res) => {
    try {
        // from auth.controller.js
        const { userId } = req;
        const user = await User.findById(userId);
        if(user) {
            res.status(200).json({status: "success", user});
            return;
        }; 
        throw new Error("Invalid token");
        
    } catch(error) {
        res.status(400).json({status:"error", error: error.message});
    }
}

module.exports= userController;