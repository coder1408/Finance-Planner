import React, { useState } from "react";
import styles from "../assets/styles/faq/FAQ.css"; // Assuming you want to keep the CSS in a separate file

const FAQ = () => {
  const [openQuestion, setOpenQuestion] = useState(null);

  const toggleQuestion = (questionIndex) => {
    setOpenQuestion(openQuestion === questionIndex ? null : questionIndex);
  };

  return (
    <div className="body">
        <h1 className="faq-title">
            FAQ's
        </h1>
            <div className="faq-container">
            <h2>Frequently Asked Questions</h2>

            {/* Question 1 */}
            <div className="faq-item">
                <div className="faq-question" onClick={() => toggleQuestion(1)}>
                <span>How can I start budgeting effectively?</span>
                <span className="arrow">{openQuestion === 1 ? "▲" : "▼"}</span>
                </div>
                {openQuestion === 1 && (
                        <div className={`faq-answer ${openQuestion === 1 ? 'open' : ''}`}>
                            <p>
                            To budget effectively, start by tracking your income and expenses.
                            Identify essential expenses like rent, groceries, and utilities, and
                            set realistic goals for savings. You can use budgeting tools like
                            spreadsheets or apps to help manage your finances.
                            </p>
                        </div>
                    )}
            </div>

            {/* Question 2 */}
            <div className="faq-item">
                <div className="faq-question" onClick={() => toggleQuestion(2)}>
                <span>What are some good ways to save for retirement?</span>
                <span className="arrow">{openQuestion === 2 ? "▲" : "▼"}</span>
                </div>
                {openQuestion === 2 && (
                <div className={`faq-answer ${openQuestion === 2 ? 'open' : ''}`}>
                    <p>
                    Start saving for retirement by contributing to a 401(k) or an IRA.
                    Many employers offer a matching contribution, which is essentially
                    free money. You should also diversify your investments and adjust
                    your portfolio based on your retirement timeline.
                    </p>
                </div>
                )}
            </div>

            {/* Question 3 */}
            <div className="faq-item">
                <div className="faq-question" onClick={() => toggleQuestion(3)}>
                <span>How can I improve my credit score?</span>
                <span className="arrow">{openQuestion === 3 ? "▲" : "▼"}</span>
                </div>
                {openQuestion === 3 && (
                <div className={`faq-answer ${openQuestion === 3 ? 'open' : ''}`}>
                    <p>
                    Improving your credit score involves paying bills on time, keeping
                    your credit utilization low, and avoiding opening too many new
                    accounts. Regularly checking your credit report for errors can
                    also help improve your score over time.
                    </p>
                </div>
                )}
            </div>

            {/* Form for asking more questions */}
            <div className="faq-form">
                <h3>Have more questions? Ask below!</h3>
                <form>
                <textarea
                    className="question-input"
                    placeholder="Type your question here..."
                    rows="5"
                ></textarea>
                <button type="submit" className="submit-button">Submit</button>
                </form>
            </div>
            </div>
    </div>
  );
};

export default FAQ;