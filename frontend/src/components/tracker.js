// LoanTracker.jsx
import React, { useState, useEffect } from 'react';
import styles from '../assets/styles/emicalculator/emi.module.css';

const LoanTracker = () => {
  // State for loan details
  const [loanDetails, setLoanDetails] = useState({
    amount: 50000,
    years: 5,
    interestRate: 10.5,
    loanType: 'personal',
    lenderName: '',
    startDate: '',
  });

  // State for calculated values
  const [calculations, setCalculations] = useState({
    monthlyPayment: 0,
    totalInterest: 0,
    totalPayment: 0,
  });

  // State for payment history
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [selectedTab, setSelectedTab] = useState('calculator');

  // Calculate loan details
  const calculateLoanDetails = () => {
    const principal = loanDetails.amount;
    const monthlyInterestRate = (loanDetails.interestRate / 100) / 12;
    const totalPayments = loanDetails.years * 12;

    // Calculate monthly payment
    const monthlyPayment = (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalPayments)) /
        (Math.pow(1 + monthlyInterestRate, totalPayments) - 1);

    let totalInterest = monthlyPayment * totalPayments - principal;

    setCalculations({
      monthlyPayment,
      totalInterest,
      totalPayment: monthlyPayment * totalPayments,
    });
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoanDetails(prev => ({
      ...prev,
      [name]: name === 'loanType' ? value : Number(value)
    }));
  };

  // Add payment to history
  const addPayment = (amount, date) => {
    setPaymentHistory(prev => [...prev, { amount, date, id: Date.now() }]);
  };

  // Effect to recalculate when loan details change
  useEffect(() => {
    calculateLoanDetails();
  }, [loanDetails]);

  return (
      <div className={styles.container}>
        <h1 className={styles.title}>Loan Management System</h1>

        <div className={styles.tabs}>
          <button
              className={`${styles.tabButton} ${selectedTab === 'calculator' ? styles.active : ''}`}
              onClick={() => setSelectedTab('calculator')}
          >
            Calculator
          </button>
          <button
              className={`${styles.tabButton} ${selectedTab === 'payments' ? styles.active : ''}`}
              onClick={() => setSelectedTab('payments')}
          >
            Payments
          </button>
          <button
              className={`${styles.tabButton} ${selectedTab === 'analytics' ? styles.active : ''}`}
              onClick={() => setSelectedTab('analytics')}
          >
            Analytics
          </button>
        </div>

        {selectedTab === 'calculator' && (
            <div className={styles.calculatorSection}>
              <div className={styles.inputGroup}>
                <h2>Loan Details</h2>

                <div className={styles.inputContainer}>
                  <label>Loan Type:</label>
                  <select
                      name="loanType"
                      value={loanDetails.loanType}
                      onChange={handleInputChange}
                      className={styles.select}
                  >
                    <option value="personal">Personal Loan</option>
                    <option value="auto">Auto Loan</option>
                    <option value="mortgage">Mortgage</option>
                    <option value="student">Student Loan</option>
                  </select>
                </div>

                <div className={styles.inputContainer}>
                  <label>Loan Amount: ${loanDetails.amount.toLocaleString()}</label>
                  <input
                      type="range"
                      name="amount"
                      min="1000"
                      max="1000000"
                      value={loanDetails.amount}
                      onChange={handleInputChange}
                      className={styles.slider}
                  />
                </div>

                <div className={styles.inputContainer}>
                  <label>Loan Term: {loanDetails.years} years</label>
                  <input
                      type="range"
                      name="years"
                      min="1"
                      max="30"
                      value={loanDetails.years}
                      onChange={handleInputChange}
                      className={styles.slider}
                  />
                </div>

                <div className={styles.inputContainer}>
                  <label>Interest Rate: {loanDetails.interestRate}%</label>
                  <input
                      type="range"
                      name="interestRate"
                      min="1"
                      max="20"
                      step="0.1"
                      value={loanDetails.interestRate}
                      onChange={handleInputChange}
                      className={styles.slider}
                  />
                </div>
              </div>

              <div className={styles.summaryBox}>
                <h3>Loan Summary</h3>
                <div className={styles.summaryItem}>
                  <span>Monthly Payment:</span>
                  <span>${calculations.monthlyPayment.toFixed(2)}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span>Total Interest:</span>
                  <span>${calculations.totalInterest.toFixed(2)}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span>Total Payment:</span>
                  <span>${calculations.totalPayment.toFixed(2)}</span>
                </div>
              </div>
            </div>
        )}

        {selectedTab === 'payments' && (
            <div className={styles.paymentsSection}>
              <h2>Payment History</h2>
              <div className={styles.addPayment}>
                <input
                    type="number"
                    placeholder="Payment Amount"
                    className={styles.input}
                />
                <input
                    type="date"
                    className={styles.input}
                />
                <button
                    className={styles.button}
                    onClick={() => addPayment(1000, new Date())}
                >
                  Add Payment
                </button>
              </div>
              <div className={styles.paymentHistory}>
                {paymentHistory.map(payment => (
                    <div key={payment.id} className={styles.paymentItem}>
                      <span>${payment.amount}</span>
                      <span>{new Date(payment.date).toLocaleDateString()}</span>
                    </div>
                ))}
              </div>
            </div>
        )}

        {selectedTab === 'analytics' && (
            <div className={styles.analyticsSection}>
              <h2>Loan Analytics</h2>
              <div className={styles.analyticsGrid}>
                <div className={styles.analyticsCard}>
                  <h3>Payment Progress</h3>
                  <div className={styles.progressBar}>
                    <div
                        className={styles.progress}
                        style={{
                          width: `${(paymentHistory.reduce((acc, curr) => acc + curr.amount, 0) /
                              calculations.totalPayment) * 100}%`
                        }}
                    ></div>
                  </div>
                </div>
                <div className={styles.analyticsCard}>
                  <h3>Interest vs Principal</h3>
                  <div className={styles.chart}>
                    <div
                        className={styles.interestBar}
                        style={{
                          height: `${(calculations.totalInterest / calculations.totalPayment) * 100}%`
                        }}
                    ></div>
                    <div
                        className={styles.principalBar}
                        style={{
                          height: `${(loanDetails.amount / calculations.totalPayment) * 100}%`
                        }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default LoanTracker;
