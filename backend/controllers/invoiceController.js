const PDFDocument = require("pdfkit");
const fs = require("fs");
const Budget = require("../models/Budget");
const Expense = require("../models/Expense");
const Goal = require("../models/Goal");
const Loan = require("../models/Loan");


exports.generateInvoice = async (req, res) => {
  try {
    const userId = req.user.id; 

    
    const budgets = await Budget.find({ userId });
    const expenses = await Expense.find({ userId });
    const goals = await Goal.find({ userId });
    const loans = await Loan.find({ userId });

    
    const doc = new PDFDocument();
    const fileName = `Invoice-${userId}-${Date.now()}.pdf`;
    const filePath = `./invoices/${fileName}`;

    
    doc.pipe(fs.createWriteStream(filePath));

    
    doc.info.Title = "Financial Invoice";
    doc.info.Author = "Financial Planner";

    
    doc.fontSize(18).text("Financial Planner Invoice", { align: "center" });
    doc.moveDown();

    
    doc.fontSize(14).text("User ID: " + userId, { align: "left" });
    doc.text("Date: " + new Date().toLocaleDateString());
    doc.moveDown();

    //Budget Summary 
    doc.fontSize(16).text("Budget Summary", { underline: true });
    budgets.forEach(budget => {
      const totalSpent = expenses
        .filter(exp => exp.category === budget.category)
        .reduce((sum, exp) => sum + exp.amount, 0);

      doc.fontSize(12)
        .text(`Category: ${budget.category}`)
        .text(`Budget Limit: ${budget.limit || "No Limit"}`)
        .text(`Total Spent: ${totalSpent}`)
        .moveDown();
    });

    // Expenses Summary
    doc.fontSize(16).text("Expenses Summary", { underline: true });
    expenses.forEach(expense => {
      doc.fontSize(12)
        .text(`Category: ${expense.category}`)
        .text(`Amount: ${expense.amount}`)
        .text(`Date: ${new Date(expense.date).toLocaleDateString()}`)
        .moveDown();
    });

    // Goals Summary
    doc.fontSize(16).text("Goals Summary", { underline: true });
    goals.forEach(goal => {
      const progress = ((goal.currentAmount / goal.targetAmount) * 100).toFixed(2);
      doc.fontSize(12)
        .text(`Category: ${goal.category}`)
        .text(`Target Amount: ${goal.targetAmount}`)
        .text(`Current Amount: ${goal.currentAmount}`)
        .text(`Progress: ${progress}%`)
        .moveDown();
    });

    // Loans Summary
    doc.fontSize(16).text("Loans Summary", { underline: true });
    loans.forEach(loan => {
      const monthlyInterestRate = loan.interestRate / 12 / 100;
      const totalPayments = loan.term * 12;
      const monthlyPayment = loan.loanAmount * monthlyInterestRate / 
        (1 - Math.pow(1 + monthlyInterestRate, -totalPayments));
      
      doc.fontSize(12)
        .text(`Loan Type: ${loan.loanType}`)
        .text(`Loan Amount: ${loan.loanAmount}`)
        .text(`Interest Rate: ${loan.interestRate}%`)
        .text(`Term: ${loan.term} years`)
        .text(`Monthly Payment: ${monthlyPayment.toFixed(2)}`)
        .text(`Status: ${loan.status}`)
        .moveDown();
    });

    
    doc.end();

    
    doc.on("finish", () => {
      res.status(200).json({ message: "Invoice generated", filePath });
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate invoice" });
  }
};
