const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const transactions = require('./transactions');
const budgets = require('./budgets');
const summary = require('./summary');
const authRoutes = require('./auth');

// Public routes (no authentication required)
// Add auth routes here when implemented
// router.use('/auth', authRoutes);

// API information endpoint
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Money Mate API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            transactions: '/api/transactions',
            budgets: '/api/budgets',
            summary: '/api/summary'
        },
        documentation: 'See README.md for API documentation'
    });
});

router.use('/auth', authRoutes);
// Protected routes (authentication required)
router.use(auth);

router.use('/transactions', transactions);
router.use('/budgets', budgets);
router.use('/summary', summary);

module.exports = router;