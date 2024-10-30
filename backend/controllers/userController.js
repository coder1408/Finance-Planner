const User = require('../models/User');
const Answer = require('../models/Answer');

// Function to fetch user profile
exports.getUserProfile = async (req, res) => {
    console.log("GET user profile hit");
    try {
        const userId = req.user.id; // Ensure req.user is populated by the auth middleware
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

// Function to update user profile
exports.updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const updatedProfileData = req.body;

        // Optionally validate updatedProfileData here

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



