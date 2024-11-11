import React, { useState, useEffect } from "react";
import styles from "../assets/styles/emicalculator/emi.module.css";

const LoanTracker = () => {
  const [paymentAmounts, setPaymentAmounts] = useState({});
  const [loans, setLoans] = useState([]);
  const [newLoan, setNewLoan] = useState({
    loanAmount: "",
    interestRate: "",
    term: "",
    lender: "",
    loanType: "Personal",
    startDate: "",
  });
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

        // Fetch payments
        const loanId = loansData.length > 0 ? loansData[0]._id : null;
        if (loanId) {
          const paymentsResponse = await fetch(`/api/loans/${loanId}/payments`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!paymentsResponse.ok) {
            throw new Error("Failed to fetch payments");
          }

          const paymentsData = await paymentsResponse.json();
          setPayments(Array.isArray(paymentsData) ? paymentsData : []);
        }

      } catch (error) {
        console.error("Error in data fetching:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndLoans();
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

  const calculateTotalInterest = (loan, paymentsMade) => {
    if (!loan || !paymentsMade) return 0;

    const monthlyRate = loan.interestRate / 100 / 12;
    const monthlyPayment = loan.monthlyPayment;
    let balance = loan.loanAmount;
    let totalInterestPaid = 0;

    paymentsMade.forEach(payment => {
      // Calculate interest portion of this payment
      const interestForMonth = balance * monthlyRate;
      const principalForMonth = Math.min(payment.amount, monthlyPayment - interestForMonth);

      // Add interest to total only if it was actually paid
      if (payment.amount >= interestForMonth) {
        totalInterestPaid += interestForMonth;
      } else {
        totalInterestPaid += payment.amount; // If payment is less than interest due
      }

      // Update balance
      balance = balance - principalForMonth;
    });

    return totalInterestPaid;
  };

  // Calculate remaining balance
  const calculateRemainingBalance = (loan, paymentsMade) => {
    if (!loan || !paymentsMade) return loan ? loan.loanAmount : 0;

    const monthlyRate = loan.interestRate / 100 / 12;
    let balance = loan.loanAmount;

    paymentsMade.forEach(payment => {
      const interestForMonth = balance * monthlyRate;
      const principalPayment = Math.max(0, payment.amount - interestForMonth);
      balance = Math.max(0, balance - principalPayment);
    });

    return Math.max(0, balance);
  };

  const calculateSummary = () => {
    if (!loans || !payments) return;

    const summary = loans.reduce((acc, loan) => {
      // Get all payments for this loan
      const loanPayments = payments.filter(p => p.loanId === loan._id);

      // Calculate total paid for this loan
      const totalPaidForLoan = loanPayments.reduce((sum, payment) => sum + payment.amount, 0);

      // Calculate interest paid for this loan
      const interestPaidForLoan = calculateTotalInterest(loan, loanPayments);

      // Calculate remaining balance
      const remainingBalance = calculateRemainingBalance(loan, loanPayments);

      return {
        totalLoans: acc.totalLoans + loan.loanAmount,
        totalPaid: acc.totalPaid + totalPaidForLoan,
        totalInterestPaid: acc.totalInterestPaid + interestPaidForLoan,
        totalRemaining: acc.totalRemaining + remainingBalance
      };
    }, {
      totalLoans: 0,
      totalPaid: 0,
      totalInterestPaid: 0,
      totalRemaining: 0
    });

    setSummary(summary);
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
        });
      } else {
        console.error("Failed to add loan:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding loan:", error.message);
    }
  };

  const handlePayment = async (loanId, amount) => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      alert("Please enter a valid payment amount");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`/api/loans/${loanId}/payments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          date: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add payment');
      }

      const data = await response.json();

      // Update payments state with the new payment
      setPayments(prevPayments => [
        ...prevPayments,
        {
          loanId: loanId,
          amount: parseFloat(amount),
          date: new Date().toISOString()
        }
      ]);

      // Update loans state
      setLoans(prevLoans =>
          prevLoans.map(loan =>
              loan._id === loanId
                  ? {
                    ...loan,
                    loanAmount: loan.loanAmount - parseFloat(amount)
                  }
                  : loan
          )
      );

      // Clear payment amount
      setPaymentAmounts(prev => ({
        ...prev,
        [loanId]: ''
      }));

      // Recalculate summary
      calculateSummary();

    } catch (error) {
      console.error("Error adding payment:", error);
      alert(error.message || "An error occurred while adding payment.");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
      <div className={styles.loanBody}>
        <div className={styles.container}>
          <h1>Loan Tracker</h1>

          <section className={styles.summary}>
            <h2>Summary Dashboard</h2>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryCard}>
                <h3>Total Loans</h3>
                <p>₹{summary.totalLoans.toFixed(2)}</p>
              </div>
              <div className={styles.summaryCard}>
                <h3>Total Paid</h3>
                <p>₹{summary.totalPaid.toFixed(2)}</p>
              </div>
              <div className={styles.summaryCard}>
                <h3>Interest Paid</h3>
                <p>₹{summary.totalInterestPaid.toFixed(2)}</p>
              </div>
              <div className={styles.summaryCard}>
                <h3>Remaining Balance</h3>
                <p>₹{summary.totalRemaining.toFixed(2)}</p>
              </div>
            </div>
          </section>

          <section className={styles.addLoan}>
            <h2>Add New Loan</h2>
            <form onSubmit={handleAddLoan}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Loan Amount (₹)</label>
                  <input
                      type="number"
                      value={newLoan.loanAmount}
                      onChange={(e) =>
                          setNewLoan({...newLoan, loanAmount: e.target.value})
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
                      value={newLoan.loanType}
                      onChange={(e) =>
                          setNewLoan({...newLoan, loanType: e.target.value})
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
              <button className={styles.addloanbutton} type="submit">Add Loan</button>
            </form>
          </section>

          <section className={styles.yourLoans}>
            <h2>Your Loans</h2>
            <ul>
              {loans.map((loan) => {
                const loanPayments = payments.filter(p => p.loanId === loan._id);
                const totalPaid = loanPayments.reduce((sum, p) => sum + p.amount, 0);
                const remainingBalance = calculateRemainingBalance(loan, loanPayments);
                const totalInterest = calculateTotalInterest(loan, loanPayments);

                return (
                    <li key={loan._id}>
                      <div className={styles.loanCard}>
                        <div className={styles.loanHeader}>
                          <h3>{loan.lender}</h3>
                          <span className={styles.loanType}>{loan.loanType}</span>
                        </div>

                        <div className={styles.loanDetails}>
                          <p>Amount: ₹{loan.loanAmount.toFixed(2)}</p>
                          <p>Interest Rate: {loan.interestRate}%</p>
                          <p>Term: {loan.term} years</p>
                          <p>Monthly Payment: ₹{loan.monthlyPayment.toFixed(2)}</p>
                          <p>Start Date: {new Date(loan.startDate).toLocaleDateString()}</p>
                          <p>Total Paid: ₹{totalPaid.toFixed(2)}</p>
                          <p>Interest Paid: ₹{totalInterest.toFixed(2)}</p>
                          <p>Remaining Balance: ₹{remainingBalance.toFixed(2)}</p>
                        </div>

                        <div className={styles.paymentSection}>
                          <input
                              type="number"
                              value={paymentAmounts[loan._id] || ''}
                              onChange={(e) => setPaymentAmounts(prev => ({
                                ...prev,
                                [loan._id]: e.target.value
                              }))}
                              placeholder="Enter payment amount"
                              min="0"
                              step="0.01"
                              className={styles.paymentInput}
                          />
                          <button
                              onClick={() => handlePayment(loan._id, paymentAmounts[loan._id])}
                              disabled={!paymentAmounts[loan._id] || parseFloat(paymentAmounts[loan._id]) <= 0}
                              className={styles.paymentButton}
                          >
                            Add Payment
                          </button>
                        </div>

                        {loanPayments.length > 0 && (
                            <div className={styles.paymentHistory}>
                              <h4>Payment History</h4>
                              <ul>
                                {loanPayments
                                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                                    .map((payment, index) => (
                                        <li key={payment._id || index}>
                                          ₹{payment.amount.toFixed(2)} - {new Date(payment.date).toLocaleDateString()}
                                        </li>
                                    ))}
                              </ul>
                            </div>
                        )}
                      </div>
                    </li>
                );
              })}
            </ul>
          </section>
        </div>
      </div>
  );
};

export default React.memo(LoanTracker);