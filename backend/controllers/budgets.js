const { generateId, sanitizeInput } = require('../services/utils');
const { readBudgets, writeBudgets } = require('../services/storage');
const { NotFoundError, ConflictError } = require('../middleware/errorHandler');

/**
 * Get all budgets
 */
async function getBudgets(req, res) {
    const budgets = await readBudgets();
    
    // Sort by category alphabetically
    budgets.sort((a, b) => a.category.localeCompare(b.category));
    
    res.json({
        success: true,
        data: budgets,
        count: budgets.length
    });
}

/**
 * Get a single budget by ID
 */
async function getBudgetById(req, res) {
    const budgets = await readBudgets();
    const budget = budgets.find(b => b.id === req.params.id);
    
    if (!budget) {
        throw new NotFoundError('Budget not found');
    }
    
    res.json({
        success: true,
        data: budget
    });
}

/**
 * Create a new budget
 */
async function createBudget(req, res) {
    // Validation already handled by middleware
    const { category, limit } = req.body;
    const budgets = await readBudgets();
    
    const normalizedCategory = sanitizeInput(category).toLowerCase();
    
    // Check if budget for this category already exists
    const existingBudget = budgets.find(
        b => b.category.toLowerCase() === normalizedCategory
    );
    
    if (existingBudget) {
        throw new ConflictError(
            `Budget for category "${normalizedCategory}" already exists. Use PUT to update it.`
        );
    }
    
    const newBudget = {
        id: generateId(),
        category: normalizedCategory,
        limit: parseFloat(limit),
        createdAt: new Date().toISOString()
    };
    
    budgets.push(newBudget);
    await writeBudgets(budgets);
    
    res.status(201).json({
        success: true,
        message: 'Budget created successfully',
        data: newBudget
    });
}

/**
 * Update an existing budget
 */
async function updateBudget(req, res) {
    // Validation already handled by middleware
    const { category, limit } = req.body;
    const budgets = await readBudgets();
    const budgetIndex = budgets.findIndex(b => b.id === req.params.id);
    
    if (budgetIndex === -1) {
        throw new NotFoundError('Budget not found');
    }
    
    const normalizedCategory = sanitizeInput(category).toLowerCase();
    
    // Check if updating category conflicts with another budget
    const conflictingBudget = budgets.find(
        b => b.id !== req.params.id && 
        b.category.toLowerCase() === normalizedCategory
    );
    
    if (conflictingBudget) {
        throw new ConflictError(
            `Another budget for category "${normalizedCategory}" already exists`
        );
    }
    
    const updatedBudget = {
        id: budgets[budgetIndex].id,
        category: normalizedCategory,
        limit: parseFloat(limit),
        createdAt: budgets[budgetIndex].createdAt,
        updatedAt: new Date().toISOString()
    };
    
    budgets[budgetIndex] = updatedBudget;
    await writeBudgets(budgets);
    
    res.json({
        success: true,
        message: 'Budget updated successfully',
        data: updatedBudget
    });
}

/**
 * Delete a budget
 */
async function deleteBudget(req, res) {
    const budgets = await readBudgets();
    const budgetIndex = budgets.findIndex(b => b.id === req.params.id);
    
    if (budgetIndex === -1) {
        throw new NotFoundError('Budget not found');
    }
    
    const deletedBudget = budgets.splice(budgetIndex, 1)[0];
    await writeBudgets(budgets);
    
    res.json({
        success: true,
        message: 'Budget deleted successfully',
        data: deletedBudget
    });
}

module.exports = {
    getBudgets,
    getBudgetById,
    createBudget,
    updateBudget,
    deleteBudget
};
