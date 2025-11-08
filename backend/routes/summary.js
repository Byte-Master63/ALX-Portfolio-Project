const express = require('express');
const router = express.Router();
const { 
    getSummary,
    getMonthlySummary,
    getCategorySummary
} = require('../controllers/summary');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * @route   GET /api/summary
 * @desc    Get overall financial summary
 * @query   startDate, endDate (optional date range in YYYY-MM-DD format)
 * @access  Private (requires auth)
 */
router.get('/', asyncHandler(getSummary));

/**
 * @route   GET /api/summary/monthly
 * @desc    Get monthly breakdown of income and expenses
 * @query   year (optional, defaults to current year)
 * @access  Private (requires auth)
 */
router.get('/monthly', asyncHandler(getMonthlySummary));

/**
 * @route   GET /api/summary/category
 * @desc    Get detailed breakdown by category
 * @query   type (income/expense), startDate, endDate (optional)
 * @access  Private (requires auth)
 */
router.get('/category', asyncHandler(getCategorySummary));

module.exports = router;