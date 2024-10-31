const express = require("express");
const { authMiddleware } = require("../middleware/auth");
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
  console.log("Add Expense Endpoint Hit"); // Log when endpoint is hit
  console.log("Request Body:", req.body); // Log the request body
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


// Example for Add Category route
router.post("/addCategory", authMiddleware, async (req, res) => {
  console.log("Add Category Endpoint Hit");
  console.log("Request Body:", req.body); // Log the incoming request body
  try {
      const { category } = req.body; // Destructure category from the request body

      // Basic validation
      if (!category) {
          console.error("Category is required"); // Log this error
          return res.status(400).json({ message: "Category is required" });
      }

      // Proceed with creating a new category
      const newCategory = new Budget({
          category,
          userId: req.user._id, // Ensure you're using the correct user ID
      });

      await newCategory.save(); // Attempt to save the category to the database
      console.log("Category Added:", newCategory); // Log the newly added category
      res.status(201).json(newCategory); // Send back the new category as a response
  } catch (error) {
      console.error("Error adding category:", error); // Log the error details
      res.status(500).json({ message: "Error adding category", error: error.message });
  }
});




// AddGoal Route
router.post("/addGoal", authMiddleware, async (req, res) => {
  console.log("Add Goal Endpoint Hit");
  console.log("Request Body:", req.body); // Log the incoming request body
  try {
      const { category, targetAmount } = req.body; // Destructure category and targetAmount from request body

      // Basic validation
      if (!category || targetAmount <= 0) {
          console.error("Category and target amount are required"); // Log this error
          return res.status(400).json({ message: "Category and target amount are required" });
      }

      // Create a new goal
      const newGoal = new Goal({
          category,
          targetAmount,
          userId: req.user._id, // Use authenticated user ID
      });

      await newGoal.save(); // Attempt to save the goal to the database
      console.log("Goal Added:", newGoal); // Log the newly added goal
      res.status(201).json(newGoal); // Send back the new goal as a response
  } catch (error) {
      console.error("Error adding goal:", error); // Log the error details
      res.status(500).json({ message: "Error adding goal", error: error.message });
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
