const express = require('express');
const router = express.Router();
const UserController = require('../controllers/Login');

// Route for user login
router.post('/login', UserController.loginUser);

module.exports = router;