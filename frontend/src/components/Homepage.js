import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../assets/styles/homepage/Homepage.module.css"; // Import CSS module
import logo from "../assets/images/logo.png";
import homeImage from "../assets/images/home-removebg-preview.png";
import gmailIcon from "../assets/images/gmail.png";

const Homepage = () => {
  const navigate = useNavigate();

  return (
      <div classname = {styles.body}>
        <header>
          <div className={styles.headerContent}>
            <div className={styles.logoSection}>
              <img src={logo} alt="PrimePlan Logo" className={styles.logo} />
              <span className={styles.companyName}>PrimePlan Financials</span>
            </div>
            <nav>
              <ul>
                <li>
                  <button
                    onClick={() => navigate("/signup")}
                    className={styles.navButton}
                  >
                    Expense Tracker
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/signup")}
                    className={styles.navButton}
                  >
                    Budgeting Tools
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/signup")}
                    className={styles.navButton}
                  >
                    Investment Guide
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/about")}
                    className={styles.navButton}
                  >
                    About
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/FAQ's")}
                    className={styles.navButton}
                  >
                  Support
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        {/* Main Section */}
        <main>
          <div className={styles.heroSection}>
            <div className={styles.imageContainer}>
              <img
                src={homeImage}
                alt="Dashboard illustration"
                className={styles.heroImage}
              />
            </div>
            <h1 className={styles.heroTitle}>
              Master your money,
              <br /> master your future.
            </h1>
            <div className={styles.buttons}>
              <button
                type="button"
                className={styles.signupButton}
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </button>
              <button
                className={styles.loginButton}
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            </div>
          </div>
        </main>

        {/* Footer Section */}
        <footer>
          <p>
            Have questions or need support?
            <br /> Contact us for prompt assistance.
          </p>
          <img src={gmailIcon} alt="Gmail icon" className={styles.contactIcon} />
        </footer>
      </div>
  );
};

export default Homepage;
