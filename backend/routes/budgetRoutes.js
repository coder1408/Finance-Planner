const express = require("express");
const authMiddleware = require("../middleware/auth");
const Budget = require("../models/Budget");
const Expense = require("../models/Expense");
const Goal = require("../models/Goal");
const User = require("../models/User");

const router = express.Router();


router.post("/setIncome", authMiddleware, async (req, res) => {
  try {
    const { income } = req.body;
    const user = await User.findById(req.user._id);
    user.income = income;
    await user.save();
    res.status(200).json({ income: user.income });
    console.log("Income added");
  } catch (error) {
    res.status(500).json({ message: "Error setting income", error });
  }
});


router.post("/addExpense", authMiddleware, async (req, res) => {
  try {
    const { category, amount, date } = req.body;
    const newExpense = new Expense({
      category,
      amount,
      date,
      userId: req.user._id,
    });
    await newExpense.save();
    res.status(201).json(newExpense);
    console.log("Expense added");
  } catch (error) {
    res.status(500).json({ message: "Error adding expense", error });
  }
});


router.post("/addCategory", authMiddleware, async (req, res) => {
  try {
    const { category, limit } = req.body;
    const newCategory = new Budget({
      category,
      limit,
      userId: req.user._id,
    });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: "Error adding category", error });
  }
});


router.post("/addGoal", authMiddleware, async (req, res) => {
  try {
    const { category, targetAmount } = req.body;
    const newGoal = new Goal({
      category,
      targetAmount,
      userId: req.user._id,
    });
    await newGoal.save();
    res.status(201).json(newGoal);
  } catch (error) {
    res.status(500).json({ message: "Error adding goal", error });
  }
});


router.get("/summary", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const expenses = await Expense.find({ userId: req.user._id });
    const goals = await Goal.find({ userId: req.user._id });
    const budgets = await Budget.find({ userId: req.user._id });

    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const remainingBudget = user.income - totalExpenses;

    res.status(200).json({
      income: user.income,
      totalExpenses,
      remainingBudget,
      goals,
      expenses,
      budgets,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving summary", error });
  }
});

module.exports = router;
