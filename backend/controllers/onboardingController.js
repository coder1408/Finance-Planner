const Onboarding = require('../models/Onboarding');
const User = require('../models/User'); // You'll need your User model

const submitOnboarding = async (req, res) => {
    try {
        const { answers } = req.body;
        const userId = req.user.id; // This comes from your auth middleware

        // Check if user has already completed onboarding
        const existingOnboarding = await Onboarding.findOne({ userId });

        if (existingOnboarding) {
            // Update existing onboarding data
            existingOnboarding.answers = answers;
            await existingOnboarding.save();
        } else {
            // Create new onboarding entry
            await Onboarding.create({
                userId,
                answers
            });
        }

        // Update user's onboarding status
        await User.findByIdAndUpdate(userId, {
            onboardingCompleted: true,
            // Add any other user profile updates based on onboarding answers
            // For example:
            monthlyIncome: answers[2], // Assuming question 2 is about monthly income
            monthlySavings: answers[1], // Assuming question 1 is about savings
        });

        res.status(200).json({
            success: true,
            message: 'Onboarding completed successfully'
        });

    } catch (error) {
        console.error('Onboarding submission error:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting onboarding data',
            error: error.message
        });
    }
};

const getOnboardingData = async (req, res) => {
    try {
        const userId = req.user.id;

        const onboardingData = await Onboarding.findOne({ userId });

        if (!onboardingData) {
            return res.status(404).json({
                success: false,
                message: 'No onboarding data found for this user'
            });
        }

        res.status(200).json({
            success: true,
            data: onboardingData
        });

    } catch (error) {
        console.error('Error fetching onboarding data:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching onboarding data',
            error: error.message
        });
    }
};

module.exports = {
    submitOnboarding,
    getOnboardingData
};