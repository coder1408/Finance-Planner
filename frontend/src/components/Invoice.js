import React, { useState, useEffect } from "react";
import styles from "../assets/styles/invoice/Invoice.module.css";

const Invoice = ({ billingPeriod }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [userId, setUserId] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    // Check for token on component mount
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found. Please log in.");
      return;
    }
    setAuthToken(token);

    const fetchCurrentUser = async () => {
      try {
        console.log("Fetching user with token:", token);

        const response = await fetch("/api/user/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include", // Include cookies if using session-based auth
        });

        console.log("Profile response status:", response.status);

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token"); // Clear invalid token
            throw new Error("Authentication token expired. Please log in again.");
          }
          throw new Error(`Failed to fetch user profile: ${response.status}`);
        }

        const userData = await response.json();
        console.log("User data received:", userData);

        if (!userData._id) {
          throw new Error("No user ID found in response");
        }

        setUserId(userData._id);
      } catch (err) {
        console.error("Failed to fetch current user:", err);
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

      console.log("Generating PDF with token:", authToken);

      const response = await fetch("/api/invoice/generate", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        credentials: "include", // Include cookies if using session-based auth
      });

      console.log("Generate PDF response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("PDF generation error response:", errorData);

        if (response.status === 401) {
          localStorage.removeItem("token"); // Clear invalid token
          throw new Error("Authentication expired. Please log in again.");
        }

        throw new Error(errorData.error || errorData.details || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("PDF generation success response:", data);

      if (!data.filePath) {
        throw new Error("Invalid response format: missing file path");
      }

      // Construct the full URL for the PDF
      const fullPdfUrl = `${window.location.origin}${data.filePath}`;
      setPdfUrl(fullPdfUrl);
    } catch (err) {
      console.error("PDF generation error:", err);
      setError(err.message || "Failed to generate PDF invoice");

      if (err.message.includes("authentication") || err.message.includes("log in")) {
        // Redirect to login or show login modal
        // window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  // If no auth token is present, show login prompt
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

  // If we're still loading the user data
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
