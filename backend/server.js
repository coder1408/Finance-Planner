const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const loanRoutes = require('./routes/loanRoutes');
const userRoutes = require('./routes/userRoutes');
const budgetRoutes = require("./routes/budgetRoutes");
const authMiddleware = require("./middleware/auth");
console.log(authMiddleware);
const Onboarding = require('./models/Onboarding');
const jwt = require('jsonwebtoken');
require('dotenv').config();
console.log(process.env.MONGO_URI);
console.log("JWT Secret:", process.env.JWT_SECRET);

/*const MONGO_URI = "mongodb+srv://shrutisramdurg:dbPassword@cluster0.dby4l.mongodb.net/FinancePlanner?retryWrites=true&w=majority&appName=Cluster0";
console.log("MONGO URI:",MONGO_URI);*/

const app = express();
app.use(express.json()); // Middleware to parse JSON

app.use(cors({
  origin: "http://localhost:3000",  // Allows requests from any origin
  methods: "GET,POST",
  allowedHeaders: "Content-Type,Authorization"
}));



mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log("DB connection error", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/loans", authMiddleware, loanRoutes);
app.use("/api/budget", authMiddleware, budgetRoutes);
app.use("/api/user", userRoutes);

// Onboarding Route
app.post('/api/onboarding', authMiddleware, async (req, res) => {
  const { answers } = req.body;
  const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;

  console.log('Received Token:', token); 

  if (!token) {
      return res.status(401).json({ message: 'No token provided.' });
  }

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); 
      const userId = decoded.userId; 

      // Create a new onboarding record
      const onboarding = new Onboarding({
          userId,
          answers,
      });

      await onboarding.save();
      res.status(201).json({ message: 'Onboarding answers submitted successfully.' });
  } catch (error) {
      console.error('Error submitting onboarding answers:', error);
      res.status(500).json({ message: 'Error submitting answers' });
  }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
