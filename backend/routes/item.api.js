const express = require("express");
const authController = require("../controllers/auth.controller");
const router = express.Router();
const itemController = require("../controllers/item.controller");

// need to add middleware for checking authentication as an admin
router.post("/", 
    authController.authenticate,
    authController.checkAdminPermission,
    itemController.createItem);

//bring items 
router.get("/", itemController.getItems);

//edit an item
router.put("/:id",  
    authController.authenticate,
    authController.checkAdminPermission,
    itemController.updateItem);

    
module.exports = router;