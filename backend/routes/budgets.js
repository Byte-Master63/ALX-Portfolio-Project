/**
 * @file routes/budgets.js
 * @description Handles user budget planning and tracking (CRUD).
 */

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// In-memory budgets store per user
const budgets = [];

/**
 * @route GET /api/budgets
 * @desc Get all budgets for authenticated user
 * @access Private
 */
router.get('/', auth, (req, res) => {
  const userBudgets = budgets.filter(b => b.userId === req.user.id);
  res.json(userBudgets);
});

/**
 * @route POST /api/budgets
 * @desc Create a new budget
 * @access Private
 */
router.post('/', auth, (req, res) => {
  const { name, amount, category, period } = req.body;

  if (!name || !amount || !category || !period) {
    return res.status(400).json({ message: 'Name, amount, category, and period are required' });
  }

  const newBudget = {
    id: Date.now().toString(),
    userId: req.user.id,
    name,
    amount,
    category,
    period, // e.g., monthly, weekly
  };

  budgets.push(newBudget);
  res.status(201).json(newBudget);
});

/**
 * @route PUT /api/budgets/:id
 * @desc Update a budget by ID
 * @access Private
 */
router.put('/:id', auth, (req, res) => {
  const { id } = req.params;
  const { name, amount, category, period } = req.body;

  const budget = budgets.find(b => b.id === id && b.userId === req.user.id);
  if (!budget) {
    return res.status(404).json({ message: 'Budget not found' });
  }

  if (name) budget.name = name;
  if (amount) budget.amount = amount;
  if (category) budget.category = category;
  if (period) budget.period = period;

  res.json(budget);
});

/**
 * @route DELETE /api/budgets/:id
 * @desc Delete a budget by ID
 * @access Private
 */
router.delete('/:id', auth, (req, res) => {
  const { id } = req.params;

  const index = budgets.findIndex(b => b.id === id && b.userId === req.user.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Budget not found' });
  }

  budgets.splice(index, 1);
  res.json({ message: 'Budget deleted successfully' });
});

module.exports = router;

