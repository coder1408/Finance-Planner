const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const { getUserProfile, updateUserProfile } = require('../controllers/userController');

const router = express.Router();


router.get("/profile", getUserProfile); // Apply middleware here
router.put("/profile", updateUserProfile)

module.exports = router;
