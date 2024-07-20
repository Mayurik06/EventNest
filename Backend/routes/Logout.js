const express = require('express');
const router = express.Router();
const { logoutUser } = require('../controllers/Logout');

// Logout route
router.post('/logout', logoutUser);

module.exports = router;