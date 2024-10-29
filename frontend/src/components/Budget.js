
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts'; // Import Recharts components
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

  // Prepare data for the bar chart
  const chartData = Object.entries(categoryTotals).map(([category, amount]) => ({
    category,
    amount
  }));

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
                <form className={styles.BudgetTracker_form} onSubmit={handleAddExpense}>
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
                <form className={styles.BudgetTracker_form} onSubmit={handleAddCategory}>
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
                <form className={styles.BudgetTracker_form} onSubmit={handleAddGoal}>
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
                  <BarChart
                      width={600}
                      height={300}
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="amount" fill="#8884d8" />
                  </BarChart>
                </div>
              </div>
          )}
        </div>
      </div>
  );
};

export default BudgetTracker;