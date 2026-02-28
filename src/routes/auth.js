const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
    register,
    login,
    getCurrentUser
} = require('../controllers/authController');

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/me (protected route - requires token)
router.get('/me', authenticateToken, getCurrentUser);

module.exports = router;