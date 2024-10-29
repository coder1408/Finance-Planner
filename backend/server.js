const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const loanRoutes = require('./routes/loanRoutes');
const userRoutes = require('./routes/userRoutes');
const budgetRoutes = require("./routes/budgetRoutes");
require('dotenv').config();
console.log(process.env.MONGO_URI);


/*const MONGO_URI = "mongodb+srv://shrutisramdurg:dbPassword@cluster0.dby4l.mongodb.net/FinancePlanner?retryWrites=true&w=majority&appName=Cluster0";
console.log("MONGO URI:",MONGO_URI);*/


const app = express();
app.use(express.json()); // Middleware to parse JSON

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log("DB connection error", err));

// Routes
app.use("/api/auth", authRoutes);
app.use('/api/loans', loanRoutes);
app.use("/api/users", userRoutes);
app.use("/api/budget", budgetRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
