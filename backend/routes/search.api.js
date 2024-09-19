const express = require("express");
const searchController = require("../controllers/search.controller");
const router = express.Router();


router.post("/home",searchController.popularItems);


module.exports =router;