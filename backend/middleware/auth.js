const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
    console.log("Request Headers:", req.headers); // Log headers

    const token = req.headers["authorization"]?.split(" ")[1];
    console.log("Received Token:", token);

    if (!token) {
        console.log("No token provided");
        return res.status(403).json({ error: "A token is required for authentication" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded);

        const user = await User.findById(decoded.userId);
        if (!user) {
            console.log("User not found");
            return res.status(401).json({ error: "User not found" });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error("Token error:", err.name, err.message); // Detailed error logging
        return res.status(401).json({ error: err.name === "TokenExpiredError" ? "Token expired" : "Invalid token" });
    }
};

module.exports = { authMiddleware };
