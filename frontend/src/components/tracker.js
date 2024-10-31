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
  });
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [payments, setPayments] = useState([]);

  // Fetch existing loans on component mount
  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await fetch("/api/loans", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Retrieve token from local storage
          },
        });
        const data = await response.json();
        setLoans(Array.isArray(data) ? data : []);
        console.log("Response data:", data);
      } catch (error) {
        console.error("Failed to fetch loans:", error.message);
      }
    };

    fetchLoans();
  }, []);

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


  // Handle adding a new loan
  const handleAddLoan = async (e) => {
    e.preventDefault();
  
    // Retrieve token
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token is missing");
      return;
    }
  
    // Rest of your code with token checks
    const monthlyPayment = calculateMonthlyPayment(
      parseFloat(newLoan.amount),
      parseFloat(newLoan.interestRate),
      parseFloat(newLoan.term)
    );
  
    const loanWithPayment = {
      ...newLoan,
      monthlyPayment,
      amount: parseFloat(newLoan.amount),
      interestRate: parseFloat(newLoan.interestRate),
      term: parseFloat(newLoan.term),
      startDate: new Date(newLoan.startDate).toISOString().split("T")[0],
      type: newLoan.type || "personal",
    };
  
    try {
      const response = await fetch("/api/loans", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loanWithPayment),
      });
  
      if (response.ok) {
        const savedLoan = await response.json();
        setLoans((prevLoans) => (Array.isArray(prevLoans) ? [...prevLoans, savedLoan] : [savedLoan]));
        setNewLoan({
          amount: "",
          interestRate: "",
          term: "",
          lender: "",
          type: "personal",
          startDate: "",
        });
      } else {
        console.error("Failed to add loan:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding loan:", error.message);
    }
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
              <label>Type</label>
              <select
                value={newLoan.type}
                onChange={(e) =>
                  setNewLoan({ ...newLoan, type: e.target.value })
                }
              >
                <option value="personal">Personal</option>
                <option value="home">Home</option>
                <option value="auto">Auto</option>
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
          <button type="submit">Add Loan</button>
        </form>
      </section>

      {/* Your Loans */}
      <section className={styles.yourLoans}>
        <h2>Your Loans</h2>
        <ul>
          {loans.map((loan) => (
            <li key={loan.id}>
              <h3>{loan.lender}</h3>
              <p>Amount: ${loan.amount.toFixed(2)}</p>
              <p>Interest Rate: {loan.interestRate}%</p>
              <p>Term: {loan.term} years</p>
              <p>Monthly Payment: ${loan.monthlyPayment.toFixed(2)}</p>
              <p>Type: {loan.type}</p>
              <p>Start Date: {new Date(loan.startDate).toLocaleDateString()}</p>
              <button onClick={() => {
                const paymentAmount = prompt("Enter payment amount:");
                if (paymentAmount) handleAddPayment(loan.id, paymentAmount);
              }}>
                Add Payment
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Payment Schedule */}
      {selectedLoan && (
        <section className={styles.paymentSchedule}>
          <h2>Payment Schedule for {selectedLoan.lender}</h2>
          <LineChart
            width={500}
            height={300}
            data={generatePaymentSchedule(selectedLoan)}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="paymentNumber" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="remainingBalance" stroke="#8884d8" />
          </LineChart>
        </section>
      )}
    </div>
  );
};

export default LoanTracker;