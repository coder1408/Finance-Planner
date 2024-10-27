import React, { useState } from 'react';
import axios from 'axios';
import styles from "../assets/styles/emicalculator/emi.module.css"; 
import '../App.css'; 
const Tracker = () => {
  const [loanAmount, setLoanAmount] = useState(50000);
  const [years, setYears] = useState(5);
  const [interestRate, setInterestRate] = useState(10.5);
  const [monthlyPayment, setMonthlyPayment] = useState(null);

  // Function to calculate EMI
  const calculateEMI = () => {
    const principal = loanAmount;
    const monthlyInterestRate = (interestRate / 100) / 12;
    const totalPayments = years * 12;

    const emi = (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalPayments)) / 
                (Math.pow(1 + monthlyInterestRate, totalPayments) - 1);
    
    setMonthlyPayment(emi.toFixed(2));  // Set the result to 2 decimal places
  };

  const fetchLoans = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/loans', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you store the JWT token in localStorage
        },
      });
      console.log(response.data); // Use the fetched loan data
    } catch (error) {
      console.error('Error fetching loans:', error);
    }
  };
  

  return (
    <div className={styles.body}>x
      <div className={styles.calculatorContainer}>
        <h1>Loan Tracker & Calculator</h1>

        <div className={styles.calculatorItem}>
          <div className={styles.sliderContainer}>
            <label>Amount you need:</label>
            <span className={styles.outputValue}>${loanAmount.toLocaleString()}</span>
            <input
              type="range"
              min="50000"
              max="4000000"
              value={loanAmount}
              className={styles.slider}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
            />
          </div>

          <div className={styles.sliderContainer}>
            <label>For:</label>
            <span className={styles.outputValue}>{years} years</span>
            <input
              type="range"
              min="1"
              max="5"
              value={years}
              className={styles.slider}
              onChange={(e) => setYears(Number(e.target.value))}
            />
          </div>

          <div className={styles.sliderContainer}>
            <label>Interest rate:</label>
            <span className={styles.outputValue}>{interestRate}%</span>
            <input
              type="range"
              min="1"
              max="20"
              step="0.5"
              value={interestRate}
              className={styles.slider}
              onChange={(e) => setInterestRate(Number(e.target.value))}
            />
          </div>

          <button onClick={calculateEMI} className={styles.calculateButton}>Calculate</button>

          {/* Display the result */}
          {monthlyPayment && (
            <div className={styles.result}>
              <h2>Monthly Payment: ${monthlyPayment}</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tracker;
