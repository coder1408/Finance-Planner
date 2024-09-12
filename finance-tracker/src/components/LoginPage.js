import React, { useState } from "react";
import styles from "../assets/styles/login-page/LoginPage.module.css"; // Import CSS module
import logo from "../assets/images/logo.png";
import googleIcon from "../assets/images/google.png";
import facebookIcon from "../assets/images/facebook.png";
import twitterIcon from "../assets/images/twitter.png";
import instaIcon from "../assets/images/insta.png";
import { useNavigate } from "react-router-dom"; // For navigation

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic here (e.g., sending data to your backend)
    console.log("Form data:", formData);
  };

  return (
    <div className={styles.container}>
      <div className={styles.welcomeSection}>
        <div className={styles.logo}>
          <img src={logo} alt="PrimePlan Logo" />
          <span className={styles.companyName}>PrimePlan Financials</span>
        </div>
        <h1>Hello, welcome!</h1>
        <p>
          Get started on building your wealth and managing your finances with
          us!
        </p>
      </div>

      <div className={styles.loginSection}>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="name@mail.com"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="********"
              required
            />
          </div>
          <div className={styles.options}>
            <label>
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleInputChange}
              />{" "}
              Remember me
            </label>
            <a href="#" className={styles.forgotPassword}>
              Forgot password?
            </a>
          </div>
          <div className={styles.actions}>
            <button
              type="submit"
              className={`${styles.btn} ${styles.loginBtn}`}
            >
              Login
            </button>
            <button
              type="button"
              className={`${styles.btn} ${styles.signupBtn}`}
              onClick={() => navigate("/signup")} // Redirect to Sign up page
            >
              Sign up
            </button>
          </div>
        </form>

        <div className={styles.googleSignin}>
          <button type="button" className={`${styles.btn} ${styles.googleBtn}`}>
            <img src={googleIcon} alt="Google Logo" />
            Sign in with Google
          </button>
        </div>

        <div className={styles.socialMedia}>
          <span>Follow us:</span>
          <a href="#">
            <img src={facebookIcon} alt="Facebook" />
          </a>
          <a href="#">
            <img src={twitterIcon} alt="Twitter" />
          </a>
          <a href="#">
            <img src={instaIcon} alt="Instagram" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
