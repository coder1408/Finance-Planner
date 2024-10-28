// BudgetTracker.js
import React, { useState } from 'react';
import styles from '../assets/styles/budget/budget.module.css';

const BudgetTracker = () => {
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([
    'Food', 'Transportation', 'Housing', 'Utilities',
    'Entertainment', 'Health', 'Education', 'Other'
  ]);
  const [newCategory, setNewCategory] = useState('');
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({
    category: '',
    targetAmount: '',
    currentAmount: 0
  });
  const [selectedView, setSelectedView] = useState('expenses');

  // Calculate totals and statistics
  const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  const remainingBudget = parseFloat(income) - totalExpenses;

  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + parseFloat(expense.amount);
    return acc;
  }, {});

  // Handle new expense addition
  const handleAddExpense = (e) => {
    e.preventDefault();
    const expenseCategory = e.target.category.value;
    const expenseAmount = parseFloat(e.target.amount.value);
    const expenseDate = e.target.date.value;

    if (expenseCategory && expenseAmount > 0) {
      const newExpense = {
        category: expenseCategory,
        amount: expenseAmount,
        date: expenseDate,
        id: Date.now()
      };
      setExpenses([...expenses, newExpense]);
      e.target.reset();
    }
  };

  // Handle new category addition
  const handleAddCategory = (e) => {
    e.preventDefault();
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory('');
    }
  };

  // Handle new goal addition
  const handleAddGoal = (e) => {
    e.preventDefault();
    if (newGoal.category && newGoal.targetAmount > 0) {
      setGoals([...goals, { ...newGoal, id: Date.now() }]);
      setNewGoal({ category: '', targetAmount: '', currentAmount: 0 });
    }
  };

  // Generate bar chart data points
  const generateBarChart = () => {
    const chartHeight = 200;
    const maxAmount = Math.max(...Object.values(categoryTotals));

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      height: (amount / maxAmount) * chartHeight,
      amount
    }));
  };

  return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Budget Tracker</h1>
          <div className={styles.incomeInput}>
            <label>Monthly Income:</label>
            <input
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="Enter monthly income"
            />
          </div>
        </div>

        <div className={styles.navigation}>
          <button
              className={selectedView === 'expenses' ? styles.active : ''}
              onClick={() => setSelectedView('expenses')}
          >
            Expenses
          </button>
          <button
              className={selectedView === 'categories' ? styles.active : ''}
              onClick={() => setSelectedView('categories')}
          >
            Categories
          </button>
          <button
              className={selectedView === 'goals' ? styles.active : ''}
              onClick={() => setSelectedView('goals')}
          >
            Goals
          </button>
          <button
              className={selectedView === 'analytics' ? styles.active : ''}
              onClick={() => setSelectedView('analytics')}
          >
            Analytics
          </button>
        </div>

        <div className={styles.content}>
          {selectedView === 'expenses' && (
              <div className={styles.section}>
                <h2>Add Expense</h2>
                <form onSubmit={handleAddExpense}>
                  <select name="category" required>
                    <option value="">Select Category</option>
                    {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <input
                      type="number"
                      name="amount"
                      placeholder="Amount"
                      step="0.01"
                      required
                  />
                  <input
                      type="date"
                      name="date"
                      required
                  />
                  <button type="submit">Add Expense</button>
                </form>

                <div className={styles.expensesList}>
                  <h3>Recent Expenses</h3>
                  {expenses.map(expense => (
                      <div key={expense.id} className={styles.expenseItem}>
                        <span className={styles.category}>{expense.category}</span>
                        <span className={styles.amount}>${expense.amount.toFixed(2)}</span>
                        <span className={styles.date}>{expense.date}</span>
                      </div>
                  ))}
                </div>
              </div>
          )}

          {selectedView === 'categories' && (
              <div className={styles.section}>
                <h2>Manage Categories</h2>
                <form onSubmit={handleAddCategory}>
                  <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="New category name"
                  />
                  <button type="submit">Add Category</button>
                </form>

                <div className={styles.categoriesList}>
                  {categories.map(category => (
                      <div key={category} className={styles.categoryItem}>
                        {category}
                        <span className={styles.categoryTotal}>
                    ${(categoryTotals[category] || 0).toFixed(2)}
                  </span>
                      </div>
                  ))}
                </div>
              </div>
          )}

          {selectedView === 'goals' && (
              <div className={styles.section}>
                <h2>Financial Goals</h2>
                <form onSubmit={handleAddGoal}>
                  <select
                      value={newGoal.category}
                      onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                      required
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <input
                      type="number"
                      value={newGoal.targetAmount}
                      onChange={(e) => setNewGoal({...newGoal, targetAmount: e.target.value})}
                      placeholder="Target Amount"
                      required
                  />
                  <button type="submit">Add Goal</button>
                </form>

                <div className={styles.goalsList}>
                  {goals.map(goal => {
                    const spent = categoryTotals[goal.category] || 0;
                    const progress = (spent / goal.targetAmount) * 100;

                    return (
                        <div key={goal.id} className={styles.goalItem}>
                          <div className={styles.goalInfo}>
                            <span>{goal.category}</span>
                            <span>${spent.toFixed(2)} / ${goal.targetAmount}</span>
                          </div>
                          <div className={styles.progressBar}>
                            <div
                                className={styles.progressFill}
                                style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                          </div>
                        </div>
                    );
                  })}
                </div>
              </div>
          )}

          {selectedView === 'analytics' && (
              <div className={styles.section}>
                <h2>Spending Analytics</h2>

                <div className={styles.summary}>
                  <div className={styles.summaryItem}>
                    <h3>Total Income</h3>
                    <span>${parseFloat(income || 0).toFixed(2)}</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <h3>Total Expenses</h3>
                    <span>${totalExpenses.toFixed(2)}</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <h3>Remaining</h3>
                    <span className={remainingBudget < 0 ? styles.negative : ''}>
                  ${remainingBudget.toFixed(2)}
                </span>
                  </div>
                </div>

                <div className={styles.barChart}>
                  <h3>Spending by Category</h3>
                  <div className={styles.chartContainer}>
                    {generateBarChart().map(({ category, height, amount }) => (
                        <div key={category} className={styles.barContainer}>
                          <div
                              className={styles.bar}
                              style={{ height: `${height}px` }}
                          >
                            <span className={styles.barAmount}>${amount.toFixed(0)}</span>
                          </div>
                          <span className={styles.barLabel}>{category}</span>
                        </div>
                    ))}
                  </div>
                </div>
              </div>
          )}
        </div>
      </div>
  );
};

export default BudgetTracker;