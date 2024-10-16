import React, { useState } from "react";
import styles from "../assets/styles/signup-page/SignupPage.module.css"; // Import CSS module
import logo from "../assets/images/logo.png";
import googleIcon from "../assets/images/google.png";
import facebookIcon from "../assets/images/facebook.png";
import twitterIcon from "../assets/images/twitter.png";
import instaIcon from "../assets/images/insta.png";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Form data:", formData);
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <div className={styles.welcomeSection}>
          <div className={styles.logo}>
            <img src={logo} alt="PrimePlan Logo" />
            <span className={styles.companyName}>PrimePlan Financials</span>
          </div>
          <h1>Welcome Aboard!</h1>
          <p>Join us and start your journey towards financial freedom today!</p>
        </div>
        <div className={styles.signupSection}>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your Name"
                required
              />
            </div>
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
            <div className={styles.inputGroup}>
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                type="password"
                id="confirm-password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="********"
                required
              />
            </div>
            <div className={styles.actions}>
              <button
                type="submit"
                className={`${styles.btn} ${styles.signupBtn}`}
              >
                Sign Up
              </button>
            </div>
          </form>
          <div className={styles.googleSignin}>
            <button type="button" className={`${styles.btn} ${styles.googleBtn}`}>
              <img src={googleIcon} alt="Google Logo" />
              Sign up with Google
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
    </div>
  );
};

export default SignupPage;
