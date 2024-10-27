import React, { useState } from "react";
import styles from "../assets/styles/budget/budget.module.css"; // Assuming CSS is in a separate file

const BudgetAllocation = () => {
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ name: "", amount: "" });

  // Define categories for the dropdown
  const categories = [
    "Food",
    "Transportation",
    "Housing",
    "Utilities",
    "Entertainment",
    "Health",
    "Education",
    "Savings",
    "Other",
  ];

  // Calculate total allocated and remaining balance
  const totalAllocated = expenses.reduce(
    (acc, curr) => acc + parseFloat(curr.amount || 0),
    0
  );
  const remainingBalance = parseFloat(income) - totalAllocated || 0;

  // Handle input changes for income and expenses
  const handleIncomeChange = (e) => {
    const value = e.target.value;
    setIncome(value ? parseFloat(value) : "");
  };

  const handleExpenseChange = (e) => {
    const { name, value } = e.target;
    setNewExpense((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) : value,
    }));
  };

  // Add expense if valid, then reset the form
  const handleAddExpense = (e) => {
    e.preventDefault();
    if (newExpense.name && newExpense.amount > 0) {
      setExpenses((prev) => [...prev, newExpense]);
      setNewExpense({ name: "", amount: "" });
    } else {
      alert("Please enter a valid expense name and amount."); // Alert for invalid entries
    }
  };

  // Remove selected expense by index
  const handleRemoveExpense = (index) => {
    setExpenses((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.budgetContainer}>
      <h2>Budget Allocation Tool</h2>

      {/* Income Input */}
      <div className={styles.incomeInput}>
        <label htmlFor="income">Total Monthly Budget:</label>
        <input
          type="number"
          id="income"
          value={income}
          onChange={handleIncomeChange}
          placeholder="Enter your income"
          min="0"
          className={styles.incomeInputField}
        />
      </div>

      {/* Expense Form */}
      <form onSubmit={handleAddExpense} className={styles.expenseForm}>
        <div className={styles.formGroup}>
          <select
            name="name"
            value={newExpense.name}
            onChange={handleExpenseChange}
            className={styles.expenseCategory}
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="amount"
            value={newExpense.amount}
            onChange={handleExpenseChange}
            placeholder="Amount"
            className={styles.expenseAmount}
            min="0"
            required
          />
          <button type="submit" className={styles.addExpenseBtn}>
            Add Expense
          </button>
        </div>
      </form>

      {/* Expense List */}
      <div className={styles.allocationSection}>
        {expenses.length > 0 ? (
          expenses.map((expense, index) => (
            <div key={index} className={styles.allocationItem}>
              <span>
                {expense.name}: ${expense.amount.toFixed(2)}
              </span>
              <button
                onClick={() => handleRemoveExpense(index)}
                className={styles.removeExpenseBtn}
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          <p>No expenses added yet.</p>
        )}
      </div>

      {/* Budget Summary */}
      <div className={styles.summary}>
        <h3>Budget Summary</h3>
        <p>Total Allocated: ${totalAllocated.toFixed(2)}</p>
        <p>
          Remaining Balance:{" "}
          {remainingBalance < 0
            ? "Overspent!"
            : `$${remainingBalance.toFixed(2)}`}
        </p>
      </div>
    </div>
  );
};

export default BudgetAllocation;
