const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { submitOnboarding, getOnboardingData } = require('../controllers/onboardingController');

const router = express.Router();

// Submit onboarding data
router.post('/', authMiddleware, submitOnboarding);

// Get onboarding data for a user (optional, but useful for future features)
router.get('/', authMiddleware, getOnboardingData);

module.exports = router;