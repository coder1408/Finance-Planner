const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const Budget = require("../models/Budget");
const Expense = require("../models/Expense");
const Goal = require("../models/Goal");
const Loan = require("../models/Loan");

exports.generateInvoice = async (req, res) => {
  // Add authentication debugging
  console.log('Auth Debug:', {
    headers: req.headers,
    user: req.user,
    token: req.headers.authorization
  });

  // Check authentication
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

  // Create invoices directory if it doesn't exist
  const invoicesDir = path.join(__dirname, "../invoices");
  if (!fs.existsSync(invoicesDir)) {
    try {
      fs.mkdirSync(invoicesDir, { recursive: true });
    } catch (err) {
      console.error("Failed to create invoices directory:", err);
      return res.status(500).json({ error: "Failed to create invoices directory" });
    }
  }

  try {
    // Fetch data with error handling
    const [budgets, expenses, goals, loans] = await Promise.all([
      Budget.find({ userId }).lean().exec(),
      Expense.find({ userId }).lean().exec(),
      Goal.find({ userId }).lean().exec(),
      Loan.find({ userId }).lean().exec()
    ]).catch(err => {
      console.error("Database query failed:", err);
      throw new Error("Failed to fetch financial data");
    });

    const fileName = `Invoice-${userId}-${Date.now()}.pdf`;
    const filePath = path.join(invoicesDir, fileName);

    // Create PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      info: {
        Title: "Financial Invoice",
        Author: "Financial Planner",
        Creator: "Financial Planning Application"
      }
    });

    // Set up error handling for the PDF stream
    const stream = fs.createWriteStream(filePath);
    let streamError = null;

    stream.on('error', (err) => {
      console.error("Stream error:", err);
      streamError = err;
    });

    // Pipe the PDF document to the write stream
    doc.pipe(stream);

    // Add content to PDF
    try {
      // Header
      doc.fontSize(24).text("Financial Planner Invoice", { align: "center" });
      doc.moveDown();
      doc.fontSize(12).text(`Generated: ${new Date().toLocaleString()}`);
      doc.text(`User ID: ${userId}`);
      doc.moveDown();

      // Budget Summary
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

      // Expenses Summary
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

      // Goals Summary
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

      // Loans Summary
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

      // Finalize the PDF
      doc.end();

      // Return success response when the stream is finished
      stream.on('finish', () => {
        if (streamError) {
          throw streamError;
        }

        // Return the file path relative to the public directory
        const publicPath = `/invoices/${fileName}`;
        res.status(200).json({
          message: "Invoice generated successfully",
          filePath: publicPath
        });
      });

    } catch (err) {
      console.error("Error generating PDF content:", err);
      // Clean up the partially created file
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      throw new Error("Failed to generate PDF content");
    }

  } catch (error) {
    console.error("Invoice generation failed:", error);
    res.status(500).json({
      error: "Failed to generate invoice",
      details: error.message
    });
  }
};
