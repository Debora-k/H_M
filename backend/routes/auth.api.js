const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// /auth/login
router.post("/login", authController.loginWithEmail);
// /auth/google
router.post("/google", authController.loginWithGoogle);
module.exports = router;