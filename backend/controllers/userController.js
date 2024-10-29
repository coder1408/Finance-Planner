const User = require('../models/User');
const Answer = require('../models/Answer');

// Function to fetch user profile
const getUserProfile = async (req, res) => {
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

// Function to update user profile
const updateUserProfile = async (req, res) => {
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

// Financial Onboarding Submission
const submitFinancialOnboarding = async (req, res) => {
    try {
        const userId = req.user.id;
        const { answers } = req.body;

        const newAnswer = new Answer({
            userId,
            answers,
            submittedAt: new Date()
        });

        await newAnswer.save();
        console.log(newAnswer);
        res.status(200).json({ message: 'Financial onboarding answers submitted successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to submit financial onboarding answers" });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    submitFinancialOnboarding
};
