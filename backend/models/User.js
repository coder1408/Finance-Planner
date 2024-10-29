const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  rememberMe: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  income: { type: Number, default: 0 },  
  expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Expense" }],
  budgets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Budget" }],
  loans: [{ type: mongoose.Schema.Types.ObjectId, ref: "Loan" }],
});

module.exports = mongoose.model("User", userSchema);
