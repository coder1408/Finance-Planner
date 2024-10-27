import React from 'react';
import styles from "../assets/styles/about/about.css"; // Import CSS module
import Icon from "../assets/images/logo.png";

const About = () => {
  return (
    <div className="bod">
        <div className="about-container">
        <img src={Icon} alt="icon" className= "icon" />
        <h1 className="about-title">About PrimaPlan Financials</h1>
        <p className="about-text">
            PrimaPlan Financials is your personal financial planner and tracker designed to help you make well-informed decisions regarding loans, budgeting, and expenses. With a user-friendly interface and a range of powerful tools, PrimaPlan Financials offers:
        </p>
        <ul className="about-list">
            <li><strong>Loan Insights:</strong> Detailed loan management features that empower you to make knowledgeable decisions about borrowing, repayment, and interest.</li>
            <li><strong>Budgeting Tools:</strong> Comprehensive expense and budgeting tools that help you track and manage your spending effectively.</li>
            <li><strong>Financial Guidance:</strong> Assistance in making smarter financial decisions, with insights to guide you toward better financial health.</li>
        </ul>
        <p className="about-text">
            PrimaPlan Financials is crafted to give you control over your finances with clarity and ease, providing a seamless experience to ensure your financial well-being.
        </p>
        </div>
    </div>
  );
};

export default About;
