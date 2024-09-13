const express = require("express");
const router = express.Router();
const userApi = require("./user.api");
const authApi = require("./auth.api");
const itemApi = require("./item.api");
const cartApi = require("./cart.api");
const orderApi = require("./order.api");

router.use("/user", userApi);
router.use("/auth", authApi);
router.use("/item", itemApi);
router.use("/shoppingcart",cartApi);
router.use("/order", orderApi);

module.exports = router;