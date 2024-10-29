const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema({
  loanAmount: { type: Number, required: true }, // Renamed from principalAmount
  interestRate: { type: Number, required: true },
  term: { type: Number, required: true }, // Term in years, renamed from duration
  lender: { type: String, required: true }, // Added lender field
  loanType: { type: String, enum: ["Personal", "Home", "Auto", "Education"], required: true }, // Assuming common loan types
  startDate: { type: Date, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  monthlyPayment: { type: Number }, // Optional field for calculated monthly payment
  status: { type: String, enum: ["active", "paid", "defaulted"], default: "active" }, // Loan status
});

module.exports = mongoose.model("Loan", loanSchema);
