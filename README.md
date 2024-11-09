# AI-Powered Personal Finance Planner

Welcome to the AI-Powered Personal Finance Planner, a comprehensive solution designed to track, manage, and optimize your personal finances. Built using the MERN stack, this app provides tools to monitor budgets, track loans, and maintain an overview of your financial health. Whether you're looking to keep an eye on your day-to-day expenses or plan for the future, this finance planner can help make smarter financial decisions!

## Features

- Expense Tracking: Record and categorize your expenses to get a clear view of your spending habits.
- Budget Tracker: Set and monitor budgets for different spending categories to maintain financial discipline.
- Loan Tracker: Manage your loans and track repayment progress.
- User Authentication: Secure sign-up and login functionality, including a "Sign in with Google" option.
- Dashboard: A user-friendly dashboard with real-time insights, graphs, and summary statistics to visualize financial health.

## Tech Stack

- Frontend: React.js
- Backend: Node.js and Express.js
- Database: MongoDB
- Deployment: Server running locally, frontend deployed on Vercel

## Setup and Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd finance-planner
   ```

2. Install dependencies:
   - Backend:
     ```
     cd backend
     npm install
     ```
   - Frontend:
     ```
     cd ../frontend
     npm install
     ```

3. Environment Variables:
   - Create a `.env` file in the root of the backend directory and add your MongoDB URI, API keys, and other sensitive configurations.

4. Run the Application:
   - Start the backend server:
     ```
     cd backend
     npm start
     ```
   - Start the frontend:
     ```
     cd ../frontend
     npm run start
     ```

   The frontend should be accessible on Vercel, and the backend should run locally.

## Project Structure

```
.
├── backend               # Node.js and Express backend
├── frontend              # React.js frontend
└── README.md
```

### Backend
- /controllers - Contains API route logic.
- /models - Mongoose schemas for data storage in MongoDB.
- /routes - Endpoints for data access and manipulation.

### Frontend
- /components - Reusable UI components.
- /pages - Main pages (e.g., Dashboard, Loan Tracker, Budget Tracker).
- /assets - Static files and assets.
- /styles - CSS styles and theming.

## Usage

1. Create an Account: Sign up or log in to access your personal finance data.
2. Track Your Expenses: Enter your daily or monthly expenses in relevant categories.
3. Monitor Budget and Loans: Set budgets, monitor loan repayment, and receive updates on your financial progress.
4. View Insights: Access insights and monitor your financial health.

## Future Scope

- AI-Generated Recommendations: We plan to add AI-powered features in the future to analyze budget and loan data and provide recommendations for smarter financial decisions.
- Investment Recommendations: Suggestions based on your budget and loan data to determine whether you should consider specific investments.

## Contributing

We welcome contributions! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`feature-branch`).
3. Commit changes and submit a pull request.

## License

This project is licensed under the MIT License.

## Acknowledgments

Thanks to our team members – Shruti for backend and UI design, Aaditya for frontend and documentation, and Ishan for contributions to both frontend and backend – for their hard work and collaboration! 
