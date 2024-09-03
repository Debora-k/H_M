const express = require("express");
const router = express.Router();
const userApi = require("./user.api");
const authApi = require("./auth.api");
const itemApi = require("./item.api");

router.use("/user", userApi);
router.use("/auth", authApi);
router.use("/item", itemApi);

module.exports = router;