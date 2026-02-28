const jwt = require('jsonwebtoken');

/**
 * Verify JWT token
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            error: true,
            message: 'Access token required'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            // Token is invalid or expired
            return res.status(403).json({
                error: true,
                message: 'Invalid or expired token'
            });
        }

        // Attach user info to request object
        req.user = user;
        next();
    });
};

/**
 * Check if user is admin
 */
const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            error: true,
            message: 'Authentication required'
        });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({
            error: true,
            message: 'Admin access required'
        });
    }

    next();
};

/**
 * Check if user is customer or admin
 */
const requireCustomer = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            error: true,
            message: 'Authentication required'
        });
    }

    // Both customers and admins can access
    if (req.user.role !== 'customer' && req.user.role !== 'admin') {
        return res.status(403).json({
            error: true,
            message: 'Customer or admin access required'
        });
    }

    next();
};

module.exports = {
    authenticateToken,
    requireAdmin,
    requireCustomer
};