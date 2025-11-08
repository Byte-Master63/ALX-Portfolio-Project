const express = require('express');
const router = express.Router();
const {
    getBudgets,
    getBudgetById,
    createBudget,
    updateBudget,
    deleteBudget
} = require('../controllers/budgets');
const { validateBudgetMiddleware } = require('../middleware/validators');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * @route   GET /api/budgets
 * @desc    Get all budgets
 * @access  Private (requires auth)
 */
router.get('/', asyncHandler(getBudgets));

/**
 * @route   GET /api/budgets/:id
 * @desc    Get a single budget by ID
 * @access  Private (requires auth)
 */
router.get('/:id', asyncHandler(getBudgetById));

/**
 * @route   POST /api/budgets
 * @desc    Create a new budget
 * @access  Private (requires auth)
 */
router.post('/', validateBudgetMiddleware, asyncHandler(createBudget));

/**
 * @route   PUT /api/budgets/:id
 * @desc    Update an existing budget
 * @access  Private (requires auth)
 */
router.put('/:id', validateBudgetMiddleware, asyncHandler(updateBudget));

/**
 * @route   DELETE /api/budgets/:id
 * @desc    Delete a budget
 * @access  Private (requires auth)
 */
router.delete('/:id', asyncHandler(deleteBudget));

module.exports = router;