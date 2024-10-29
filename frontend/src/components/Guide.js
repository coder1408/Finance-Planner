import React, { useState, useEffect } from 'react';
import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import styles from '../assets/styles/Guide/guide.module.css';

const InvestmentAdvisor = ({ budgetData, loanData }) => {
    // Initialize state with integrated data structure
    const [analysis, setAnalysis] = useState(null);

    // Calculate total monthly income from budget
    const calculateMonthlyIncome = () => {
        return parseFloat(budgetData?.income || 0);
    };

    // Calculate total monthly expenses from budget
    const calculateMonthlyExpenses = () => {
        return budgetData?.expenses?.reduce((sum, exp) => sum + parseFloat(exp.amount), 0) || 0;
    };

    // Calculate total savings from budget goals
    const calculateTotalSavings = () => {
        return budgetData?.goals?.reduce((sum, goal) => {
            const spent = budgetData?.categoryTotals?.[goal.category] || 0;
            return sum + spent;
        }, 0) || 0;
    };

    // Calculate total debt from loans
    const calculateTotalDebt = () => {
        return loanData?.loans?.reduce((sum, loan) => sum + parseFloat(loan.amount), 0) || 0;
    };

    // Calculate monthly debt payments from loans
    const calculateMonthlyDebtPayments = () => {
        return loanData?.loans?.reduce((sum, loan) => sum + parseFloat(loan.monthlyPayment || 0), 0) || 0;
    };

    useEffect(() => {
        const fetchInvestmentAnalysis = async () => {
            try {
                const response = await fetch('/api/investment/analyze', {
                    headers: { Authorization: `Bearer ${token}` } // Replace with actual token if needed
                });
                const data = await response.json();
                setAnalysis(data);
            } catch (error) {
                console.error("Error fetching investment analysis:", error);
            }
        };
        fetchInvestmentAnalysis().then(r => console.log(r));
    }, []);

    const calculateFinancialHealth = () => {
        // Get values from budget and loan data
        const income = calculateMonthlyIncome();
        const expenses = calculateMonthlyExpenses();
        const savings = calculateTotalSavings();
        const debt = calculateTotalDebt();
        const debtPayments = calculateMonthlyDebtPayments();

        // Calculate key metrics
        const disposableIncome = income - expenses - debtPayments;
        const debtToIncomeRatio = (debtPayments / income) * 100;
        const savingsRatio = (savings / income) * 100;
        const emergencyFundMonths = savings / expenses;

        // Calculate financial health score components
        let debtScore = 0;
        if (debtToIncomeRatio <= 15) debtScore = 40;
        else if (debtToIncomeRatio <= 30) debtScore = 30;
        else if (debtToIncomeRatio <= 43) debtScore = 20;
        else debtScore = 10;

        let emergencyScore = 0;
        if (emergencyFundMonths >= 6) emergencyScore = 30;
        else if (emergencyFundMonths >= 3) emergencyScore = 20;
        else if (emergencyFundMonths >= 1) emergencyScore = 10;

        let disposableScore = 0;
        const disposableIncomeRatio = (disposableIncome / income) * 100;
        if (disposableIncomeRatio >= 20) disposableScore = 30;
        else if (disposableIncomeRatio >= 10) disposableScore = 20;
        else if (disposableIncomeRatio > 0) disposableScore = 10;

        const healthScore = debtScore + emergencyScore + disposableScore;

        // Generate specific recommendations based on budget and loan data
        const recommendations = [];

        if (debtToIncomeRatio > 43) {
            recommendations.push("Your debt payments are too high. Consider debt consolidation or refinancing your loans.");
        }

        if (emergencyFundMonths < 3) {
            const targetSavings = expenses * 3;
            recommendations.push(`Build emergency fund to $${targetSavings.toFixed(2)} (3 months of expenses) before investing.`);
        }

        // Budget-specific recommendations
        if (budgetData?.expenses) {
            const highestExpenseCategory = Object.entries(budgetData.categoryTotals || {})
                .sort(([,a], [,b]) => b - a)[0];
            if (highestExpenseCategory) {
                recommendations.push(`Consider reducing spending in ${highestExpenseCategory[0]} category to increase investment capacity.`);
            }
        }

        // Loan-specific recommendations
        if (loanData?.loans) {
            const highInterestLoans = loanData.loans.filter(loan => loan.interestRate > 7);
            if (highInterestLoans.length > 0) {
                recommendations.push("Consider paying off high-interest loans before major investments.");
            }
        }

        // Investment recommendations based on score
        if (healthScore >= 70) {
            recommendations.push("You're in a good position to start investing. Consider a diversified portfolio with:");
            recommendations.push("- 60% in low-cost index funds");
            recommendations.push("- 30% in bonds");
            recommendations.push("- 10% in cash or cash equivalents");
        }

        // Prepare data for radar chart
        const radarData = [
            {
                metric: 'Debt Management',
                score: (debtScore / 40) * 100,
                fullMark: 100,
            },
            {
                metric: 'Emergency Fund',
                score: (emergencyScore / 30) * 100,
                fullMark: 100,
            },
            {
                metric: 'Disposable Income',
                score: (disposableScore / 30) * 100,
                fullMark: 100,
            },
        ];

        // Prepare data for cash flow analysis
        const expenseData = [
            { category: 'Income', amount: income },
            { category: 'Expenses', amount: expenses },
            { category: 'Debt Payments', amount: debtPayments },
            { category: 'Disposable', amount: disposableIncome },
        ];

        setAnalysis({
            healthScore,
            debtToIncomeRatio,
            emergencyFundMonths,
            disposableIncomeRatio,
            recommendations,
            radarData,
            expenseData
        });
    };

    // Trigger analysis whenever budget or loan data changes
    useEffect(() => {
        if (budgetData || loanData) {
            calculateFinancialHealth();
        }
    }, [budgetData, loanData]);

    return (
        <div className={styles.fullWidthContainer}>
            <div className={styles.contentWrapper}>
                <h2 className={styles.title}>Investment Readiness Analyzer</h2>

                {analysis && (
                    <div className={styles.results}>
                        <div className={styles.scoreAndMetrics}>
                            <div className={styles.scoreCard}>
                                <h3>Financial Health Score</h3>
                                <div className={styles.score}>
                                    {analysis.healthScore}
                                    <span>/100</span>
                                </div>
                            </div>

                            <div className={styles.metrics}>
                                <div className={styles.metric}>
                                    <label>Debt-to-Income Ratio:</label>
                                    <span>{analysis.debtToIncomeRatio.toFixed(1)}%</span>
                                </div>
                                <div className={styles.metric}>
                                    <label>Emergency Fund:</label>
                                    <span>{analysis.emergencyFundMonths.toFixed(1)} months</span>
                                </div>
                                <div className={styles.metric}>
                                    <label>Disposable Income Ratio:</label>
                                    <span>{analysis.disposableIncomeRatio.toFixed(1)}%</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.chartsContainer}>
                            <div className={styles.chartWrapper}>
                                <h3>Financial Health Breakdown</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <RadarChart data={analysis.radarData}>
                                        <PolarGrid />
                                        <PolarAngleAxis dataKey="metric" />
                                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                        <Radar
                                            name="Score"
                                            dataKey="score"
                                            stroke="#4299e1"
                                            fill="#4299e1"
                                            fillOpacity={0.6}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className={styles.chartWrapper}>
                                <h3>Monthly Cash Flow Analysis</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={analysis.expenseData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="category" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="amount"
                                            stroke="#4299e1"
                                            strokeWidth={2}
                                            dot={{ fill: '#4299e1' }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className={styles.recommendations}>
                            <h3>Recommendations</h3>
                            <ul>
                                {analysis.recommendations.map((rec, index) => (
                                    <li key={index}>{rec}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InvestmentAdvisor;