const express = require('express');
const router = express.Router();
const {
    getBudgets,
    createOrUpdateBudget
} = require('../controllers/budgets');

router.get('/', getBudgets);
router.post('/', createOrUpdateBudget);

module.exports = router;
