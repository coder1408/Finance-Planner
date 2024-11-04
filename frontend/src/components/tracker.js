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
  const [paymentAmount, setPaymentAmount] = useState("");
  const [loans, setLoans] = useState([]);
  const [newLoan, setNewLoan] = useState({
    loanAmount: "",
    interestRate: "",
    term: "",
    lender: "",
    loanType: "Personal",
    startDate: "",
  });
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [payments, setPayments] = useState([]);
  const [userID, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({
    totalLoans: 0,
    totalPaid: 0,
    totalInterestPaid: 0,
    totalRemaining: 0,
  });

  // Fetch existing loans on component mount
  useEffect(() => {
    const fetchUserAndLoans = async () => {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication token missing");
        setIsLoading(false);
        return;
      }

      try {
        // First fetch user profile
        const userResponse = await fetch("http://localhost:3000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!userResponse.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const userData = await userResponse.json();
        setUserId(userData._id);

        // Then fetch loans for this specific user
        const loansResponse = await fetch(`/api/loans/user/${userData._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!loansResponse.ok) {
          throw new Error("Failed to fetch loans");
        }

        const loansData = await loansResponse.json();
        setLoans(Array.isArray(loansData) ? loansData : []);

        const paymentsResponse = await fetch(`/api/loans/user/${userData._id}`, {
          headers: {
              Authorization: `Bearer ${token}`,
          },
        });

        if (!paymentsResponse.ok) {
            throw new Error("Failed to fetch payments");
        }

        const paymentsData = await paymentsResponse.json();
        setPayments(Array.isArray(paymentsData) ? paymentsData : []);

      } catch (error) {
        console.error("Error in data fetching:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndLoans();
  }, []);

  // Effect to calculate summary whenever loans or payments change


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
    return loan.loanAmount + totalInterest - totalPaid;
  };

  // Calculate total interest
  const calculateTotalInterest = (loan, paymentsMade) => {
    if (!loan) return 0;
    const monthlyRate = loan.interestRate / 100 / 12;
    let balance = loan.loanAmount;
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
    let balance = loan.loanAmount;
    const monthlyPayment = calculateMonthlyPayment(
      loan.loanAmount,
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

  const calculateSummary = () => {
    // Ensure loans and payments are defined
    if (!loans || !payments) return;

    // Calculate the total amount of loans
    const totalLoans = loans.reduce((sum, loan) => sum + loan.loanAmount, 0);

    // Calculate the total amount paid from payments
    const totalPaid = loans.reduce((sum, loan) => {
      // Ensure that payments is indeed an array of numbers
      return sum + (Array.isArray(loan.payments) ? loan.payments.reduce((acc, payment) => acc + payment, 0) : 0);
  }, 0);
    // Calculate total interest paid
    const totalInterestPaid = loans.reduce((sum, loan) => {
        const loanPayments = payments.filter((p) => p.loanId === loan._id);
        return sum + calculateTotalInterest(loan, loanPayments);
    }, 0);

    // Calculate total remaining balance
    const totalRemaining = loans.reduce((sum, loan) => {
        const loanPayments = payments.filter((p) => p.loanId === loan._id);
        return sum + calculateRemainingBalance(loan, loanPayments);
    }, 0);

    // Set the summary state
    setSummary({ totalLoans, totalPaid, totalInterestPaid, totalRemaining });
};



  useEffect(() => {
    calculateSummary(); 
  }, [loans, payments]);

  // Handle adding a new loan
  const handleAddLoan = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token is missing");
      return;
    }

    const monthlyPayment = calculateMonthlyPayment(
      parseFloat(newLoan.loanAmount),
      parseFloat(newLoan.interestRate),
      parseFloat(newLoan.term)
    );

    const loanWithPayment = {
      ...newLoan,
      monthlyPayment,
      loanAmount: parseFloat(newLoan.loanAmount),
      interestRate: parseFloat(newLoan.interestRate),
      term: parseFloat(newLoan.term),
      startDate: new Date(newLoan.startDate).toISOString().split("T")[0],
      loanType: newLoan.loanType,
      userId: userID,
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
          loanAmount: "",
          interestRate: "",
          term: "",
          lender: "",
          loanType: "Personal",
          startDate: "",
          userId: userID,
        });
      } else {
        console.error("Failed to add loan:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding loan:", error.message);
    }
  };

  const handlePayment = async (loanId, amount) => {
    console.log("Handling payment for loan ID:", loanId, "with amount:", amount);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`/api/loans/${loanId}/payments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", 
        },
        body: JSON.stringify({ amount: parseFloat(amount) }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to add payment:", errorData.message);
        alert(`Failed to add payment: ${errorData.message}`);
        return;
      }

      const data = await response.json();
      console.log("Payment added successfully:", data);
      setPayments((prevPayments) => [...prevPayments, data.payment]); // Update the payments state
      setPaymentAmount('');
    } catch (error) {
      console.error("Error adding payment:", error);
      alert("An error occurred while adding payment.");
    }
  };
  console.log("YourLoans component rendered");

  return (
      <div className={styles.container}>
        <h1>Loan Tracker</h1>

        <section className={styles.summary}>
          <h2>Summary Dashboard</h2>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryCard}>
              <h3>Total Loans</h3>
              <p>${summary.totalLoans.toFixed(2)}</p>
            </div>
            <div className={styles.summaryCard}>
              <h3>Total Paid</h3>
              <p>${summary.totalPaid.toFixed(2)}</p>
            </div>
            <div className={styles.summaryCard}>
              <h3>Interest Paid</h3>
              <p>${summary.totalInterestPaid.toFixed(2)}</p>
            </div>
            <div className={styles.summaryCard}>
              <h3>Remaining Balance</h3>
              <p>${summary.totalRemaining.toFixed(2)}</p>
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
                    value={newLoan.loanAmount}
                    onChange={(e) =>
                        setNewLoan({...newLoan, loanAmount: e.target.value}) // Fixed: Changed amount to loanAmount
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
                        setNewLoan({...newLoan, interestRate: e.target.value})
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
                        setNewLoan({...newLoan, term: e.target.value})
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
                        setNewLoan({...newLoan, lender: e.target.value})
                    }
                    required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Type</label>
                <select
                    value={newLoan.loanType} // Changed from type to loanType
                    onChange={(e) =>
                        setNewLoan({...newLoan, loanType: e.target.value}) // Changed from type to loanType
                    }
                >
                  <option value="Personal">Personal</option>
                  <option value="Home">Home</option>
                  <option value="Auto">Auto</option>
                  <option value="Education">Education</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Start Date</label>
                <input
                    type="date"
                    value={newLoan.startDate}
                    onChange={(e) =>
                        setNewLoan({...newLoan, startDate: e.target.value})
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
                    <li key={loan._id}>
                        <h3>{loan.lender}</h3>
                        <p>Amount: ${loan.loanAmount.toFixed(2)}</p>
                        <p>Interest Rate: {loan.interestRate}%</p>
                        <p>Term: {loan.term} years</p>
                        <p>Monthly Payment: ${loan.monthlyPayment.toFixed(2)}</p>
                        <p>Type: {loan.loanType}</p>
                        <p>Start Date: {new Date(loan.startDate).toLocaleDateString()}</p>

                        <input
                            type="number"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                            placeholder="Enter payment amount"
                            min="0"
                            step="0.01"
                        />
                        <button onClick={() => {
                            console.log("About to add payment for loan ID:", loan._id, "with amount:", paymentAmount);
                            handlePayment(loan._id, paymentAmount);
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
                  margin={{top: 5, right: 30, left: 20, bottom: 5}}
              >
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="paymentNumber"/>
                <YAxis/>
                <Tooltip/>
                <Legend/>
                <Line type="monotone" dataKey="remainingBalance" stroke="#8884d8"/>
              </LineChart>
            </section>
        )}
      </div>
  );
};

export default React.memo(LoanTracker);