import React from "react";
import generalStyles from "../assets/styles/dashboard/DashGeneral.module.css";
import headerStyles from "../assets/styles/dashboard/Header.module.css";
import sidebarStyles from "../assets/styles/dashboard/Sidebar.module.css";
import logo from "../assets/images/logo.png";
import user from "../assets/images/user.png";

const Dashboard = () => {
  return (
    <div className="dashboard-body">
      {/* Header Section */}
      <header className={headerStyles.header}>
        <div className={headerStyles.leftSection}>
          <img className={headerStyles.logo} src={logo} alt="PrimePlan Logo" />
          <div className={headerStyles.nameText}>PrimePlan Financials</div>
        </div>
        <div className={headerStyles.rightSection}>
          <div className={headerStyles.features}>
            <button className={headerStyles.featureButton}>Analytics</button>
            <button className={headerStyles.featureButton}>Invoice</button>
            <button className={headerStyles.featureButton}>Calendar</button>
            <button className={headerStyles.featureButton}>Support</button>
            <div className={headerStyles.userInfo}>
              <p>
                <span className={headerStyles.userName}>David Jones</span>
              </p>
              <img
                className={headerStyles.profilePic}
                src={user}
                alt="User Profile"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar Section */}
      <div className={sidebarStyles.sidebar}>
        <div className={sidebarStyles.welcomeText}>Welcome Back, David!</div>
        <ul className={sidebarStyles.menu}>
          <li className={sidebarStyles.menuItem}>
            <button className={sidebarStyles.menuButton}>
              Expense Tracker
            </button>
          </li>
          <li className={sidebarStyles.menuItem}>
            <button className={sidebarStyles.menuButton}>
              Budgeting Tools
            </button>
          </li>
          <li className={sidebarStyles.menuItem}>
            <button className={sidebarStyles.menuButton}>
              Investment Guide
            </button>
          </li>
          <li className={sidebarStyles.menuItem}>
            <button className={sidebarStyles.menuButton}>Loan Tracker</button>
          </li>
        </ul>
      </div>

      {/* Main Content Area */}
      <main className={generalStyles.mainContent}>
        {/* You can place your dynamic content here */}
      </main>
    </div>
  );
};

export default Dashboard;
