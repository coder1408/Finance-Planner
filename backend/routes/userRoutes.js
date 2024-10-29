const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const { getUserProfile, updateUserProfile, submitFinancialOnboarding } = require('../controllers/userController');

console.log("getUserProfile:", getUserProfile);
console.log("updateUserProfile:", updateUserProfile);
console.log("submitFinancialOnboarding:", submitFinancialOnboarding);


const router = express.Router();

// Fetch user profile including expenses, budgets, and loans
router.get("/profile", getUserProfile);

// Update user profile
router.put("/profile", updateUserProfile);

// Financial onboarding submission
router.post("/Onboarding", submitFinancialOnboarding);

module.exports = router;
