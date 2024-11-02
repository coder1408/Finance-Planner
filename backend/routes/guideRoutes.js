const express = require("express");
const {getFinancialOverview, getBudgetAdvice, getGoalProgress, getLoanRepaymentAdvice} = require("../controllers/guideController")
const router = express.Router();

router.get("/overview", getFinancialOverview);
router.get("/budget-advice", getBudgetAdvice);
router.get("/goal-progress", getGoalProgress);
router.get("/loan-repayment-advice", getLoanRepaymentAdvice);

module.exports = router;