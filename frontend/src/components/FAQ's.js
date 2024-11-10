import React, { useState, useRef } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import '../assets/styles/faq/FAQ.css';

const FAQ = () => {
  const [openQuestion, setOpenQuestion] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef(null);

  const toggleQuestion = (questionIndex) => {
    setOpenQuestion(openQuestion === questionIndex ? null : questionIndex);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    formRef.current.reset();
  };

  const faqData = [
    {
      question: "How can I start budgeting effectively?",
      answer: "To budget effectively, start by tracking your income and expenses for at least a month. Use the 50/30/20 rule: allocate 50% of your income to needs (rent, utilities, groceries), 30% to wants (entertainment, dining out), and 20% to savings and debt repayment. Consider using budgeting apps like Mint or YNAB to automate the tracking process. Review and adjust your budget regularly to ensure it remains realistic and aligned with your financial goals.",
      category: "Budgeting"
    },
    {
      question: "What are some good ways to save for retirement?",
      answer: "Start saving for retirement early through multiple channels: 1) Maximize your employer's 401(k) match if available, 2) Open a Roth IRA for tax-free growth, 3) Consider Health Savings Accounts (HSAs) for tax-advantaged medical savings. Aim to save 15-20% of your gross income for retirement. Diversify your investments across stocks, bonds, and other assets based on your age and risk tolerance. Regular rebalancing of your portfolio helps maintain your desired asset allocation.",
      category: "Retirement"
    },
    {
      question: "How can I improve my credit score?",
      answer: "Improve your credit score by focusing on these key factors: 1) Payment History (35%) - Always pay bills on time, 2) Credit Utilization (30%) - Keep credit card balances below 30% of limits, 3) Length of Credit History (15%) - Keep old accounts open, 4) Credit Mix (10%) - Maintain a diverse mix of credit types, 5) New Credit (10%) - Limit new credit applications. Check your credit report regularly for errors and dispute any inaccuracies promptly.",
      category: "Credit"
    },
    {
      question: "What's the best way to pay off debt?",
      answer: "There are two popular debt repayment strategies: The Avalanche Method (paying off highest-interest debt first while making minimum payments on others) and the Snowball Method (paying off smallest debts first for psychological wins). Create a list of all debts with their interest rates and balances. Consider debt consolidation if you qualify for a lower interest rate. Cut unnecessary expenses and put extra money toward debt repayment. Always make at least minimum payments on all debts to avoid penalties.",
      category: "Debt Management"
    },
    {
      question: "Should I buy or rent a home?",
      answer: "The decision to buy or rent depends on various factors: 1) Financial readiness (down payment, credit score, debt levels), 2) Length of stay (typically need 5+ years to offset buying costs), 3) Market conditions (price-to-rent ratio in your area), 4) Lifestyle flexibility needs, 5) Maintenance responsibilities and costs. Consider the total cost of homeownership including property taxes, insurance, maintenance, and HOA fees. Calculate the break-even point between buying and renting in your specific situation.",
      category: "Real Estate"
    },
    {
      question: "How much should I have in my emergency fund?",
      answer: "Most financial experts recommend keeping 3-6 months of essential living expenses in an easily accessible emergency fund. However, the exact amount depends on your situation: 1) Job stability and industry, 2) Number of income earners in household, 3) Health and insurance coverage, 4) Dependents' needs. Keep emergency funds in a high-yield savings account to earn interest while maintaining liquidity. Consider building a larger fund if you're self-employed or have variable income.",
      category: "Savings"
    },
    {
      question: "What are the best ways to invest for short-term goals?",
      answer: "For short-term goals (1-5 years), focus on preservation of capital over growth. Consider: 1) High-yield savings accounts for goals under 2 years, 2) Certificates of Deposit (CDs) for known timelines, 3) Short-term bond funds for 3-5 year goals, 4) Treasury securities for government-backed safety. Avoid stocks or aggressive investments for short-term goals due to market volatility. Ladder CDs or bonds to maintain some liquidity while maximizing returns.",
      category: "Investing"
    },
    {
      question: "How should I prepare financially for having a baby?",
      answer: "Prepare for a baby by: 1) Reviewing health insurance and understanding coverage, 2) Building a baby emergency fund for unexpected costs, 3) Estimating ongoing expenses (diapers, childcare, etc.), 4) Understanding parental leave policies and planning for income changes, 5) Starting a college savings fund (529 plan), 6) Updating life insurance and estate planning documents. Create a new budget that includes baby-related expenses and try living on it before the baby arrives.",
      category: "Family Planning"
    },
    {
      question: "What insurance policies do I really need?",
      answer: "Essential insurance policies include: 1) Health insurance for medical care, 2) Auto insurance if you own a vehicle, 3) Homeowners/Renters insurance for property protection, 4) Life insurance if others depend on your income, 5) Disability insurance to protect your earning power. Consider additional coverage like umbrella insurance for extra liability protection or long-term care insurance as you age. Review policies annually and adjust coverage as your life circumstances change.",
      category: "Insurance"
    },
    {
      question: "How can I reduce my tax burden legally?",
      answer: "Reduce your tax burden through: 1) Maximizing retirement account contributions (401(k), IRA), 2) Using tax-advantaged accounts (HSA, 529 plans), 3) Harvesting investment losses to offset gains, 4) Claiming all eligible deductions and credits, 5) Timing income and deductions strategically, 6) Making charitable contributions efficiently. Consider working with a tax professional to develop a comprehensive tax strategy. Keep good records throughout the year to make tax time easier.",
      category: "Taxes"
    }
  ];

  return (
      <div className="faq-page">
        <div className="faq-header">
          <h1>Frequently Asked Questions</h1>
          <p className="faq-subtitle">Find answers to your financial planning questions</p>
        </div>

        <div className="faq-container">
          <div className="faq-list">
            {faqData.map((faq, index) => (
                <div
                    key={index}
                    className={`faq-item ${openQuestion === index ? 'active' : ''}`}
                >
                  <div className="faq-category">{faq.category}</div>
                  <div
                      className="faq-question"
                      onClick={() => toggleQuestion(index)}
                  >
                    <span>{faq.question}</span>
                    <span className="arrow">
                  {openQuestion === index ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </span>
                  </div>
                  <div className={`faq-answer ${openQuestion === index ? 'open' : ''}`}>
                    <p>{faq.answer}</p>
                  </div>
                </div>
            ))}
          </div>

          <div className="faq-form-container">
            <div className="form-header">
              <h2>Still have questions?</h2>
              <p>Submit your question below and our financial experts will get back to you within 24 hours.</p>
            </div>
            <form ref={formRef} onSubmit={handleSubmit} className="faq-form">
              <div className="form-group">
                <input
                    type="text"
                    placeholder="Your Name"
                    required
                    className="form-input"
                />
              </div>
              <div className="form-group">
                <input
                    type="email"
                    placeholder="Your Email"
                    required
                    className="form-input"
                />
              </div>
              <div className="form-group">
              <textarea
                  placeholder="Type your financial question here..."
                  required
                  className="form-textarea"
                  rows="4"
              />
              </div>
              <button
                  type="submit"
                  className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
                  disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Question'}
              </button>
            </form>
          </div>
        </div>
      </div>
  );
};

export default FAQ;