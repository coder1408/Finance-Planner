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
                    throw new Error('Failed to fetch data');
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
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const renderGoalProgress = () => {
        if (!goalProgress || goalProgress.length === 0) {
            return <div className={styles.emptyState}>No goal progress data available. Please set up your goals.</div>;
        }

        const formattedData = goalProgress.map((goal) => ({
            ...goal,
            progress: parseFloat(goal.progress),
            remaining: goal.targetAmount,
        }));

        return (
            <div className={styles.chartWrapper}>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={formattedData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="category" type="category" />
                        <Tooltip contentStyle={{ background: '#fff', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
                        <Legend />
                        <Bar dataKey="currentAmount" fill="#6366f1" name="Current Amount" />
                        <Bar dataKey="remaining" fill="#f43f5e" name="Remaining Amount" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        );
    };

    const renderLoanOverview = () => {
        if (!loanAdvice || loanAdvice.length === 0) {
            return <div className={styles.emptyState}>No loan data available.</div>;
        }

        return (
            <div className={styles.chartWrapper}>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={loanAdvice} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="loanType" type="category" />
                        <Tooltip contentStyle={{ background: '#fff', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
                        <Legend />
                        <Bar dataKey="loanAmount" fill="#6366f1" name="Total Loan Amount" />
                        <Bar dataKey="monthlyPayment" fill="#10b981" name="Monthly Payment" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        );
    };

    if (loading) return <div className={styles.loadingState}><div className={styles.spinner}></div></div>;
    if (error) return <div className={styles.errorState}><span className={styles.errorIcon}>⚠️</span>{error}</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Financial Guide</h1>
                <p className={styles.subtitle}>Track your financial progress and goals</p>
            </header>

            <nav className={styles.tabs}>
                {['overview', 'goals', 'loans'].map((tab) => (
                    <button
                        key={tab}
                        className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </nav>

            <main className={styles.content}>
                {activeTab === 'overview' && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Financial Overview</h2>
                        {overview ? (
                            <div className={styles.statsGrid}>
                                <div className={styles.statCard}>
                                    <span className={styles.statIcon}>📊</span>
                                    <h3 className={styles.statTitle}>Active Budgets</h3>
                                    <p className={styles.statValue}>{overview.expenses?.length || 0}</p>
                                </div>
                                <div className={styles.statCard}>
                                    <span className={styles.statIcon}>🎯</span>
                                    <h3 className={styles.statTitle}>Active Goals</h3>
                                    <p className={styles.statValue}>{overview.budgets?.length || 0}</p>
                                </div>
                                <div className={styles.statCard}>
                                    <span className={styles.statIcon}>💰</span>
                                    <h3 className={styles.statTitle}>Active Loans</h3>
                                    <p className={styles.statValue}>{overview.goals?.length || 0}</p>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.emptyState}>No overview data available.</div>
                        )}
                    </section>
                )}

                {activeTab === 'goals' && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Goal Progress</h2>
                        {renderGoalProgress()}
                    </section>
                )}

                {activeTab === 'loans' && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Loan Repayment Analysis</h2>
                        {renderLoanOverview()}
                    </section>
                )}
            </main>
        </div>
    );
};

export default FinancialGuide;