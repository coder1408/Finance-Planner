const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const { getUserProfile, updateUserProfile } = require('../controllers/userController');

const router = express.Router();


router.use(authMiddleware); 


router.get("/user/profile", getUserProfile);


router.put("/user/profile", updateUserProfile);

module.exports = router;
