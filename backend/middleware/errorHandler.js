/**
 * Handles 404 - Route not found errors
 */
function notFoundHandler(req, res) {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found`,
        error: 'Not Found'
    });
}

/**
 * Determines appropriate status code based on error type
 * @param {Error} err - Error object
 * @returns {number} HTTP status code
 */
function getStatusCode(err) {
    // Check if error has status code
    if (err.statusCode) return err.statusCode;
    if (err.status) return err.status;
    
    // Check error name/type
    if (err.name === 'ValidationError') return 400;
    if (err.name === 'UnauthorizedError') return 401;
    if (err.name === 'ForbiddenError') return 403;
    if (err.name === 'NotFoundError') return 404;
    if (err.name === 'ConflictError') return 409;
    
    // Check error message patterns
    if (err.message.includes('validation') || err.message.includes('invalid')) return 400;
    if (err.message.includes('not found')) return 404;
    if (err.message.includes('unauthorized') || err.message.includes('token')) return 401;
    
    // Default to 500 for unknown errors
    return 500;
}

/**
 * Main error handling middleware
 */
function errorHandler(err, req, res, next) {
    const statusCode = getStatusCode(err);
    
    // Log error with context
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('❌ ERROR OCCURRED:');
    console.error(`📍 Route: ${req.method} ${req.originalUrl}`);
    console.error(`⏰ Time: ${new Date().toISOString()}`);
    console.error(`📊 Status: ${statusCode}`);
    console.error(`💬 Message: ${err.message}`);
    
    if (process.env.NODE_ENV === 'development') {
        console.error(`📚 Stack: ${err.stack}`);
    }
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Send error response
    const errorResponse = {
        success: false,
        message: err.message || 'Internal server error',
        error: statusCode === 500 ? 'Internal Server Error' : err.name || 'Error'
    };
    
    // Include stack trace in development
    if (process.env.NODE_ENV === 'development') {
        errorResponse.stack = err.stack;
        errorResponse.details = err.details || null;
    }
    
    res.status(statusCode).json(errorResponse);
}

/**
 * Custom error classes for specific error types
 */
class ValidationError extends Error {
    constructor(message, details = null) {
        super(message);
        this.name = 'ValidationError';
        this.statusCode = 400;
        this.details = details;
    }
}

class NotFoundError extends Error {
    constructor(message = 'Resource not found') {
        super(message);
        this.name = 'NotFoundError';
        this.statusCode = 404;
    }
}

class UnauthorizedError extends Error {
    constructor(message = 'Unauthorized access') {
        super(message);
        this.name = 'UnauthorizedError';
        this.statusCode = 401;
    }
}

class ConflictError extends Error {
    constructor(message = 'Resource conflict') {
        super(message);
        this.name = 'ConflictError';
        this.statusCode = 409;
    }
}

/**
 * Async handler wrapper to catch errors in async route handlers
 */
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

module.exports = {
    errorHandler,
    notFoundHandler,
    asyncHandler,
    ValidationError,
    NotFoundError,
    UnauthorizedError,
    ConflictError
};