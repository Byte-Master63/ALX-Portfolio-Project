/**
 * @file routes/transactions.js
 * @description Handles income and expense transaction CRUD operations.
 */

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// In-memory store for transactions (replace with DB later)
const transactions = [];

/**
 * @route GET /api/transactions
 * @desc Get all transactions for authenticated user
 * @access Private
 */
router.get('/', auth, (req, res) => {
  const userTransactions = transactions.filter(t => t.userId === req.user.id);
  res.json(userTransactions);
});

/**
 * @route POST /api/transactions
 * @desc Create a new transaction
 * @access Private
 */
router.post('/', auth, (req, res) => {
  const { type, amount, category, date, description } = req.body;

  // Basic validation
  if (!type || !amount || !category) {
    return res.status(400).json({ message: 'Type, amount, and category are required' });
  }

  const newTransaction = {
    id: Date.now().toString(),
    userId: req.user.id,
    type,
    amount,
    category,
    date: date || new Date().toISOString(),
    description: description || ''
  };

  transactions.push(newTransaction);
  res.status(201).json(newTransaction);
});

/**
 * @route PUT /api/transactions/:id
 * @desc Update a transaction by ID
 * @access Private
 */
router.put('/:id', auth, (req, res) => {
  const { id } = req.params;
  const { type, amount, category, date, description } = req.body;

  const transaction = transactions.find(t => t.id === id && t.userId === req.user.id);
  if (!transaction) {
    return res.status(404).json({ message: 'Transaction not found' });
  }

  if (type) transaction.type = type;
  if (amount) transaction.amount = amount;
  if (category) transaction.category = category;
  if (date) transaction.date = date;
  if (description) transaction.description = description;

  res.json(transaction);
});

/**
 * @route DELETE /api/transactions/:id
 * @desc Delete a transaction by ID
 * @access Private
 */
router.delete('/:id', auth, (req, res) => {
  const { id } = req.params;

  const index = transactions.findIndex(t => t.id === id && t.userId === req.user.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Transaction not found' });
  }

  transactions.splice(index, 1);
  res.json({ message: 'Transaction deleted successfully' });
});

module.exports = router;

