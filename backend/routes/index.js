const express = require("express");
const router = express.Router();
const userApi = require("./user.api");
const authApi = require("./auth.api");
const itemApi = require("./item.api");
const cartApi = require("./cart.api");

router.use("/user", userApi);
router.use("/auth", authApi);
router.use("/item", itemApi);
router.use("/shoppingcart",cartApi);

module.exports = router;