// Dashboard.js
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from './UserContext';
import generalStyles from '../assets/styles/dashboard/DashGeneral.module.css';
import headerStyles from '../assets/styles/dashboard/Header.module.css';
import sidebarStyles from '../assets/styles/dashboard/Sidebar.module.css';
import logo from '../assets/images/logo.png';
import userpic from '../assets/images/user.png';

const Dashboard = () => {
  const { user, fetchUser } = useUser();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
      <div className="dashboard-body">
        <header className={headerStyles.header}>
          <div className={headerStyles.leftSection}>
            <img className={headerStyles.logo} src={logo} alt="PrimePlan Logo" />
            <div className={headerStyles.nameText}>PrimePlan Financials</div>
          </div>
          <div className={headerStyles.rightSection}>
            <div className={headerStyles.features}>
              <Link to="/analytics">
                <button className={headerStyles.featureButton}>Analytics</button>
              </Link>
              <Link to="/invoice">
                <button className={headerStyles.featureButton}>Invoice</button>
              </Link>
              <Link to="/FAQ's">
                <button className={headerStyles.featureButton}>Support</button>
              </Link>
              <div className={headerStyles.userInfo}>
                <p>
                  <span className={headerStyles.userName}>{user ? user.name : 'Guest'}</span>
                </p>
                <Link to="/profile">
                  <img className={headerStyles.profilePic} src={userpic} alt="User Profile" />
                </Link>
              </div>
            </div>
          </div>
        </header>

        <div className={sidebarStyles.sidebar}>
          <div className={sidebarStyles.welcomeText}>
            Welcome Back, {user ? user.name : 'Guest'}!
          </div>
          <ul className={sidebarStyles.menu}>
            <li className={sidebarStyles.menuItem}>
              <Link to="/Budget">
                <button className={sidebarStyles.menuButton}>Budgeting Tools</button>
              </Link>
            </li>
            <li className={sidebarStyles.menuItem}>
              <Link to="/Guide">
                <button className={sidebarStyles.menuButton}>Investment Guide</button>
              </Link>
            </li>
            <li className={sidebarStyles.menuItem}>
              <Link to="/tracker">
                <button className={sidebarStyles.menuButton}>Loan Tracker</button>
              </Link>
            </li>
          </ul>
        </div>

        <main className={generalStyles.mainContent}></main>
      </div>
  );
};

export default Dashboard;