const express = require("express");
const {getFinancialOverview, getBudgetAdvice, getGoalProgress, getLoanRepaymentAdvice} = require("../controllers/guideController");
const { authMiddleware } = require("../middleware/auth");
const router = express.Router();

// Add authMiddleware to protect all routes
router.get("/overview", authMiddleware, getFinancialOverview);
router.get("/goal-progress", authMiddleware, getGoalProgress);
router.get("/loan-repayment-advice", authMiddleware, getLoanRepaymentAdvice);

module.exports = router;
