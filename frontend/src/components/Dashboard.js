import React from "react";
import { useUser } from "../components/UserContext"; // Import the context
import generalStyles from "../assets/styles/dashboard/DashGeneral.module.css";
import headerStyles from "../assets/styles/dashboard/Header.module.css";
import sidebarStyles from "../assets/styles/dashboard/Sidebar.module.css";
import logo from "../assets/images/logo.png";
import userpic from "../assets/images/user.png";

const Dashboard = () => {
  const { user } = useUser(); // Get the user from context

  return (
    <div className="dashboard-body">
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
                <span className={headerStyles.userName}>{user ? user.name : "Guest"}</span>
              </p>
              <img
                className={headerStyles.profilePic}
                src={userpic}
                alt="User Profile"
              />
            </div>
          </div>
        </div>
      </header>


      <div className={sidebarStyles.sidebar}>
        <div className={sidebarStyles.welcomeText}>Welcome Back, {user ? user.name : "Guest"}!</div>
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


      <main className={generalStyles.mainContent}>
  
      </main>
    </div>
  );
};

export default Dashboard;
