// routes/loans.js
const express = require("express");
const Loan = require("../models/Loan");
const router = express.Router();
const  { authMiddleware } = require("../middleware/auth");

// Create a new loan
router.post("/", authMiddleware, async (req, res) => {
    console.log("POST /loans route hit"); // Add this line
    console.log("Request body:", req.body); // Log request body for inspection
  try {
    const loan = new Loan(req.body);
    await loan.save();
    res.status(201).json(loan);
    console.log("Loan added");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all loans
router.get("/", authMiddleware, async (req, res) => {
  try {
    const loans = await Loan.find();
    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a loan by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan) return res.status(404).json({ message: "Loan not found" });
    res.json(loan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a loan
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const loan = await Loan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!loan) return res.status(404).json({ message: "Loan not found" });
    res.json(loan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a loan
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const loan = await Loan.findByIdAndDelete(req.params.id);
    if (!loan) return res.status(404).json({ message: "Loan not found" });
    res.json({ message: "Loan deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
