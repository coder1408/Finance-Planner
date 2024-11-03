const Budget = require("../models/Budget");
const Expense = require("../models/Expense");
const Goal = require("../models/Goal");
const Loan = require("../models/Loan");

// Helper function to handle errors
const handleError = (error, res) => {
  console.error('Error details:', error);
  return res.status(500).json({
    error: "Internal server error",
    message: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
  });
};

// Get Financial Overview
exports.getFinancialOverview = async (req, res) => {
  try {
    // Check if user exists in request
    if (!req.user?._id) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const userId = req.user._id;

    // Use Promise.all for parallel execution
    const [budgets, expenses, goals, loans] = await Promise.all([
      Expense.find({ userId }).lean(),
      Goal.find({ userId }).lean(),
      Loan.find({ userId }).lean()
    ]);

    return res.json({
      success: true,
      data: { budgets, expenses, goals, loans }
    });
  } catch (error) {
    return handleError(error, res);
  }
};



// Get Goal Progress
exports.getGoalProgress = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const userId = req.user._id;

    // Fetch all goals for the user
    const goals = await Goal.find({ userId }).lean();

    if (!goals.length) {
      return res.status(404).json({
        error: "No goals found",
        message: "Please set up your financial goals first"
      });
    }

    // Fetch all expenses for the user and group by category
    const expenses = await Expense.aggregate([
      { $match: { userId } },
      { $group: { _id: "$category", totalExpense: { $sum: "$amount" } } }
    ]);

    // Convert expenses to a dictionary for easier lookup by category
    const expenseMap = expenses.reduce((acc, expense) => {
      acc[expense._id] = expense.totalExpense;
      return acc;
    }, {});

    // Calculate goal progress
    const goalProgress = goals.map(goal => {
      const totalExpenseForCategory = expenseMap[goal.category] || 0;
      const currentAmount = goal.targetAmount - totalExpenseForCategory;
      const progress = ((currentAmount / goal.targetAmount) * 100).toFixed(2);

      return {
        category: goal.category,
        targetAmount: goal.targetAmount,
        currentAmount: currentAmount >= 0 ? currentAmount : 0, // Ensure no negative values
        progress: currentAmount > 0 ? progress : "0.00" // Prevent negative progress
      };
    });

    return res.json({
      success: true,
      data: goalProgress
    });
  } catch (error) {
    return handleError(error, res);
  }
};

// Get Loan Repayment Advice
exports.getLoanRepaymentAdvice = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const userId = req.user._id;
    const loans = await Loan.find({ userId, status: "active" }).lean();

    if (!loans.length) {
      return res.status(404).json({
        error: "No active loans found",
        message: "No active loans to analyze"
      });
    }

    const loanAdvice = loans.map(loan => {
      const monthlyInterestRate = loan.interestRate / 12 / 100;
      const totalPayments = loan.term * 12;
      const monthlyPayment = loan.loanAmount * monthlyInterestRate /
          (1 - Math.pow(1 + monthlyInterestRate, -totalPayments));

      return {
        loanType: loan.loanType,
        lender: loan.lender,
        loanAmount: loan.loanAmount,
        interestRate: loan.interestRate,
        term: loan.term,
        monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
        advice: monthlyPayment < 500
            ? "Your loan payments are manageable within your budget."
            : "Consider refinancing options to reduce monthly payments."
      };
    });

    return res.json({
      success: true,
      data: loanAdvice
    });
  } catch (error) {
    return handleError(error, res);
  }
};
