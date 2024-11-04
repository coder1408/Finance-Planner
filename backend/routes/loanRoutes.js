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

// Get loans by userId
router.get("/user/:userId", authMiddleware, async (req, res) => {
  try {
    const loans = await Loan.find({ userId: req.params.userId });
    if (!loans.length) return res.status(404).json({ message: "No loans found for this user" });
    res.json(loans);
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


// Add a payment to a loan
router.post("/:loanId/payments", authMiddleware, async (req, res) => {
  console.log("Payment route hit", req.body); 
  const { loanId } = req.params;  
  console.log("Params:", req.params); 
  console.log("Body:", req.body); 
  console.log("Received loanId:", loanId);
  console.log(typeof loanId);

  const { amount } = req.body; 
  console.log("Amount received:", amount);

  
  if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
    return res.status(400).json({ message: "Invalid payment amount" });
  }

  try {
    const loan = await Loan.findById(loanId);
    if (!loan) {
      console.log("Loan not found for loanId:", loanId);
      return res.status(404).json({ message: "Loan not found" });
    }

    console.log("Loan found:", loan);

    
    loan.payments.push(parseFloat(amount)); 
    console.log("Payment added to loan.payments:", loan.payments);

    await loan.save();
    console.log("Loan saved successfully with updated payments:", loan.payments);

    res.status(200).json({ message: "Payment added successfully", loan });
  } catch (error) {
    console.error("Error adding payment:", error); 
    res.status(400).json({ message: error.message });
  }
});

router.get('/:loanId/payments', authMiddleware, async (req, res) => {
  const { loanId } = req.params; 

  try {
      // Find the loan by loanId
      const loan = await Loan.findById(loanId);
      if (!loan) {
          return res.status(404).json({ message: 'Loan not found' });
      }

      
      res.status(200).json({ payments: loan.payments });
  } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
