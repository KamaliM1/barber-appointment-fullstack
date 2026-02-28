/**
 * Global error handler middleware
 * Catches all errors thrown within the application
 */

const errorHandler = (err, req, res, next) => {
    // Logs error for debugging
    console.error('Error occurred:', {
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        path: req.path,
        method: req.method
    });

    // Default error response
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json ({
        error: true,
        message: message,
        // Only includes stack trace in development
        ...(process.env.NODE_ENV === 'development' && {stack: err.stack})
    });
};

module.exports = errorHandler;