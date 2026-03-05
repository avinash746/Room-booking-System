const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', authController.register);

// POST /api/auth/login
router.post('/login', authController.login);

// GET /api/auth/profile  (protected)
router.get('/profile', authenticate, authController.getProfile);

module.exports = router;