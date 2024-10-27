import React, { useEffect, useState } from "react";
import styles from "../assets/styles/invoice/Invoice.module.css";

const Invoice = ({ userId, billingPeriod }) => {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [income, setIncome] = useState([]);
  const [savings, setSavings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch user information
        const userResponse = await fetch(`/api/users/${userId}`);
        const userData = await userResponse.json();
        setUser(userData);

        // Fetch transactions
        const transactionsResponse = await fetch(
          `/api/users/${userId}/transactions`
        );
        const transactionsData = await transactionsResponse.json();
        setTransactions(transactionsData);

        // Fetch income
        const incomeResponse = await fetch(`/api/users/${userId}/income`);
        const incomeData = await incomeResponse.json();
        setIncome(incomeData);

        // Fetch savings
        const savingsResponse = await fetch(`/api/users/${userId}/savings`);
        const savingsData = await savingsResponse.json();
        setSavings(savingsData);
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // Check for loading or error state
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const totalExpenses = transactions.reduce(
    (acc, transaction) => acc + (transaction?.amount || 0),
    0
  );
  const totalIncome = income.reduce((acc, inc) => acc + (inc?.amount || 0), 0);
  const netBalance = totalIncome - totalExpenses;

  const categorizedExpenses = transactions.reduce((acc, transaction) => {
    const category = transaction?.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = {
        amount: 0,
        transactions: 0,
      };
    }
    acc[category].amount += transaction?.amount || 0;
    acc[category].transactions += 1;
    acc[category].percentage =
      totalExpenses > 0 ? (acc[category].amount / totalExpenses) * 100 : 0;
    return acc;
  }, {});

  const invoiceNumber = `INV-${new Date().getFullYear()}${String(
    new Date().getMonth() + 1
  ).padStart(2, "0")}${String(new Date().getDate()).padStart(
    2,
    "0"
  )}-${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")}`;

  return (
    <div className={styles.container}>
      <div className={styles.invoiceCard}>
        <div className={styles.cardContent}>
          <div className={styles.header}>
            <div className={styles.headerTop}>
              <div>
                <h1 className={styles.title}>Finance Tracker</h1>
                <p className={styles.subtitle}>Professional Invoice</p>
              </div>
              <span className={styles.invoiceNumber}>{invoiceNumber}</span>
            </div>
            <div className={styles.metadata}>
              <div>Generated: {new Date().toLocaleDateString()}</div>
              <div>Billing Period: {billingPeriod}</div>
            </div>
          </div>

          <div className={styles.userSection}>
            <h3 className={styles.sectionTitle}>User Information</h3>
            {user && (
              <div className={styles.userInfo}>
                <div>{user.name}</div>
                <div>{user.email}</div>
                <div>{user.phone || "N/A"}</div>
              </div>
            )}
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Expense Summary</h3>
            {Object.keys(categorizedExpenses).length > 0 ? (
              <div className={styles.expensesList}>
                {Object.entries(categorizedExpenses).map(([category, data]) => (
                  <div key={category} className={styles.expenseItem}>
                    <div className={styles.categoryIndicator}>
                      <div className={styles.dot} />
                      <span>{category}</span>
                    </div>
                    <div className={styles.expenseItem}>
                      <span className={styles.percentageText}>
                        {data.percentage.toFixed(1)}%
                      </span>
                      <span className={styles.amountText}>
                        ${data.amount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.noData}>No expenses recorded</p>
            )}
          </div>

          <div className={styles.divider} />

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Income Summary</h3>
            {income.length > 0 ? (
              <div className={styles.expensesList}>
                {income.map((inc, index) => (
                  <div key={index} className={styles.incomeItem}>
                    <span>{inc.source}</span>
                    <span className={styles.amountText}>
                      ${inc.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.noData}>No income recorded</p>
            )}
          </div>

          <div className={styles.divider} />

          <div className={styles.overviewGrid}>
            <div className={styles.overviewItem}>
              <p className={styles.overviewLabel}>Total Expenses</p>
              <p className={styles.expenseAmount}>
                -${totalExpenses.toFixed(2)}
              </p>
            </div>
            <div className={styles.overviewItem}>
              <p className={styles.overviewLabel}>Total Income</p>
              <p className={styles.incomeAmount}>+${totalIncome.toFixed(2)}</p>
            </div>
            <div className={styles.overviewItem}>
              <p className={styles.overviewLabel}>Net Balance</p>
              <p
                className={`${styles.balanceAmount} ${
                  netBalance >= 0
                    ? styles.balancePositive
                    : styles.balanceNegative
                }`}
              >
                ${netBalance.toFixed(2)}
              </p>
            </div>
          </div>

          <div className={styles.savingsSection}>
            <h3 className={styles.sectionTitle}>Savings & Investments</h3>
            <div className={styles.incomeItem}>
              <span>Total Savings Added</span>
              <span className={styles.savingsAmount}>
                +${savings.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        <p>Contact us at support@primeplanfinancials.com</p>
        <p>Thank you for using our service!</p>
      </footer>
    </div>
  );
};

export default Invoice;
