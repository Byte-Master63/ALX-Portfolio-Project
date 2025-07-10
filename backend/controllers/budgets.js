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

async function createOrUpdateBudget(req, res) {
    try {
        const { category, limit } = req.body;
        
        if (!category || !limit || isNaN(limit) || limit <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Category and valid limit are required'
            });
        }
        
        const budgets = await readBudgets();
        const existingBudgetIndex = budgets.findIndex(b => b.category === category);
        
        if (existingBudgetIndex !== -1) {
            // Update existing budget
            budgets[existingBudgetIndex].limit = parseFloat(limit);
            budgets[existingBudgetIndex].updatedAt = new Date().toISOString();
        } else {
            // Create new budget
            const newBudget = {
                id: generateId(),
                category: category.trim(),
                limit: parseFloat(limit),
                createdAt: new Date().toISOString()
            };
            budgets.push(newBudget);
        }
        
        await writeBudgets(budgets);
        
        res.json({
            success: true,
            message: 'Budget saved successfully',
            data: budgets
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error saving budget',
            error: error.message
        });
    }
}

module.exports = {
    getBudgets,
    createOrUpdateBudget
};
