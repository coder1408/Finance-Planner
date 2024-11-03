const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const Budget = require("../models/Budget");
const Expense = require("../models/Expense");
const Goal = require("../models/Goal");
const Loan = require("../models/Loan");

exports.generateInvoice = async (req, res) => {
  console.log('Auth Debug:', {
    headers: req.headers,
    user: req.user,
    token: req.headers.authorization
  });

  if (!req.headers.authorization) {
    return res.status(401).json({
      error: "No authorization header present",
      details: "Authentication token is required"
    });
  }

  if (!req.user || !req.user.id) {
    return res.status(401).json({
      error: "User not authenticated",
      details: "Valid user session not found"
    });
  }

  const userId = req.user?._id;
  if (!userId) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  try {
    const [budgets, expenses, goals, loans] = await Promise.all([
      Budget.find({ userId }).lean().exec(),
      Expense.find({ userId }).lean().exec(),
      Goal.find({ userId }).lean().exec(),
      Loan.find({ userId }).lean().exec()
    ]);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=Invoice-${userId}-${Date.now()}.pdf`);

    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      info: {
        Title: "Financial Invoice",
        Author: "Financial Planner",
        Creator: "Financial Planning Application"
      }
    });

    doc.pipe(res);

    doc.fontSize(24).text("Financial Planner Invoice", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Generated: ${new Date().toLocaleString()}`);
    doc.text(`User ID: ${userId}`);
    doc.moveDown();

    if (budgets.length > 0) {
      doc.fontSize(16).text("Budget Summary", { underline: true });
      doc.moveDown();

      budgets.forEach(budget => {
        const totalSpent = expenses
          .filter(exp => exp.category === budget.category)
          .reduce((sum, exp) => sum + (exp.amount || 0), 0);

        doc.fontSize(12)
          .text(`Category: ${budget.category}`)
          .text(`Budget Limit: $${(budget.limit || 0).toFixed(2)}`)
          .text(`Total Spent: $${totalSpent.toFixed(2)}`)
          .moveDown();
      });
    }

    if (expenses.length > 0) {
      doc.fontSize(16).text("Expenses Summary", { underline: true });
      doc.moveDown();

      expenses.forEach(expense => {
        doc.fontSize(12)
          .text(`Category: ${expense.category}`)
          .text(`Amount: $${(expense.amount || 0).toFixed(2)}`)
          .text(`Date: ${new Date(expense.date).toLocaleDateString()}`)
          .moveDown();
      });
    }

    if (goals.length > 0) {
      doc.fontSize(16).text("Goals Summary", { underline: true });
      doc.moveDown();

      goals.forEach(goal => {
        const progress = ((goal.currentAmount / goal.targetAmount) * 100).toFixed(2);
        doc.fontSize(12)
          .text(`Category: ${goal.category}`)
          .text(`Target Amount: $${(goal.targetAmount || 0).toFixed(2)}`)
          .text(`Current Amount: $${(goal.currentAmount || 0).toFixed(2)}`)
          .text(`Progress: ${progress}%`)
          .moveDown();
      });
    }

    if (loans.length > 0) {
      doc.fontSize(16).text("Loans Summary", { underline: true });
      doc.moveDown();

      loans.forEach(loan => {
        const monthlyInterestRate = (loan.interestRate || 0) / 12 / 100;
        const totalPayments = (loan.term || 0) * 12;
        const monthlyPayment = totalPayments > 0
          ? (loan.loanAmount * monthlyInterestRate) /
            (1 - Math.pow(1 + monthlyInterestRate, -totalPayments))
          : 0;

        doc.fontSize(12)
          .text(`Loan Type: ${loan.loanType}`)
          .text(`Loan Amount: $${(loan.loanAmount || 0).toFixed(2)}`)
          .text(`Interest Rate: ${(loan.interestRate || 0).toFixed(2)}%`)
          .text(`Term: ${loan.term} years`)
          .text(`Monthly Payment: $${monthlyPayment.toFixed(2)}`)
          .text(`Status: ${loan.status}`)
          .moveDown();
      });
    }

    doc.end();
  } catch (error) {
    console.error("Invoice generation failed:", error);
    res.status(500).json({
      error: "Failed to generate invoice",
      details: error.message
    });
  }
};
