const { query } = require('../config/database');
const { hashPassword, comparePassword } = require('../utils/password');
const jwt = require('jsonwebtoken');

/**
 * Register a new user
 */
const register = async (req, res, next) => {
    try {
        const { email, password, role = 'customer' } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                error: true,
                message: 'Email and password are required'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                error: true,
                message: 'Invalid email format'
            });
        }

        // Validate password length
        if (password.length < 8) {
            return res.status(400).json({
                error: true,
                message: 'Password must be at least 8 characters'
            });
        }

        // Check if user already exists
        const existingUser = await query(
            'SELECT id FROM users WHERE email = $1',
            [email.toLowerCase()]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                error: true,
                message: 'Email already registered'
            });
        }

        // Hash password
        const passwordHash = await hashPassword(password);

        // Create user
        const result = await query(
            `INSERT INTO users (email, password_hash, role) 
             VALUES ($1, $2, $3) 
             RETURNING id, email, role, created_at`,
            [email.toLowerCase(), passwordHash, role]
        );

        const user = result.rows[0];

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user.id, 
                email: user.email, 
                role: user.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            },
            token
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Login user
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                error: true,
                message: 'Email and password are required'
            });
        }

        // Find user
        const result = await query(
            'SELECT id, email, password_hash, role FROM users WHERE email = $1',
            [email.toLowerCase()]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                error: true,
                message: 'Invalid email or password'
            });
        }

        const user = result.rows[0];

        // Verify password
        const isValid = await comparePassword(password, user.password_hash);

        if (!isValid) {
            return res.status(401).json({
                error: true,
                message: 'Invalid email or password'
            });
        }

        // Generate token
        const token = jwt.sign(
            { 
                userId: user.id, 
                email: user.email, 
                role: user.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            },
            token
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Get current user (verify token)
 */
const getCurrentUser = async (req, res, next) => {
    try {
        // req.user is set by authenticateToken middleware
        const userId = req.user.userId;

        const result = await query(
            'SELECT id, email, role, created_at FROM users WHERE id = $1',
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: true,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user: result.rows[0]
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    getCurrentUser
};