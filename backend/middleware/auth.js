// middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User"); 

const authMiddleware = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Get token from header

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    req.user = await User.findById(decoded.id); 
    next();
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};

module.exports = authMiddleware;
