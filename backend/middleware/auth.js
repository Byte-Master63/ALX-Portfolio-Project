/**
 * @file middleware/auth.js
 * @description Middleware to validate JWT token and authorize user.
 */

const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('./errorHandler');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = process.env.JWT_EXPIRY || '24h';

// Validate JWT_SECRET exists
if (!JWT_SECRET) {
    console.error('❌ FATAL: JWT_SECRET is not defined in environment variables');
    console.error('Please add JWT_SECRET to your .env file');
    process.exit(1);
}

/**
 * Middleware to authenticate JWT token.
 * Validates token from Authorization header and attaches user data to request.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
function auth(req, res, next) {
    try {
        const authHeader = req.header('Authorization');

        // Check if Authorization header exists
        if (!authHeader) {
            throw new UnauthorizedError('No authorization header provided');
        }

        // Check if it's a Bearer token
        if (!authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedError('Invalid authorization format. Use: Bearer <token>');
        }

        // Extract token
        const token = authHeader.split(' ')[1];

        if (!token) {
            throw new UnauthorizedError('No token provided');
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Check token expiration explicitly
        if (decoded.exp && decoded.exp < Date.now() / 1000) {
            throw new UnauthorizedError('Token has expired');
        }

        // Attach user data to request
        req.user = decoded;
        req.userId = decoded.userId || decoded.id;
        
        next();
    } catch (err) {
        // Handle JWT specific errors
        if (err.name === 'JsonWebTokenError') {
            return next(new UnauthorizedError('Invalid token'));
        }
        if (err.name === 'TokenExpiredError') {
            return next(new UnauthorizedError('Token has expired'));
        }
        
        // Pass other errors to error handler
        next(err);
    }
}

/**
 * Optional auth middleware - doesn't fail if no token provided
 * Useful for endpoints that have different behavior for authenticated users
 */
function optionalAuth(req, res, next) {
    try {
        const authHeader = req.header('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next(); // Continue without auth
        }

        const token = authHeader.split(' ')[1];
        
        if (token) {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
            req.userId = decoded.userId || decoded.id;
        }
        
        next();
    } catch (err) {
        // Silently continue without auth if token is invalid
        next();
    }
}

/**
 * Generates a JWT token for a user
 * @param {Object} payload - User data to encode in token
 * @returns {string} JWT token
 */
function generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRY
    });
}

/**
 * Verifies and decodes a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        throw new UnauthorizedError('Invalid or expired token');
    }
}

module.exports = {
    auth,
    optionalAuth,
    generateToken,
    verifyToken,
    JWT_SECRET,
    JWT_EXPIRY
};
