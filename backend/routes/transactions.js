const express = require('express');
const router = express.Router();
const {
    getTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction
} = require('../controllers/transactions');
const { validateTransactionMiddleware } = require('../middleware/validators');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * @route   GET /api/transactions
 * @desc    Get all transactions with optional filtering
 * @query   type, category, startDate, endDate, limit, offset
 * @access  Private (requires auth)
 */
router.get('/', asyncHandler(getTransactions));

/**
 * @route   GET /api/transactions/:id
 * @desc    Get a single transaction by ID
 * @access  Private (requires auth)
 */
router.get('/:id', asyncHandler(getTransactionById));

/**
 * @route   POST /api/transactions
 * @desc    Create a new transaction
 * @access  Private (requires auth)
 */
router.post('/', validateTransactionMiddleware, asyncHandler(createTransaction));

/**
 * @route   PUT /api/transactions/:id
 * @desc    Update an existing transaction
 * @access  Private (requires auth)
 */
router.put('/:id', validateTransactionMiddleware, asyncHandler(updateTransaction));

/**
 * @route   DELETE /api/transactions/:id
 * @desc    Delete a transaction
 * @access  Private (requires auth)
 */
router.delete('/:id', asyncHandler(deleteTransaction));

module.exports = router;