const { readTransactions, readBudgets } = require('../services/storage');

async function getSummary(req, res) {
    try {
        const transactions = await readTransactions();
        const budgets = await readBudgets();
        
        // Calculate totals
        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const totalExpenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const balance = totalIncome - totalExpenses;
        
        // Calculate spending by category
        const spendingByCategory = transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => {
                acc[t.category] = (acc[t.category] || 0) + t.amount;
                return acc;
            }, {});
        
        // Calculate budget status
        const budgetStatus = budgets.map(budget => {
            const spent = spendingByCategory[budget.category] || 0;
            const remaining = budget.limit - spent;
            const percentage = (spent / budget.limit) * 100;
            
            return {
                category: budget.category,
                limit: budget.limit,
                spent,
                remaining,
                percentage: Math.min(percentage, 100),
                status: percentage > 100 ? 'exceeded' : percentage > 80 ? 'warning' : 'good'
            };
        });
        
        res.json({
            success: true,
            data: {
                totalIncome,
                totalExpenses,
                balance,
                spendingByCategory,
                budgetStatus,
                transactionCount: transactions.length
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error generating summary',
            error: error.message
        });
    }
}

module.exports = {
    getSummary
};
