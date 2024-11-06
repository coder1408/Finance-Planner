const jwt = require("jsonwebtoken");
const User = require("../models/User");
const PDFDocument = require("pdfkit");
const Budget = require("../models/Budget");
const Expense = require("../models/Expense");
const Goal = require("../models/Goal");
const Loan = require("../models/Loan");


exports.generateInvoice = async (req, res) => {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            error: "No authorization token provided",
            details: "Authentication token is required"
        });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return res.status(401).json({
            error: "Invalid token",
            details: err.message
        });
    }

    const userId = decoded.userId;
    const user = await User.findById(userId);

    if (!user) {
        return res.status(401).json({
            error: "User not found",
            details: "No user associated with this token"
        });
    }

    try {
        const [budgets, expenses, goals, loans] = await Promise.all([
            Budget.find({ userId }).lean().exec(),
            Expense.find({ userId }).lean().exec(),
            Goal.find({ userId }).lean().exec(),
            Loan.find({ userId }).lean().exec()
        ]);

        // Set headers after all data is fetched successfully
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=Invoice-${userId}-${Date.now()}.pdf`);

        // Start the PDF generation only after successful data retrieval
        const doc = new PDFDocument({
            size: 'A4',
            margin: 50,
            info: {
                Title: "Financial Invoice",
                Author: "Financial Planner",
                Creator: "Financial Planning Application"
            }
        });
        doc.pipe(res); // Pipe PDF output to the response

        // Title and User Info
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
                const budgetLimit = budget.limit ? budget.limit.toFixed(2) : "Not Set";
                const totalSpent = expenses
                    .filter(exp => exp.category === budget.category)
                    .reduce((sum, exp) => sum + (exp.amount || 0), 0);
                doc.fontSize(12)
                    .text(`Category: ${budget.category}`)
                    .text(`Budget Limit: ${budgetLimit}`)
                    .moveDown();
            });
        }

        // Expenses Summary
        if (expenses.length > 0) {
            doc.addPage();
            doc.fontSize(16).text("Expenses Summary", { underline: true });
            doc.moveDown();
            expenses.forEach(expense => {
                doc.fontSize(12)
                    .text(`Amount: $${(expense.amount || 0).toFixed(2)}`)
                    .text(`Date: ${new Date(expense.date).toLocaleDateString()}`)
                    .moveDown();
            });
        }

        // Goals Summary
        if (goals.length > 0) {
            doc.addPage();
            doc.fontSize(16).text("Goals Summary", { underline: true });
            doc.moveDown();
            goals.forEach(goal => {
                doc.fontSize(12)
                    .text(`Goal: ${goal.category}`)
                    .text(`Target Amount: $${(goal.targetAmount || 0).toFixed(2)}`)
                    .moveDown();
            });
        }

        // Loans Summary
        if (loans.length > 0) {
            doc.addPage();
            doc.fontSize(16).text("Loans Summary", { underline: true });
            doc.moveDown();
            loans.forEach(loan => {
                doc.fontSize(12)
                    .text(`Loan Type: ${loan.loanType}`)
                    .text(`Principal Amount: $${(loan.loanAmount || 0).toFixed(2)}`)
                    .text(`Interest Rate: ${loan.interestRate}%`)
                    .moveDown();
            });
        }

        doc.end(); // Close the document after all content is written

    } catch (error) {
        console.error("Invoice generation failed:", error);
        res.status(500).json({
            error: "Failed to generate invoice",
            details: error.message
        });
    }
};


exports.getFinancialSummary = async (req, res) => {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            error: "No authorization token provided",
            details: "Authentication token is required"
        });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return res.status(401).json({
            error: "Invalid token",
            details: err.message
        });
    }

    const userId = decoded.userId;
    const user = await User.findById(userId);

    if (!user) {
        return res.status(401).json({
            error: "User not found",
            details: "No user associated with this token"
        });
    }

    try {
        const [budgets, expenses, goals, loans] = await Promise.all([
            Budget.find({ userId }).lean().exec(),
            Expense.find({ userId }).lean().exec(),
            Goal.find({ userId }).lean().exec(),
            Loan.find({ userId }).lean().exec()
        ]);

        res.status(200).json({
            budgets,
            expenses,
            goals,
            loans
        });

        console.log("budgets", budgets);
        console.log("expenses", expenses);
        console.log("loans", loans);
        console.log("goals", goals);

    } catch (error) {
        console.error("Failed to retrieve financial summary:", error);
        res.status(500).json({
            error: "Failed to retrieve financial summary",
            details: error.message
        });
    }
};

