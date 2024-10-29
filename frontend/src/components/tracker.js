// LoanTracker.jsx
import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import styles from "../assets/styles/emicalculator/emi.module.css";

const LoanTracker = () => {
  const [loans, setLoans] = useState([]);
  const [newLoan, setNewLoan] = useState({
    amount: "",
    interestRate: "",
    term: "",
    lender: "",
    type: "personal",
    startDate: "",
    monthlyPayment: "",
  });

  const [selectedLoan, setSelectedLoan] = useState(null);
  const [payments, setPayments] = useState([]);

  // Calculate monthly payment
  const calculateMonthlyPayment = (amount, rate, term) => {
    const monthlyRate = rate / 100 / 12;
    const months = term * 12;
    return (
      (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1)
    );
  };

  // Calculate remaining balance
  const calculateRemainingBalance = (loan, paymentsMade) => {
    const totalPaid = paymentsMade.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );
    const totalInterest = calculateTotalInterest(loan, paymentsMade);
    return loan.amount + totalInterest - totalPaid;
  };

  // Calculate total interest
  const calculateTotalInterest = (loan, paymentsMade) => {
    if (!loan) return 0;
    const monthlyRate = loan.interestRate / 100 / 12;
    let balance = loan.amount;
    let totalInterest = 0;

    paymentsMade.forEach((payment) => {
      const interestForMonth = balance * monthlyRate;
      totalInterest += interestForMonth;
      balance = balance + interestForMonth - payment.amount;
    });

    return totalInterest;
  };

  // Generate payment schedule
  const generatePaymentSchedule = (loan) => {
    if (!loan) return [];
    const schedule = [];
    let balance = loan.amount;
    const monthlyPayment = calculateMonthlyPayment(
      loan.amount,
      loan.interestRate,
      loan.term
    );
    const monthlyRate = loan.interestRate / 100 / 12;

    for (let i = 1; i <= loan.term * 12; i++) {
      const interest = balance * monthlyRate;
      const principal = monthlyPayment - interest;
      balance -= principal;

      schedule.push({
        paymentNumber: i,
        date: new Date(
          new Date(loan.startDate).setMonth(
            new Date(loan.startDate).getMonth() + i
          )
        ),
        totalPayment: monthlyPayment,
        principal: principal,
        interest: interest,
        remainingBalance: balance,
      });
    }

    return schedule;
  };

  const handleAddLoan = (e) => {
    e.preventDefault();
    const monthlyPayment = calculateMonthlyPayment(
      parseFloat(newLoan.amount),
      parseFloat(newLoan.interestRate),
      parseFloat(newLoan.term)
    );

    const loanWithPayment = {
      ...newLoan,
      id: Date.now(),
      monthlyPayment,
      amount: parseFloat(newLoan.amount),
      interestRate: parseFloat(newLoan.interestRate),
      term: parseFloat(newLoan.term),
    };

    setLoans([...loans, loanWithPayment]);
    setNewLoan({
      amount: "",
      interestRate: "",
      term: "",
      lender: "",
      type: "personal",
      startDate: "",
      monthlyPayment: "",
    });
  };

  const handleAddPayment = (loanId, amount) => {
    const newPayment = {
      id: Date.now(),
      loanId,
      amount: parseFloat(amount),
      date: new Date().toISOString(),
    };
    setPayments([...payments, newPayment]);
  };

  // Calculate summary statistics
  const calculateSummary = () => {
    const totalLoans = loans.reduce((sum, loan) => sum + loan.amount, 0);
    const totalPaid = payments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );
    const totalInterestPaid = loans.reduce((sum, loan) => {
      const loanPayments = payments.filter((p) => p.loanId === loan.id);
      return sum + calculateTotalInterest(loan, loanPayments);
    }, 0);
    const totalRemaining = loans.reduce((sum, loan) => {
      const loanPayments = payments.filter((p) => p.loanId === loan.id);
      return sum + calculateRemainingBalance(loan, loanPayments);
    }, 0);

    return { totalLoans, totalPaid, totalInterestPaid, totalRemaining };
  };

  return (
    <div className={styles.container}>
      <h1>Loan Tracker</h1>

      {/* Summary Dashboard */}
      <section className={styles.summary}>
        <h2>Summary Dashboard</h2>
        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <h3>Total Loans</h3>
            <p>${calculateSummary().totalLoans.toFixed(2)}</p>
          </div>
          <div className={styles.summaryCard}>
            <h3>Total Paid</h3>
            <p>${calculateSummary().totalPaid.toFixed(2)}</p>
          </div>
          <div className={styles.summaryCard}>
            <h3>Interest Paid</h3>
            <p>${calculateSummary().totalInterestPaid.toFixed(2)}</p>
          </div>
          <div className={styles.summaryCard}>
            <h3>Remaining Balance</h3>
            <p>${calculateSummary().totalRemaining.toFixed(2)}</p>
          </div>
        </div>
      </section>

      {/* Add New Loan Form */}
      <section className={styles.addLoan}>
        <h2>Add New Loan</h2>
        <form onSubmit={handleAddLoan}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Loan Amount ($)</label>
              <input
                type="number"
                value={newLoan.amount}
                onChange={(e) =>
                  setNewLoan({ ...newLoan, amount: e.target.value })
                }
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Interest Rate (%)</label>
              <input
                type="number"
                step="0.01"
                value={newLoan.interestRate}
                onChange={(e) =>
                  setNewLoan({ ...newLoan, interestRate: e.target.value })
                }
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Term (Years)</label>
              <input
                type="number"
                value={newLoan.term}
                onChange={(e) =>
                  setNewLoan({ ...newLoan, term: e.target.value })
                }
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Lender</label>
              <input
                type="text"
                value={newLoan.lender}
                onChange={(e) =>
                  setNewLoan({ ...newLoan, lender: e.target.value })
                }
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Loan Type</label>
              <select
                value={newLoan.type}
                onChange={(e) =>
                  setNewLoan({ ...newLoan, type: e.target.value })
                }
              >
                <option value="personal">Personal</option>
                <option value="auto">Auto</option>
                <option value="mortgage">Mortgage</option>
                <option value="student">Student</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Start Date</label>
              <input
                type="date"
                value={newLoan.startDate}
                onChange={(e) =>
                  setNewLoan({ ...newLoan, startDate: e.target.value })
                }
                required
              />
            </div>
          </div>
          <button type="submit" className={styles.button}>
            Add Loan
          </button>
        </form>
      </section>

      {/* Loan List */}
      <section className={styles.loanList}>
        <h2>Your Loans</h2>
        {loans.map((loan) => (
          <div key={loan.id} className={styles.loanCard}>
            <div className={styles.loanHeader}>
              <h3>
                {loan.lender} - {loan.type}
              </h3>
              <button className={styles.viewbutton} onClick={() => setSelectedLoan(loan)}>
                View Details
              </button>
            </div>
            <div className={styles.loanDetails}>
              <p>Amount: ${loan.amount}</p>
              <p>Interest Rate: {loan.interestRate}%</p>
              <p>Monthly Payment: ${loan.monthlyPayment.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Loan Details Modal */}
      {selectedLoan && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Loan Details</h2>
            <button
              className={styles.closeButton}
              onClick={() => setSelectedLoan(null)}
            >
              ×
            </button>

            {/* Payment Schedule */}
            <div className={styles.paymentSchedule}>
              <h3>Payment Schedule</h3>
              <table>
                <thead>
                  <tr>
                    <th>Payment #</th>
                    <th>Date</th>
                    <th>Payment</th>
                    <th>Principal</th>
                    <th>Interest</th>
                    <th>Remaining</th>
                  </tr>
                </thead>
                <tbody>
                  {generatePaymentSchedule(selectedLoan).map((payment) => (
                    <tr key={payment.paymentNumber}>
                      <td>{payment.paymentNumber}</td>
                      <td>{payment.date.toLocaleDateString()}</td>
                      <td>${payment.totalPayment.toFixed(2)}</td>
                      <td>${payment.principal.toFixed(2)}</td>
                      <td>${payment.interest.toFixed(2)}</td>
                      <td>${payment.remainingBalance.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Payment History */}
            <div className={styles.paymentHistory}>
              <h3>Payment History</h3>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {payments
                    .filter((payment) => payment.loanId === selectedLoan.id)
                    .map((payment) => (
                      <tr key={payment.id}>
                        <td>{new Date(payment.date).toLocaleDateString()}</td>
                        <td>${payment.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Loan Progress Chart */}
            <div className={styles.chart}>
              <h3>Loan Progress</h3>
              <LineChart
                width={600}
                height={300}
                data={generatePaymentSchedule(selectedLoan)}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="paymentNumber" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="remainingBalance"
                  stroke="#8884d8"
                  name="Remaining Balance"
                />
                <Line
                  type="monotone"
                  dataKey="interest"
                  stroke="#82ca9d"
                  name="Interest"
                />
              </LineChart>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanTracker;
