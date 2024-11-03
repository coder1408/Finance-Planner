import React, { useState, useEffect } from 'react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart, Bar
} from 'recharts';
import styles from '../assets/styles/Guide/guide.module.css';

const FinancialGuide = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [overview, setOverview] = useState(null);
    const [goalProgress, setGoalProgress] = useState(null);
    const [loanAdvice, setLoanAdvice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('No authentication token found. Please log in.');
                    setLoading(false);
                    return;
                }

                const headers = {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                };

                const [overviewRes, goalRes, loanRes] = await Promise.all([
                    fetch('/api/guide/overview', { headers }),
                    fetch('/api/guide/goal-progress', { headers }),
                    fetch('/api/guide/loan-repayment-advice', { headers })
                ]);

                if (!overviewRes.ok || !goalRes.ok || !loanRes.ok) {
                    const errorResponse = await overviewRes.json();
                    throw new Error(errorResponse.message || 'Failed to fetch data');
                }

                const [overviewData, goalData, loanData] = await Promise.all([
                    overviewRes.json(),
                    goalRes.json(),
                    loanRes.json()
                ]);

                setOverview(overviewData.data);
                setGoalProgress(goalData.data || []);
                setLoanAdvice(loanData.data || []);
            } catch (err) {
                setError(err.message || 'Failed to fetch financial data');
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const renderGoalProgress = () => {
        if (!goalProgress || goalProgress.length === 0) {
            return <div>No goal progress data available. Please set up your goals.</div>;
        }

        // Parse progress to a number to ensure proper rendering
        const formattedData = goalProgress.map((goal) => ({
            ...goal,
            progress: parseFloat(goal.progress),
            remaining: goal.targetAmount - goal.currentAmount, // Calculate the remaining amount
        }));

        return (
            <div className={styles.chartContainer}>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={formattedData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="category" type="category" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="currentAmount" fill="#4299e1" name="Current Amount" />
                        <Bar dataKey="remaining" fill="#e53e3e" name="Remaining Amount" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        );
    };


    const renderLoanOverview = () => {
        if (!loanAdvice || loanAdvice.length === 0) {
            return <div>No loan data available.</div>;
        }

        return (
            <div className={styles.chartContainer}>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={loanAdvice} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="loanType" type="category" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="loanAmount" fill="#8884d8" name="Total Loan Amount" />
                        <Bar dataKey="monthlyPayment" fill="#82ca9d" name="Monthly Payment" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        );
    };

    if (loading) return <div className={styles.loadingState}>Loading financial data...</div>;
    if (error) return <div className={styles.errorState}>{error}</div>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Financial Guide</h1>

            <div className={styles.tabList}>
                {['overview', 'goals', 'loans'].map((tab) => (
                    <button
                        key={tab}
                        className={activeTab === tab ? styles.tabButtonActive : styles.tabButton}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {activeTab === 'overview' && (
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2 className={styles.cardTitle}>Financial Overview</h2>
                    </div>
                    <div className={styles.cardContent}>
                        {overview ? (
                            <div className={styles.grid}>
                                <div className={styles.statItem}>
                                    <div className={styles.statLabel}>Active Budgets</div>
                                    <div>{overview.budgets?.length || 0}</div>
                                </div>
                                <div className={styles.statItem}>
                                    <div className={styles.statLabel}>Active Goals</div>
                                    <div>{overview.goals?.length || 0}</div>
                                </div>
                                <div className={styles.statItem}>
                                    <div className={styles.statLabel}>Active Loans</div>
                                    <div>{overview.loans?.length || 0}</div>
                                </div>
                            </div>
                        ) : (
                            <div>No overview data available.</div>
                        )}
                    </div>
                </div>
            )}


            {activeTab === 'goals' && (
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2 className={styles.cardTitle}>Goal Progress</h2>
                    </div>
                    <div className={styles.cardContent}>{renderGoalProgress()}</div>
                </div>
            )}

            {activeTab === 'loans' && (
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2 className={styles.cardTitle}>Loan Repayment Analysis</h2>
                    </div>
                    <div className={styles.cardContent}>{renderLoanOverview()}</div>
                </div>
            )}
        </div>
    );
};

export default FinancialGuide;
