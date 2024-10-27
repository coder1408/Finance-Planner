const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema({
  loanType: { type: String, required: true }, 
  principalAmount: { type: Number, required: true },
  interestRate: { type: Number, required: true }, 
  duration: { type: Number, required: true }, 
  startDate: { type: Date, required: true }, 
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Loan", loanSchema);
