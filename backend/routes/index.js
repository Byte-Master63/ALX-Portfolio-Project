const express = require('express');
const router = express.Router();
const transactions = require('./transactions');
const budgets = require('./budgets');
const summary = require('./summary');

router.use('/transactions', transactions);
router.use('/budgets', budgets);
router.use('/summary', summary);

module.exports = router;
