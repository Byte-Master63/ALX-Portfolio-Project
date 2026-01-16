const express = require('express');
const router = express.Router();
const {
    register,
    login,
    getProfile,
    updateProfile,
    deleteAccount,
    verifyToken
} = require('../controllers/auth');
const { auth } = require('../middleware/auth');
const { 
    validateRegistrationMiddleware, 
    validateLoginMiddleware,
    validateProfileUpdateMiddleware
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
 * @route   PUT /api/auth/profile
 * @desc    Update user profile (name, password)
 * @access  Private (requires token)
 */
router.put('/profile', auth, validateProfileUpdateMiddleware, asyncHandler(updateProfile));

/**
 * @route   DELETE /api/auth/profile
 * @desc    Delete user account
 * @access  Private (requires token)
 */
router.delete('/profile', auth, asyncHandler(deleteAccount));

/**
 * @route   GET /api/auth/verify
 * @desc    Verify if token is valid
 * @access  Private (requires token)
 */
router.get('/verify', auth, asyncHandler(verifyToken));

module.exports = router;
