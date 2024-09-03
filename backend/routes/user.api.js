const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authController = require("../controllers/auth.controller");

//sign up page
router.post("/", userController.createUser);

// check whether a token is valid or not and from the token will be returned to the right user
// middle ware
router.get("/me", authController.authenticate, userController.getUser);

module.exports = router;