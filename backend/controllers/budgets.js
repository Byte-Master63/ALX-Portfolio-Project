const { generateId, sanitizeInput } = require('../services/utils');
const { readBudgets, writeBudgets } = require('../services/storage');
const { NotFoundError, ConflictError } = require('../middleware/errorHandler');

/**
 * Get all budgets for the authenticated user
 */
async function getBudgets(req, res) {
    const userId = req.userId;
    const allBudgets = await readBudgets();
    
    // Filter budgets by user ID
    const budgets = allBudgets.filter(b => b.userId === userId);
    
    // Sort by category alphabetically
    budgets.sort((a, b) => a.category.localeCompare(b.category));
    
    res.json({
        success: true,
        data: budgets,
        count: budgets.length
    });
}

/**
 * Get a single budget by ID (must belong to user)
 */
async function getBudgetById(req, res) {
    const userId = req.userId;
    const budgets = await readBudgets();
    const budget = budgets.find(b => b.id === req.params.id && b.userId === userId);
    
    if (!budget) {
        throw new NotFoundError('Budget not found');
    }
    
    res.json({
        success: true,
        data: budget
    });
}

/**
 * Create a new budget for the authenticated user
 */
async function createBudget(req, res) {
    const userId = req.userId;
    const { category, limit } = req.body;
    const budgets = await readBudgets();
    
    const normalizedCategory = sanitizeInput(category).toLowerCase();
    
    // Check if budget for this category already exists for this user
    const existingBudget = budgets.find(
        b => b.userId === userId && b.category.toLowerCase() === normalizedCategory
    );
    
    if (existingBudget) {
        throw new ConflictError(
            `Budget for category "${normalizedCategory}" already exists. Use PUT to update it.`
        );
    }
    
    const newBudget = {
        id: generateId(),
        userId: userId, // Associate with user
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
 * Update an existing budget (must belong to user)
 */
async function updateBudget(req, res) {
    const userId = req.userId;
    const { category, limit } = req.body;
    const budgets = await readBudgets();
    const budgetIndex = budgets.findIndex(
        b => b.id === req.params.id && b.userId === userId
    );
    
    if (budgetIndex === -1) {
        throw new NotFoundError('Budget not found');
    }
    
    const normalizedCategory = sanitizeInput(category).toLowerCase();
    
    // Check if updating category conflicts with another budget for this user
    const conflictingBudget = budgets.find(
        b => b.userId === userId && 
        b.id !== req.params.id && 
        b.category.toLowerCase() === normalizedCategory
    );
    
    if (conflictingBudget) {
        throw new ConflictError(
            `Another budget for category "${normalizedCategory}" already exists`
        );
    }
    
    const updatedBudget = {
        id: budgets[budgetIndex].id,
        userId: budgets[budgetIndex].userId, // Preserve userId
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
 * Delete a budget (must belong to user)
 */
async function deleteBudget(req, res) {
    const userId = req.userId;
    const budgets = await readBudgets();
    const budgetIndex = budgets.findIndex(
        b => b.id === req.params.id && b.userId === userId
    );
    
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
