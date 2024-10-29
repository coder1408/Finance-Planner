import React, { useState } from "react";
import axios from "axios";
import styles from "../assets/styles/signup-page/SignupPage.module.css"; // Import CSS module
import logo from "../assets/images/logo.png";
import googleIcon from "../assets/images/google.png";
import facebookIcon from "../assets/images/facebook.png";
import twitterIcon from "../assets/images/twitter.png";
import instaIcon from "../assets/images/insta.png";
import { Navigate } from "react-router-dom";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [navigateTo, setNavigateTo] = useState(false); // State to manage navigation

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    // Clear error message
    setErrorMessage("");

    try {
      const response = await axios.post("/api/auth/signup", {
        email: formData.email,
        password: formData.password,
        name: formData.name,
      });

      console.log("Signup successful:", response.data);

      // Reset form data
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setNavigateTo(true); // Set navigate state to true
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Server error");
      console.error("Signup error:", error);
    }
  };

  // Navigate if the state is true
  if (navigateTo) {
    return <Navigate to="/Onboarding" />;
  }

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
              {errorMessage && <p className={styles.error}>{errorMessage}</p>} {/* Display error message */}
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
