import React, { useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styles from '../assets/styles/Onboarding/FinancialOnboarding.module.css';
import {useNavigate} from "react-router-dom";
import { useUser } from './UserContext';

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

const FinancialOnboarding = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [submissionMessage, setSubmissionMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { updateUserAfterOnboarding } = useUser();

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion((prev) => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion((prev) => prev - 1);
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
            setIsSubmitting(true);
            const response = await fetch('/api/onboarding', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ answers }),
            });

            const data = await response.json();
            if (response.ok) {
                // Update the user context with the new data
                const updated = await updateUserAfterOnboarding(answers);
                if (updated) {
                    setSubmissionMessage("Your answers have been submitted successfully!");
                    navigate('/dashboard');
                } else {
                    setSubmissionMessage("Profile updated but there was an error loading your data.");
                }
            } else {
                setSubmissionMessage(data.message || "Failed to submit answers.");
            }
        } catch (error) {
            console.error('Error submitting answers:', error);
            setSubmissionMessage("An error occurred while submitting your answers.");
        } finally {
            setIsSubmitting(false);
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
                        disabled={currentQuestion === 0 || isSubmitting}
                        className={`${styles.navButton} ${styles.prevButton}`}
                    >
                        ← Previous
                    </button>

                    {currentQuestion < questions.length - 1 ? (
                        <button
                            onClick={handleNext}
                            disabled={isSubmitting}
                            className={`${styles.navButton} ${styles.nextButton}`}
                        >
                            Next →
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className={`${styles.navButton} ${styles.submitButton}`}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </button>
                    )}
                </div>

                {submissionMessage && (
                    <div className={styles.submissionMessage}>
                        {submissionMessage}
                    </div>
                )}
            </div>
        </div>
    );
};


export default FinancialOnboarding;
