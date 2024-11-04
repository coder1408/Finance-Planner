import React, { useState, useEffect } from "react";
import styles from "../assets/styles/invoice/Invoice.module.css";

const Invoice = ({ billingPeriod }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [userId, setUserId] = useState(null);
  const [authToken, setAuthToken] = useState(null);

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
      } catch (err) {
        setError(err.message || "Failed to authenticate user. Please try logging in again.");
      }
    };

    fetchCurrentUser();
  }, []);

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

      // Fetch response as blob for PDF data
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
        <div className={styles.invoiceCard}>
          <div className={styles.cardContent}>
            <div className={styles.error}>
              Please log in to access invoice generation.
              {/* Add your login button/link here */}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!userId && !error) {
    return (
      <div className={styles.container}>
        <div className={styles.invoiceCard}>
          <div className={styles.cardContent}>
            <div className={styles.loading}>Loading user data...</div>
          </div>
        </div>
      </div>
    );
  }
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
                <div className={styles.actions}>
                  <button
                      onClick={generatePDF}
                      className={styles.downloadButton}
                      disabled={loading}
                  >
                    {loading ? "Generating PDF..." : "Generate Invoice PDF"}
                  </button>
                </div>
              </div>
              <div className={styles.metadata}>
                <div>Generated: {new Date().toLocaleDateString()}</div>
                {billingPeriod && <div>Billing Period: {billingPeriod}</div>}
                <div>User ID: {userId}</div>
              </div>
            </div>

            {error && (
                <div className={styles.errorNotification}>
                  <p>{error}</p>
                  {error.includes("log in") && (
                      <button
                          className={styles.loginButton}
                          onClick={() => {
                            // Add your login navigation logic here
                            // window.location.href = '/login';
                          }}
                      >
                        Go to Login
                      </button>
                  )}
                </div>
            )}

            {pdfUrl && (
                <div className={styles.pdfNotification}>
                  <p>
                    PDF generated successfully!{" "}
                    <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.downloadLink}
                    >
                      Click here to download your invoice
                    </a>
                  </p>
                </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default Invoice;