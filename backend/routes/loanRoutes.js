const express = require("express");
const router = express.Router();
const Loan = require("../models/Loan"); 
const authMiddleware = require("../middleware/auth"); // This should be fine if the path is correct

// Middleware to check authentication
router.use(authMiddleware); 

// Create a new loan entry
router.post("/", async (req, res) => {
    const { loanType, principalAmount, interestRate, duration, startDate } = req.body;
    const userId = req.user.id; 
    const newLoan = new Loan({
        loanType,
        principalAmount,
        interestRate,
        duration,
        startDate,
        userId,
    });

    try {
        const savedLoan = await newLoan.save();
        res.status(201).json(savedLoan);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all loans for a user
router.get("/", async (req, res) => {
    const userId = req.user.id; // Use authenticated user's ID

    try {
        const loans = await Loan.find({ userId });
        res.status(200).json(loans);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router; 
