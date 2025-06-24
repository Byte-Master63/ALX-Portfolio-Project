/**
 * @file routes/index.js
 * @description Combines all API route modules for easy inclusion in main server file.
 */

const express = require('express');
const router = express.Router();

// Subroutes
router.use('/auth', require('./auth'));
router.use('/transactions', require('./transactions'));
router.use('/categories', require('./categories'));
router.use('/budgets', require('./budgets'));

module.exports = router;

