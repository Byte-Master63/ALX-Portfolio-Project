const { generateId } = require('../services/utils');
const { readBudgets, writeBudgets } = require('../services/storage');

async function getBudgets(req, res) {
    try {
        const budgets = await readBudgets();
        res.json({
            success: true,
            data: budgets
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching budgets',
            error: error.message
        });
    }
}

async function getBudgetById(req, res) {
    const budgets = await readBudgets();
    const budget = budgets.find(b => b.id === req.params.id);
    
    if (!budget) {
        throw new NotFoundError('Budget not found');
    }
    
    res.json({ success: true, data: budget });
}
async function createBudget(req, res) {
    const { category, limit } = req.body;
    const budgets = await readBudgets();
    
    // Check if budget for this category already exists
    const existingBudget = budgets.find(
        b => b.category.toLowerCase() === category.toLowerCase()
    );
    
    if (existingBudget) {
        throw new ConflictError(`Budget for category "${category}" already exists`);
    }
    
    const newBudget = {
        id: generateId(),
        category: category.trim().toLowerCase(),
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

async function updateBudget(req, res) {
    const { category, limit } = req.body;
    const budgets = await readBudgets();
    const budgetIndex = budgets.findIndex(b => b.id === req.params.id);
    
    if (budgetIndex === -1) {
        throw new NotFoundError('Budget not found');
    }
    
    // Check if updating category conflicts with another budget
    const conflictingBudget = budgets.find(
        b => b.id !== req.params.id && 
        b.category.toLowerCase() === category.toLowerCase()
    );
    
    if (conflictingBudget) {
        throw new ConflictError(`Another budget for category "${category}" already exists`);
    }
    
    const updatedBudget = {
        ...budgets[budgetIndex],
        category: category.trim().toLowerCase(),
        limit: parseFloat(limit),
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

const { NotFoundError, ConflictError } = require('../middleware/errorHandler');

module.exports = {
    getBudgets,
    getBudgetById,
    createBudget,
    updateBudget,
    deleteBudget
};
