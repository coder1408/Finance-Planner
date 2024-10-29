import React, { useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styles from '../assets/styles/Onboarding/FinancialOnboarding.module.css';

const questions = [
    {
        id: 1,
        question: "What percentage of your monthly income do you save?",
        options: [
            "0-5%",
            "5-10%",
            "10-20%",
            "Over 20%"
        ]
    },
    {
        id: 2,
        question: "What is your average monthly income?",
        options: [
            "Under ₹20,000",
            "₹20,000 - ₹50,000",
            "₹50,000 - ₹1,00,000",
            "Over ₹1,00,000"
        ]
    },
    {
        id: 3,
        question: "How much do you typically spend on monthly essentials (housing, groceries, utilities)?",
        options: [
            "Under ₹10,000",
            "₹10,000 - ₹20,000",
            "₹20,000 - ₹30,000",
            "Over ₹30,000"
        ]
    },
    {
        id: 4,
        question: "What percentage of your income is allocated to debt repayments?",
        options: [
            "None",
            "1-10%",
            "10-20%",
            "Over 20%"
        ]
    },
    {
        id: 5,
        question: "How much do you invest monthly?",
        options: [
            "None",
            "Under ₹5,000",
            "₹5,000 - ₹15,000",
            "Over ₹15,000"
        ]
    },
    {
        id: 6,
        question: "How often do you exceed your monthly budget?",
        options: [
            "Never",
            "Rarely (1-2 times per year)",
            "Occasionally (every few months)",
            "Frequently"
        ]
    },
    {
        id: 7,
        question: "How much discretionary spending (entertainment, dining out) do you typically have monthly?",
        options: [
            "Under ₹1,000",
            "₹1,000 - ₹3,000",
            "₹3,000 - ₹5,000",
            "Over ₹5,000"
        ]
    }
];

const FinancialOnboarding = ({ token }) => { // Accept token as a prop
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(curr => curr + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(curr => curr - 1);
        }
    };

    const handleOptionSelect = (option) => {
        setAnswers((prev) => ({
            ...prev,
            [questions[currentQuestion].id]: option
        }));
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch('/api/users/Onboarding', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Ensure token is available and correctly formatted
                },
                body: JSON.stringify({ answers }),
            });
            console.log('Submitting answers:', answers);
            const data = await response.json();
            console.log(data.message); // Show success message
            // Optionally reset the form or navigate away
        } catch (error) {
            console.error('Error submitting answers:', error);
        }
    };
    

    const renderOptions = () => (
        <div className={styles.optionsContainer}>
            {questions[currentQuestion].options.map((option, index) => (
                <button
                    key={index}
                    onClick={() => handleOptionSelect(option)}
                    className={`${styles.option} ${
                        answers[questions[currentQuestion].id] === option ? styles.optionSelected : ''
                    }`}
                >
                    {option}
                </button>
            ))}
        </div>
    );

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <TransitionGroup>
                    <CSSTransition
                        key={currentQuestion}
                        timeout={500}
                        classNames={{
                            enter: styles.fadeEnter,
                            enterActive: styles.fadeEnterActive,
                            exit: styles.fadeExit,
                            exitActive: styles.fadeExitActive,
                        }}
                    >
                        <div>
                            <h2 className={styles.question}>
                                {questions[currentQuestion].question}
                            </h2>
                            {renderOptions()}
                        </div>
                    </CSSTransition>
                </TransitionGroup>

                <div className={styles.navigation}>
                    <button
                        onClick={handlePrevious}
                        disabled={currentQuestion === 0}
                        className={`${styles.navButton} ${styles.prevButton}`}
                    >
                        ← Previous
                    </button>

                    {currentQuestion < questions.length - 1 ? (
                        <button
                            onClick={handleNext}
                            className={`${styles.navButton} ${styles.nextButton}`}
                        >
                            Next →
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            className={`${styles.navButton} ${styles.submitButton}`}
                        >
                            Submit
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FinancialOnboarding;
