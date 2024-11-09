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
  const [activeSidebarItem, setActiveSidebarItem] = useState('dashboard');

  const CHART_COLORS = {
    bar: ['#4F46E5', '#06B6D4', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#6366F1', '#14B8A6'],
    pie: ['#4F46E5', '#06B6D4', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#6366F1', '#14B8A6']
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
    return <div className={mainContentStyles.loadingContainer}>
      <div className={mainContentStyles.loadingSpinner}></div>
      <span>Loading your financial dashboard...</span>
    </div>;
  }

  if (error) {
    return <div className={mainContentStyles.errorContainer}>
      <span className={mainContentStyles.errorIcon}>⚠️</span>
      {error}
    </div>;
  }

  const renderGoalsSection = () => {
    if (!goals.length) {
      return <div className={mainContentStyles.emptyState}>
        <span className={mainContentStyles.emptyStateIcon}>🎯</span>
        <p>No financial goals set yet. Start by setting your first goal!</p>
      </div>;
    }

    return (
        <section className={mainContentStyles.goalsSection}>
          <h2>Financial Goals Progress</h2>
          <div className={mainContentStyles.goalsGrid}>
            {goals.map(goal => {
              const percentage = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
              return (
                  <div key={goal._id} className={mainContentStyles.goalCard}>
                    <div className={mainContentStyles.goalHeader}>
                      <h3>{goal.category}</h3>
                      <span className={mainContentStyles.percentageBadge}>{percentage}%</span>
                    </div>
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
                      <div
                          className={mainContentStyles.progressFill}
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: percentage >= 100 ? '#10B981' : '#4F46E5'
                          }}
                      />
                    </div>
                  </div>
              );
            })}
          </div>
        </section>
    );
  };

  return (
      <div className={generalStyles.dashboardContainer}>
        <header className={headerStyles.header}>
          <div className={headerStyles.leftSection}>
            <img className={headerStyles.logo} src={logo} alt="PrimePlan Logo" />
            <div className={headerStyles.nameText}>PrimePlan Financials</div>
          </div>
          <div className={headerStyles.rightSection}>
            <nav className={headerStyles.navigation}>
              <Link to="/analytics" className={headerStyles.navLink}>Analytics</Link>
              <Link to="/invoice" className={headerStyles.navLink}>Invoice</Link>
              <Link to="/faq's" className={headerStyles.navLink}>Support</Link>
            </nav>
            <div className={headerStyles.userSection}>
              <div className={headerStyles.userInfo}>
                <span className={headerStyles.userName}>{user ? user.name : 'Guest'}</span>
                <Link to="/profile" className={headerStyles.profileLink}>
                  <img className={headerStyles.profilePic} src={userpic} alt="Profile" />
                </Link>
              </div>
            </div>
          </div>
        </header>

        <aside className={sidebarStyles.sidebar}>
          <div className={sidebarStyles.welcomeSection}>
            <h2 className={sidebarStyles.welcomeText}>Welcome back</h2>
            <p className={sidebarStyles.userName}>{user ? user.name : 'Guest'}</p>
          </div>
          <nav className={sidebarStyles.navigation}>
            <Link
                to="/dashboard"
                className={`${sidebarStyles.navItem} ${activeSidebarItem === 'dashboard' ? sidebarStyles.active : ''}`}
                onClick={() => setActiveSidebarItem('dashboard')}
            >
              Dashboard
            </Link>
            <Link
                to="/budget"
                className={`${sidebarStyles.navItem} ${activeSidebarItem === 'budget' ? sidebarStyles.active : ''}`}
                onClick={() => setActiveSidebarItem('budget')}
            >
              Budgeting Tools
            </Link>
            <Link
                to="/guide"
                className={`${sidebarStyles.navItem} ${activeSidebarItem === 'investments' ? sidebarStyles.active : ''}`}
                onClick={() => setActiveSidebarItem('investments')}
            >
              Investment Guide
            </Link>
            <Link
                to="/tracker"
                className={`${sidebarStyles.navItem} ${activeSidebarItem === 'loans' ? sidebarStyles.active : ''}`}
                onClick={() => setActiveSidebarItem('loans')}
            >
              Loan Tracker
            </Link>
          </nav>
        </aside>

        <main className={mainContentStyles.mainContent}>
          <div className={mainContentStyles.overviewGrid}>
            <section className={mainContentStyles.chartSection}>
              <h2>Expenses Overview</h2>
              <div className={mainContentStyles.chartWrapper}>
                {enhancedExpenses.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                      <PieChart>
                        <Pie
                            data={enhancedExpenses}
                            dataKey="amount"
                            nameKey="category"
                            cx="50%"
                            cy="50%"
                            outerRadius={150}
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                            labelLine
                        >
                          {enhancedExpenses.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip
                            formatter={(value) => `$${value.toLocaleString()}`}
                            contentStyle={{
                              backgroundColor: 'rgba(255, 255, 255, 0.95)',
                              borderRadius: '8px',
                              border: 'none',
                              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                            }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className={mainContentStyles.emptyState}>
                      <span className={mainContentStyles.emptyStateIcon}>📊</span>
                      <p>No expense data available. Start tracking your expenses!</p>
                    </div>
                )}
              </div>
            </section>

            <section className={mainContentStyles.chartSection}>
              <h2>Loan Overview</h2>
              <div className={mainContentStyles.chartWrapper}>
                {loans.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={loans}>
                        <XAxis
                            dataKey="loanType"
                            tick={{ fill: '#4B5563' }}
                        />
                        <YAxis
                            tick={{ fill: '#4B5563' }}
                        />
                        <Tooltip
                            formatter={(value) => `$${value.toLocaleString()}`}
                            contentStyle={{
                              backgroundColor: 'rgba(255, 255, 255, 0.95)',
                              borderRadius: '8px',
                              border: 'none',
                              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                            }}
                        />
                        <Bar
                            dataKey="loanAmount"
                            radius={[4, 4, 0, 0]}
                        >
                          {loans.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={getBarColor(index)} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className={mainContentStyles.emptyState}>
                      <span className={mainContentStyles.emptyStateIcon}>💰</span>
                      <p>No loan data available. Add your loans to track them!</p>
                    </div>
                )}
              </div>
            </section>
          </div>

          {renderGoalsSection()}
        </main>
      </div>
  );
};

export default Dashboard;