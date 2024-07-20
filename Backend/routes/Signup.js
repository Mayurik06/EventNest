const express = require('express');
const router = express.Router();
const UserController = require('../controllers/Signup');

// Route for user registration
router.post('/register', UserController.registerUser);

module.exports = router;