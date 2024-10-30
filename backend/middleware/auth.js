const jwt = require("jsonwebtoken");
const User = require("../models/User"); 

const authMiddleware = async (req, res, next) => {
    console.log("Request Headers:", req.headers); // Log headers for debugging
    
    const token = req.headers["authorization"]?.split(" ")[1];
    console.log("Received Token:", token); // For debugging

    if (!token) {
        console.log("No token provided");
        return res.status(403).json({ error: "A token is required for authentication" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded); // Log decoded token for debugging

        const user = await User.findById(decoded.userId); // Confirm user ID field matches token structure

        if (!user) {
            console.log("User not found");
            return res.status(401).json({ error: "User not found" });
        }

        req.user = user; // Attach user to request object
        next(); // Pass control to next middleware or route handler
    } catch (err) {
        console.error("Token error:", err); // Log error for debugging
        return res.status(401).json({ error: "Invalid token" });
    }
};


module.exports = authMiddleware;
