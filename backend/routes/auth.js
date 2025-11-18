const express = require('express');
const router = express.Router();
const {
    register,
    login,
    getProfile,
    verifyToken
} = require('../controllers/auth');
const { auth } = require('../middleware/auth');
const { 
    validateRegistrationMiddleware, 
    validateLoginMiddleware 
} = require('../middleware/validators');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', validateRegistrationMiddleware, asyncHandler(register));

/**
 * @route   POST /api/auth/login
 * @desc    Login user and get token
 * @access  Public
 */
router.post('/login', validateLoginMiddleware, asyncHandler(login));

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private (requires token)
 */
router.get('/profile', auth, asyncHandler(getProfile));

/**
 * @route   GET /api/auth/verify
 * @desc    Verify if token is valid
 * @access  Private (requires token)
 */
router.get('/verify', auth, asyncHandler(verifyToken));

module.exports = router;
