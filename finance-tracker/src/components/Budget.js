import React, { useState } from 'react';
import styles from "../assets/styles/budget/budget.css"; // Assuming you want to keep the CSS in a separate file

const BudgetAllocation = () => {
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ name: '', amount: '' });

  const totalAllocated = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
  const remainingBalance = income ? income - totalAllocated : 0;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (newExpense.name && newExpense.amount && newExpense.amount > 0) {
      setExpenses((prev) => [...prev, newExpense]);
      setNewExpense({ name: '', amount: '' });
    }
  };

  const handleRemoveExpense = (index) => {
    setExpenses((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="budget-container">
      <h2>Budget Allocation Tool</h2>

      <div className="income-input">
        <label htmlFor="income">Total Monthly Income:</label>
        <input
          type="number"
          id="income"
          value={income}
          onChange={(e) => setIncome(e.target.value === '' ? '' : Number(e.target.value))}
          placeholder="Enter your income"
        />
      </div>

      <form onSubmit={handleAddExpense} className="expense-form">
        <div className="form-group">
          <input
            type="text"
            name="name"
            value={newExpense.name}
            onChange={handleInputChange}
            placeholder="Expense Category"
            className="expense-name"
            required
          />
          <input
            type="number"
            name="amount"
            value={newExpense.amount}
            onChange={handleInputChange}
            placeholder="Amount"
            className="expense-amount"
            required
          />
          <button type="submit" className="add-expense-btn">Add Expense</button>
        </div>
      </form>

      <div className="allocation-section">
        {expenses.map((expense, index) => (
          <div key={index} className="allocation-item">
            <span>{expense.name}: {expense.amount}</span>
            <button onClick={() => handleRemoveExpense(index)} className="remove-expense-btn">Remove</button>
          </div>
        ))}
      </div>

      <div className="summary">
        <h3>Budget Summary</h3>
        <p>Total Allocated: {totalAllocated}</p>
        <p>Remaining Balance: {remainingBalance < 0 ? "Overspent!" : remainingBalance}</p>
      </div>
    </div>
  );
};

export default BudgetAllocation;

