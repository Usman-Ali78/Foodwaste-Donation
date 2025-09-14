const express = require("express");
const router = express.Router();
const { getProfile, updateProfile ,getCurrentUser } = require("../controller/userController");
const authMiddleware = require("../middleware/authMiddleware");

// Profile Routes
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.get("/me", authMiddleware, getCurrentUser);

module.exports = router;
