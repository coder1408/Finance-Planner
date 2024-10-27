import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import Dashboard from "./components/Dashboard";
import Homepage from "./components/Homepage";
import ExpenseTracker from "./components/ExpenseTracker";
import Tracker from "./components/tracker";
import About from "./components/about";
import FAQ from "./components/FAQ's";
import BudgetAllocation from "./components/Budget";
import Invoice from "./components/Invoice"; // Import the Invoice component
import Profile from "./components/Profile"; // Import the Profile component
import { UserProvider } from "./components/UserContext";

const App = () => {
  // Example data for the Invoice component
  const user = {
    name: "John Doe",
    email: "john@example.com",
    phone: "123-456-7890",
  };

  const transactions = [
    { category: "Food", amount: 200 },
    { category: "Transportation", amount: 50 },
    { category: "Entertainment", amount: 100 },
  ];

  const income = [
    { source: "Salary", amount: 1500 },
    { source: "Freelancing", amount: 300 },
  ];

  const savings = 250; // Total savings added

  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/expense-tracker" element={<ExpenseTracker />} />
          <Route path="/FAQ's" element={<FAQ />} />
          <Route path="/Budget" element={<BudgetAllocation />} />
          <Route path="/tracker" element={<Tracker />} />
          <Route
            path="/invoice"
            element={
              <Invoice
                user={user}
                transactions={transactions}
                income={income}
                savings={savings}
                billingPeriod="September 1 - September 30"
              />
            }
          />
          <Route path="/profile" element={<Profile />} />{" "}
          {/* Add profile route here */}
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;

