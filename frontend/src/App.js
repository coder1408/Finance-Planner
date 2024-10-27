import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./components/UserContext"; // Import the UserProvider
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import Dashboard from "./components/Dashboard";
import Homepage from "./components/Homepage";
import ExpenseTracker from "./components/ExpenseTracker"; // Keep this import if you're going to use it
import Tracker from "./components/tracker"; // Keep this import if you're going to use it
import About from "./components/about";

const App = () => {
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
          <Route path="/tracker" element={<Tracker />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
