import React, { useState } from "react";
import styles from "../assets/styles/emicalculator/emi.module.css"; // Adjust this path if necessary
import "../App.css"; // Make sure this path is correct

const Tracker = () => {
  const [loanAmount, setLoanAmount] = useState(50000);
  const [years, setYears] = useState(5);
  const [interestRate, setInterestRate] = useState(10.5);
  const [monthlyPayment, setMonthlyPayment] = useState(null);
  const [error, setError] = useState("");

  // Function to validate inputs
  const validateInputs = () => {
    if (loanAmount < 50000 || loanAmount > 4000000) {
      setError("Loan amount must be between $50,000 and $4,000,000.");
      return false;
    }
    if (years < 1 || years > 30) {
      setError("Loan duration must be between 1 and 30 years.");
      return false;
    }
    if (interestRate < 1 || interestRate > 20) {
      setError("Interest rate must be between 1% and 20%.");
      return false;
    }
    setError(""); // Clear error message if inputs are valid
    return true;
  };

  // Function to calculate EMI
  const calculateEMI = () => {
    if (!validateInputs()) return; // Validate inputs before calculating

    const principal = loanAmount;
    const monthlyInterestRate = interestRate / 100 / 12;
    const totalPayments = years * 12;

    const emi =
      (principal *
        monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, totalPayments)) /
      (Math.pow(1 + monthlyInterestRate, totalPayments) - 1);

    setMonthlyPayment(emi.toFixed(2)); // Set the result to 2 decimal places
  };

  const formatCurrency = (value) => {
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className={styles.body}>
      <div className={styles.calculatorContainer}>
        <h1>Loan Tracker & Calculator</h1>
        {error && <div className={styles.error}>{error}</div>}{" "}
        {/* Error Message */}
        <div className={styles.calculatorItem}>
          {/* Loan Amount Slider */}
          <div className={styles.sliderContainer}>
            <label htmlFor="loan-amount">Amount you need:</label>
            <span className={styles.outputValue}>
              {formatCurrency(loanAmount)}
            </span>
            <input
              id="loan-amount"
              type="range"
              min="50000"
              max="4000000"
              value={loanAmount}
              className={styles.slider}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              aria-valuemin="50000"
              aria-valuemax="4000000"
              aria-valuenow={loanAmount}
              aria-label="Loan Amount"
            />
          </div>

          {/* Loan Duration Slider */}
          <div className={styles.sliderContainer}>
            <label htmlFor="loan-years">For:</label>
            <span className={styles.outputValue}>{years} years</span>
            <input
              id="loan-years"
              type="range"
              min="1"
              max="30" // Adjust max years if necessary
              value={years}
              className={styles.slider}
              onChange={(e) => setYears(Number(e.target.value))}
              aria-valuemin="1"
              aria-valuemax="30"
              aria-valuenow={years}
              aria-label="Loan Duration in Years"
            />
          </div>

          {/* Interest Rate Slider */}
          <div className={styles.sliderContainer}>
            <label htmlFor="interest-rate">Interest rate:</label>
            <span className={styles.outputValue}>{interestRate}%</span>
            <input
              id="interest-rate"
              type="range"
              min="1"
              max="20"
              step="0.5"
              value={interestRate}
              className={styles.slider}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              aria-valuemin="1"
              aria-valuemax="20"
              aria-valuenow={interestRate}
              aria-label="Interest Rate"
            />
          </div>

          {/* Calculate Button */}
          <button onClick={calculateEMI} className={styles.calculateButton}>
            Calculate
          </button>

          {/* Display the result */}
          {monthlyPayment && (
            <div className={styles.result}>
              <h2>Monthly Payment: {formatCurrency(monthlyPayment)}</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tracker;
