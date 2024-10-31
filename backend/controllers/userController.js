const User = require('../models/User');
const Answer = require('../models/Answer');
const  { authMiddleware }= require('../middleware/auth');



exports.getUserProfile = async (req, res) => {
    console.log("GET user profile hit");
    console.log("User ID:", req.user.id);
    try {
        const userId = req.user.id; 
        const userProfile = await User.findById(userId)
            .select("-password")
            .populate("expenses")
            .populate("budgets")
            .populate("loans");

        if (!userProfile) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(userProfile);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch user profile" });
    }
};


exports.updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const updatedProfileData = req.body;


        const updatedProfile = await User.findByIdAndUpdate(
            userId,
            updatedProfileData,
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedProfile) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(updatedProfile);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update profile" });
    }
};



