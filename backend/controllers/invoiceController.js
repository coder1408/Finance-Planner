const jwt = require("jsonwebtoken");
const User = require("../models/User");
const PDFDocument = require("pdfkit");
const Budget = require("../models/Budget");
const Expense = require("../models/Expense");
const Goal = require("../models/Goal");
const Loan = require("../models/Loan");

exports.generateInvoice = async (req, res) => {
    // Step 1: Extract the token from the request headers
    const token = req.headers["authorization"]?.split(" ")[1];

    // Debug logging for headers and token
    console.log('Request Headers:', req.headers);
    console.log('Received Token:', token);

    // Step 2: Validate the token
    if (!token) {
        return res.status(401).json({
            error: "No authorization token provided",
            details: "Authentication token is required"
        });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded); // Log decoded token for debugging
    } catch (err) {
        console.error("Token verification failed:", err);
        return res.status(401).json({
            error: "Invalid token",
            details: err.message
        });
    }

    // Step 3: Check user existence in the database
    const userId = decoded.userId; // Make sure this matches your token structure
    const user = await User.findById(userId);

    if (!user) {
        return res.status(401).json({
            error: "User not found",
            details: "No user associated with this token"
        });
    }

    // Step 4: Generate the PDF invoice if authenticated
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

        // Add content to PDF
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

        // Similar logic for Expenses, Goals, and Loans...

        doc.end();
    } catch (error) {
        console.error("Invoice generation failed:", error);
        res.status(500).json({
            error: "Failed to generate invoice",
            details: error.message
        });
    }
};
