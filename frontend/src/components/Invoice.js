import React, { useState, useEffect } from "react";
import styles from "../assets/styles/invoice/Invoice.module.css";

const Invoice = ({ billingPeriod }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [userId, setUserId] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  // States for invoice data preview
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found. Please log in.");
      return;
    }
    setAuthToken(token);

    const fetchCurrentUser = async () => {
      try {
        const response = await fetch("/api/user/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
            throw new Error("Authentication token expired. Please log in again.");
          }
          throw new Error(`Failed to fetch user profile: ${response.status}`);
        }

        const userData = await response.json();
        if (!userData._id) {
          throw new Error("No user ID found in response");
        }

        setUserId(userData._id);
        fetchInvoiceData(token); // Fetch invoice preview data
      } catch (err) {
        setError(err.message || "Failed to authenticate user. Please try logging in again.");
      }
    };

    fetchCurrentUser();
  }, []);

  const fetchInvoiceData = async (token) => {
    try {
      const response = await fetch("/api/invoice/summary", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch invoice preview: ${response.status}`);
      }

      const data = await response.json();
      setBudgets(data.budgets);
      setExpenses(data.expenses);
      setGoals(data.goals);
      setLoans(data.loans);
    } catch (err) {
      setError(err.message || "Failed to load invoice data preview.");
    }
  };

  const generatePDF = async () => {
    if (!userId || !authToken) {
      setError("User not authenticated. Please log in.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setPdfUrl(null);

      const response = await fetch("/api/invoice/generate", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          throw new Error("Authentication expired. Please log in again.");
        }
        throw new Error(`Failed to generate PDF: ${response.status}`);
      }

      const blob = await response.blob();
      const pdfUrl = URL.createObjectURL(blob);
      setPdfUrl(pdfUrl);
    } catch (err) {
      setError(err.message || "Failed to generate PDF invoice");
    } finally {
      setLoading(false);
    }
  };

  if (!authToken) {
    return (
        <div className={styles.container}>
          <div className={styles.loginPrompt}>
            <h2>Authentication Required</h2>
            <p>Please log in to access invoice generation.</p>
          </div>
        </div>
    );
  }

  return (
      <div className={styles.container}>
        <div className={styles.invoice}>
          <div className={styles.invoiceHeader}>
            <div className={styles.brandInfo}>
              <h1>Finance Tracker</h1>
              <span className={styles.documentType}>Professional Invoice</span>
            </div>

            <div className={styles.metadata}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Date:</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              {billingPeriod && (
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Billing Period:</span>
                    <span>{billingPeriod}</span>
                  </div>
              )}
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Invoice ID:</span>
                <span>{userId}</span>
              </div>
            </div>

            <button
                onClick={generatePDF}
                className={`${styles.generateButton} ${loading ? styles.loading : ''}`}
                disabled={loading}
            >
              {loading ? (
                  <>
                    <span className={styles.spinner}></span>
                    Generating...
                  </>
              ) : (
                  'Generate PDF Invoice'
              )}
            </button>
            {pdfUrl && (
                <div className={styles.success}>
                  <p>
                    PDF generated successfully!{" "}
                    <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                      Download Invoice
                    </a>
                  </p>
                </div>
            )}
          </div>

          {error && (
              <div className={styles.error}>
                <p>{error}</p>
              </div>
          )}

          <div className={styles.invoiceContent}>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Expenses</h2>
              <div className={styles.grid}>
                {expenses.length > 0 ? (
                    expenses.map((expense) => (
                        <div key={expense._id} className={styles.card}>
                          <div className={styles.cardHeader}>{expense.category}</div>
                          <div className={styles.cardBody}>
                            <span className={styles.amount}>${expense.amount}</span>
                            <span className={styles.label}>Amount Spent</span>
                          </div>
                        </div>
                    ))
                ) : (
                    <p className={styles.emptyState}>No expenses available</p>
                )}
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Financial Goals</h2>
              <div className={styles.grid}>
                {goals.length > 0 ? (
                    goals.map((goal) => (
                        <div key={goal._id} className={styles.card}>
                          <div className={styles.cardHeader}>{goal.category}</div>
                          <div className={styles.cardBody}>
                            <span className={styles.amount}>${goal.targetAmount}</span>
                            <span className={styles.label}>Target Amount</span>
                          </div>
                        </div>
                    ))
                ) : (
                    <p className={styles.emptyState}>No goals available</p>
                )}
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Loans</h2>
              <div className={styles.grid}>
                {loans.length > 0 ? (
                    loans.map((loan) => (
                        <div key={loan._id} className={styles.card}>
                          <div className={styles.cardHeader}>{loan.loanType}</div>
                          <div className={styles.cardBody}>
                            <span className={styles.amount}>${loan.loanAmount}</span>
                            <span className={styles.label}>Loan Amount</span>
                          </div>
                        </div>
                    ))
                ) : (
                    <p className={styles.emptyState}>No loans available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Invoice;
