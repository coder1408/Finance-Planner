// Dashboard.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, PieChart, Tooltip, XAxis, YAxis, Bar, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useUser } from './UserContext';
import generalStyles from '../assets/styles/dashboard/DashGeneral.module.css';
import headerStyles from '../assets/styles/dashboard/Header.module.css';
import sidebarStyles from '../assets/styles/dashboard/Sidebar.module.css';
import mainContentStyles from '../assets/styles/dashboard/MainContent.module.css';
import logo from '../assets/images/logo.png';
import userpic from '../assets/images/user.png';

const Dashboard = () => {
  const { user, fetchUser } = useUser();
  const [loans, setLoans] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const CHART_COLORS = {
    bar: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'],
    pie: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#6366f1', '#14b8a6']
  };

  const getBarColor = (index) => CHART_COLORS.bar[index % CHART_COLORS.bar.length];
  const enhancedExpenses = expenses.map((expense, index) => ({
    ...expense,
    fill: CHART_COLORS.pie[index % CHART_COLORS.pie.length]
  }));

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (user) {
          const token = localStorage.getItem('token');
          const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          };

          const [loansData, expensesData, goalsData] = await Promise.all([
            fetch(`/api/loans/user/${user._id}`, { headers }).then(res => res.json()),
            fetch('/api/budget/budgets', { headers }).then(res => res.json()),
            fetch('/api/budget/goals', { headers }).then(res => res.json())
          ]);

          setLoans(Array.isArray(loansData) ? loansData : []);
          setExpenses(Array.isArray(expensesData) ? expensesData : []);
          const processedGoals = Array.isArray(goalsData) ? goalsData.map(goal => {
            const categoryExpenses = expensesData.reduce((sum, expense) =>
                expense.category === goal.category ? sum + expense.amount : sum, 0);
            return { ...goal, currentAmount: Math.max(0, categoryExpenses - goal.targetAmount) };
          }) : [];
          setGoals(processedGoals);
        }
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return <div className={mainContentStyles.loadingContainer}>Loading...</div>;
  }

  if (error) {
    return <div className={mainContentStyles.errorContainer}>{error}</div>;
  }

  const renderGoalsSection = () => {
    if (!goals.length) {
      return <p className={mainContentStyles.noDataMessage}>No goal progress data available.</p>;
    }

    return (
        <section className={mainContentStyles.goalsSection}>
          <h2>Financial Goals Progress</h2>
          <div className={mainContentStyles.goalsGrid}>
            {goals.map(goal => {
              const percentage = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
              return (
                  <div key={goal._id} className={mainContentStyles.goalCard}>
                    <h3>{goal.category}</h3>
                    <div className={mainContentStyles.goalStats}>
                  <span className={mainContentStyles.currentAmount}>
                    ${goal.currentAmount.toLocaleString()}
                  </span>
                      <span className={mainContentStyles.separator}>of</span>
                      <span className={mainContentStyles.targetAmount}>
                    ${goal.targetAmount.toLocaleString()}
                  </span>
                    </div>
                    <div className={mainContentStyles.progressBar}>
                      <div className={mainContentStyles.progressFill} style={{ width: `${percentage}%` }} />
                    </div>
                    <span className={mainContentStyles.percentageText}>{percentage}% Complete</span>
                  </div>
              );
            })}
          </div>
        </section>
    );
  };

  return (
      <div className={generalStyles.dashboard.body}>
        <header className={headerStyles.header}>
          <div className={headerStyles.leftSection}>
            <img className={headerStyles.logo} src={logo} alt="PrimePlan Logo" />
            <div className={headerStyles.nameText}>PrimePlan Financials</div>
          </div>
          <div className={headerStyles.rightSection}>
            <div className={headerStyles.features}>
              <Link to="/analytics"><button className={headerStyles.featureButton}>Analytics</button></Link>
              <Link to="/invoice"><button className={headerStyles.featureButton}>Invoice</button></Link>
              <Link to="/FAQ's"><button className={headerStyles.featureButton}>Support</button></Link>
              <div className={headerStyles.userInfo}>
                <p><span className={headerStyles.userName}>{user ? user.name : 'Guest'}</span></p>
                <Link to="/profile"><img className={headerStyles.profilePic} src={userpic} alt="User Profile" /></Link>
              </div>
            </div>
          </div>
        </header>

        <div className={sidebarStyles.sidebar}>
          <div className={sidebarStyles.welcomeText}>Welcome Back, {user ? user.name : 'Guest'}!</div>
          <ul className={sidebarStyles.menu}>
            <li className={sidebarStyles.menuItem}><Link to="/Budget"><button className={sidebarStyles.menuButton}>Budgeting Tools</button></Link></li>
            <li className={sidebarStyles.menuItem}><Link to="/Guide"><button className={sidebarStyles.menuButton}>Investment Guide</button></Link></li>
            <li className={sidebarStyles.menuItem}><Link to="/tracker"><button className={sidebarStyles.menuButton}>Loan Tracker</button></Link></li>
          </ul>
        </div>

        <section className={mainContentStyles.expensechartSection}>
          <h2>Expenses Overview</h2>
          <div className={mainContentStyles.chartWrapper}>
            {enhancedExpenses.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie data={enhancedExpenses} dataKey="amount" nameKey="category" cx="50%" cy="50%" outerRadius={150} label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`} labelLine>
                      {enhancedExpenses.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
            ) : (
                <p className={mainContentStyles.noDataMessage}>No expenses data available.</p>
            )}
          </div>
        </section>

        <main className={generalStyles.mainContent}>
          <section className={mainContentStyles.loanchartSection}>
            <h2>Loan Overview</h2>
            <div className={mainContentStyles.chartWrapper}>
              {loans.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={loans}>
                      <XAxis dataKey="loanType" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${value.toLocaleString()}`} labelStyle={{ color: '#2c3e50' }} />
                      <Bar dataKey="loanAmount" radius={[4, 4, 0, 0]}>
                        {loans.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getBarColor(index)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
              ) : (
                  <p className={mainContentStyles.noDataMessage}>No loans data available.</p>
              )}
            </div>
          </section>

          {renderGoalsSection()}
        </main>
      </div>
  );
};

export default Dashboard;
