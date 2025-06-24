/**
 * @file routes/categories.js
 * @description Manages categories for transaction grouping (CRUD).
 */

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// In-memory category store per user
const categories = [];

/**
 * @route GET /api/categories
 * @desc Get all categories for authenticated user
 * @access Private
 */
router.get('/', auth, (req, res) => {
  const userCategories = categories.filter(c => c.userId === req.user.id);
  res.json(userCategories);
});

/**
 * @route POST /api/categories
 * @desc Create a new category
 * @access Private
 */
router.post('/', auth, (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Category name is required' });
  }

  // Check if category name already exists for user
  if (categories.find(c => c.userId === req.user.id && c.name.toLowerCase() === name.toLowerCase())) {
    return res.status(400).json({ message: 'Category already exists' });
  }

  const newCategory = {
    id: Date.now().toString(),
    userId: req.user.id,
    name
  };

  categories.push(newCategory);
  res.status(201).json(newCategory);
});

/**
 * @route PUT /api/categories/:id
 * @desc Update category name by ID
 * @access Private
 */
router.put('/:id', auth, (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Category name is required' });
  }

  const category = categories.find(c => c.id === id && c.userId === req.user.id);
  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }

  category.name = name;
  res.json(category);
});

/**
 * @route DELETE /api/categories/:id
 * @desc Delete a category by ID
 * @access Private
 */
router.delete('/:id', auth, (req, res) => {
  const { id } = req.params;

  const index = categories.findIndex(c => c.id === id && c.userId === req.user.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Category not found' });
  }

  categories.splice(index, 1);
  res.json({ message: 'Category deleted successfully' });
});

module.exports = router;

