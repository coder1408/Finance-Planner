const Budget = require("../models/Budget");
const Expense = require("../models/Expense");
const Goal = require("../models/Goal");
const Loan = require("../models/Loan");
const { authMiddleware } = require("../middleware/auth");


exports.getFinancialOverview = async (req, res) => {
  try {
    const userId = req.user.id; 

    const budgets = await Budget.find({ userId });
    const expenses = await Expense.find({ userId });
    const goals = await Goal.find({ userId });
    const loans = await Loan.find({ userId });

    res.json({ budgets, expenses, goals, loans });
  } catch (error) {
    res.status(500).json({ error: "Failed to get financial overview" });
  }
};


exports.getBudgetAdvice = async (req, res) => {
  try {
    const userId = req.user.id;

    const budgets = await Budget.find({ userId });
    const expenses = await Expense.find({ userId });

    const budgetAdvice = budgets.map((budget) => {
      const totalSpent = expenses
        .filter(exp => exp.category === budget.category)
        .reduce((sum, exp) => sum + exp.amount, 0);

      const remaining = budget.limit - totalSpent;
      return {
        category: budget.category,
        limit: budget.limit,
        totalSpent,
        remaining,
        advice: remaining < 0 
          ? "You have exceeded your budget for this category."
          : "You are within your budget."
      };
    });

    res.json(budgetAdvice);
  } catch (error) {
    res.status(500).json({ error: "Failed to provide budget advice" });
  }
};


exports.getGoalProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const goals = await Goal.find({ userId });

    const goalProgress = goals.map(goal => ({
      category: goal.category,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      progress: ((goal.currentAmount / goal.targetAmount) * 100).toFixed(2) + "%"
    }));

    res.json(goalProgress);
  } catch (error) {
    res.status(500).json({ error: "Failed to get goal progress" });
  }
};


exports.getLoanRepaymentAdvice = async (req, res) => {
  try {
    const userId = req.user.id;
    const loans = await Loan.find({ userId, status: "active" });

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
        monthlyPayment: monthlyPayment.toFixed(2),
        advice: monthlyPayment < 500
          ? "Your loan payments are manageable within your budget."
          : "Consider refinancing options to reduce monthly payments."
      };
    });

    res.json(loanAdvice);
  } catch (error) {
    res.status(500).json({ error: "Failed to provide loan repayment advice" });
  }
};
