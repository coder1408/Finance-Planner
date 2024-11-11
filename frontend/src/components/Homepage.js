import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../assets/styles/homepage/Homepage.module.css";
import logo from "../assets/images/logo.png";
import homeImage from "../assets/images/home-removebg-preview.png";
import gmailIcon from "../assets/images/gmail.png";

const Homepage = () => {
  const navigate = useNavigate();

  return (
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <div className={styles.brandSection}>
              <img src={logo} alt="PrimePlan Logo" className={styles.logo} />
              <span className={styles.brandName}>PrimePlan Financials</span>
              <span className={styles.brandSeparator}>|</span>
              <span className={styles.brandTagline}>Financial Excellence</span>
            </div>

            <nav className={styles.navigation}>
              <ul>
                <li>
                  <button onClick={() => navigate("/signup")}>
                    Expense Analytics
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/signup")}>
                    Budget Solutions
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/signup")}>
                    Investment Portal
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/about")}>About</button>
                </li>
                <li>
                  <button onClick={() => navigate("/faq's")} className={styles.supportButton}>
                    Support
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        <main className={styles.main}>
          <div className={styles.heroContent}>
            <div className={styles.textContent}>
              <h1 className={styles.mainHeading}>
                Elevate Your
                <span className={styles.emphasis}> Financial</span> Future
              </h1>
              <p className={styles.subheading}>
                Sophisticated tools for modern financial management and wealth building
              </p>
              <div className={styles.ctaSection}>
                <button
                    className={styles.primaryCta}
                    onClick={() => navigate("/signup")}
                >
                  Sign Up
                </button>
                <button
                    className={styles.secondaryCta}
                    onClick={() => navigate("/login")}
                >
                  Login
                </button>
              </div>
            </div>
            <div className={styles.imageSection}>
              <img
                  src={homeImage}
                  alt="Financial Dashboard Preview"
                  className={styles.heroImage}
              />
            </div>
          </div>
        </main>

        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <div className={styles.footerInfo}>
              <p className={styles.footerText}>
                Need assistance? Our dedicated support team is here to help.
              </p>
              <a href="mailto:support@primeplan.com" className={styles.contactLink}>
                <img src={gmailIcon} alt="Email" className={styles.contactIcon} />
                <span>Contact Support</span>
              </a>
            </div>
          </div>
        </footer>
      </div>
  );
};

export default Homepage;