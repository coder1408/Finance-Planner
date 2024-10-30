const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const { getUserProfile, updateUserProfile } = require('../controllers/userController');

const router = express.Router();

// Apply auth middleware to protect routes
router.use(authMiddleware); // Ensure this is applied

// Fetch user profile including expenses, budgets, and loans
router.get("/profile", getUserProfile);

// Update user profile
router.put("/profile", updateUserProfile);

module.exports = router;
