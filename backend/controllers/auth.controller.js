const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config()
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const authController = {}

authController.loginWithEmail = async(req, res) => {
    try{
        const {email, password} = req.body;
        let user = await User.findOne({email});
        if(user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if(isMatch) {
                // creating a token from User.js in models
                const token = await user.generateToken();
                return res.status(200).json({status:"success", user, token});
            }
        }
        throw new Error("Invalid email or password");

    } catch(error){
        res.status(400).json({status:"fail", error:error.message});
    }
};

// middle ware should have 'next'
authController.authenticate = async (req,res,next) => {
    try {
        const tokenString = req.headers.authorization
        if(!tokenString) throw new Error("The token not found");
        
        // how to get the only token values not with "Bearer "
        const token = tokenString.replace("Bearer ", "");
        jwt.verify(token, JWT_SECRET_KEY, (error, payload)=>{
            if(error) throw new Error("Invalid token");
            // in User.js in models folder
            req.userId = payload._id;
        });
        next(); // after authController.authenticate, next to userController.getUser

    } catch(error) {
        res.status(400).json({status:"fail", error:error.message})
    }
};

authController.checkAdminPermission = async (req, res, next) => {
    try {
        const {userId} = req;
        const user = await User.findById(userId);

        if(user.level !== "admin") throw new Error ("No permission");
        next();

    } catch (error) {
        res.status(400).json({staus:"fail", error:error.message});
    }
};



module.exports = authController;