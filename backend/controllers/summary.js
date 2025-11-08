const { readTransactions, readBudgets } = require('../services/storage');

/**
 * Get overall financial summary with optional date filtering
 */
async function getSummary(req, res) {
    const { startDate, endDate } = req.query;
    
    let transactions = await readTransactions();
    const budgets = await readBudgets();
    
    // Validate date range
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        return res.status(400).json({
            success: false,
            message: 'startDate must be before endDate'
        });
    }
    
    // Filter by date range if provided
    if (startDate || endDate) {
        transactions = transactions.filter(t => {
            const transactionDate = new Date(t.date);
            if (startDate && transactionDate < new Date(startDate)) return false;
            if (endDate && transactionDate > new Date(endDate)) return false;
            return true;
        });
    }
    
    // Calculate totals
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = totalIncome - totalExpenses;
    
    // Calculate spending by category (normalized to lowercase)
    const spendingByCategory = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
            const category = t.category.toLowerCase();
            acc[category] = (acc[category] || 0) + t.amount;
            return acc;
        }, {});
    
    // Calculate income by category
    const incomeByCategory = transactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => {
            const category = t.category.toLowerCase();
            acc[category] = (acc[category] || 0) + t.amount;
            return acc;
        }, {});
    
    // Calculate budget status
    const budgetStatus = budgets.map(budget => {
        const categoryLower = budget.category.toLowerCase();
        const spent = spendingByCategory[categoryLower] || 0;
        const remaining = budget.limit - spent;
        const percentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;
        
        return {
            id: budget.id,
            category: budget.category,
            limit: parseFloat(budget.limit.toFixed(2)),
            spent: parseFloat(spent.toFixed(2)),
            remaining: parseFloat(remaining.toFixed(2)),
            percentage: parseFloat(Math.min(percentage, 100).toFixed(2)),
            status: percentage > 100 ? 'exceeded' : percentage > 80 ? 'warning' : 'good'
        };
    });
    
    // Sort budget status by percentage (highest first)
    budgetStatus.sort((a, b) => b.percentage - a.percentage);
    
    res.json({
        success: true,
        data: {
            totalIncome: parseFloat(totalIncome.toFixed(2)),
            totalExpenses: parseFloat(totalExpenses.toFixed(2)),
            balance: parseFloat(balance.toFixed(2)),
            spendingByCategory,
            incomeByCategory,
            budgetStatus,
            transactionCount: transactions.length,
            dateRange: {
                start: startDate || 'all time',
                end: endDate || 'present'
            }
        }
    });
}

/**
 * Get monthly breakdown of income and expenses
 */
async function getMonthlySummary(req, res) {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const transactions = await readTransactions();
    
    // Validate year
    if (isNaN(year) || year < 2000 || year > 2100) {
        return res.status(400).json({
            success: false,
            message: 'Invalid year provided'
        });
    }
    
    // Initialize monthly data
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        monthName: new Date(year, i).toLocaleString('default', { month: 'long' }),
        income: 0,
        expenses: 0,
        balance: 0,
        transactionCount: 0
    }));
    
    // Aggregate transactions by month
    transactions.forEach(t => {
        const transactionDate = new Date(t.date);
        if (transactionDate.getFullYear() !== year) return;
        
        const monthIndex = transactionDate.getMonth();
        monthlyData[monthIndex].transactionCount++;
        
        if (t.type === 'income') {
            monthlyData[monthIndex].income += t.amount;
        } else {
            monthlyData[monthIndex].expenses += t.amount;
        }
    });
    
    // Calculate balances and format numbers
    monthlyData.forEach(month => {
        month.balance = month.income - month.expenses;
        month.income = parseFloat(month.income.toFixed(2));
        month.expenses = parseFloat(month.expenses.toFixed(2));
        month.balance = parseFloat(month.balance.toFixed(2));
    });
    
    const yearTotals = {
        income: parseFloat(monthlyData.reduce((sum, m) => sum + m.income, 0).toFixed(2)),
        expenses: parseFloat(monthlyData.reduce((sum, m) => sum + m.expenses, 0).toFixed(2)),
        balance: parseFloat(monthlyData.reduce((sum, m) => sum + m.balance, 0).toFixed(2)),
        transactionCount: monthlyData.reduce((sum, m) => sum + m.transactionCount, 0)
    };
    
    res.json({
        success: true,
        data: {
            year,
            months: monthlyData,
            yearTotal: yearTotals
        }
    });
}

/**
 * Get detailed breakdown by category
 */
async function getCategorySummary(req, res) {
    const { type, startDate, endDate } = req.query;
    
    let transactions = await readTransactions();
    
    // Validate type if provided
    if (type && !['income', 'expense'].includes(type)) {
        return res.status(400).json({
            success: false,
            message: 'Type must be either "income" or "expense"'
        });
    }
    
    // Validate date range
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        return res.status(400).json({
            success: false,
            message: 'startDate must be before endDate'
        });
    }
    
    // Filter by type if provided
    if (type) {
        transactions = transactions.filter(t => t.type === type);
    }
    
    // Filter by date range if provided
    if (startDate || endDate) {
        transactions = transactions.filter(t => {
            const transactionDate = new Date(t.date);
            if (startDate && transactionDate < new Date(startDate)) return false;
            if (endDate && transactionDate > new Date(endDate)) return false;
            return true;
        });
    }
    
    // Group by category
    const categoryData = transactions.reduce((acc, t) => {
        const category = t.category.toLowerCase();
        
        if (!acc[category]) {
            acc[category] = {
                category,
                type: t.type,
                total: 0,
                count: 0,
                average: 0,
                min: t.amount,
                max: t.amount,
                transactions: []
            };
        }
        
        acc[category].total += t.amount;
        acc[category].count++;
        acc[category].min = Math.min(acc[category].min, t.amount);
        acc[category].max = Math.max(acc[category].max, t.amount);
        acc[category].transactions.push({
            id: t.id,
            description: t.description,
            amount: t.amount,
            date: t.date
        });
        
        return acc;
    }, {});
    
    // Convert to array, calculate averages, and sort by total (descending)
    const categorySummary = Object.values(categoryData)
        .map(cat => ({
            ...cat,
            total: parseFloat(cat.total.toFixed(2)),
            average: parseFloat((cat.total / cat.count).toFixed(2)),
            min: parseFloat(cat.min.toFixed(2)),
            max: parseFloat(cat.max.toFixed(2))
        }))
        .sort((a, b) => b.total - a.total);
    
    const totalAmount = parseFloat(
        categorySummary.reduce((sum, cat) => sum + cat.total, 0).toFixed(2)
    );
    
    res.json({
        success: true,
        data: {
            categories: categorySummary,
            totalAmount,
            totalTransactions: transactions.length,
            filters: {
                type: type || 'all',
                startDate: startDate || 'all time',
                endDate: endDate || 'present'
            }
        }
    });
}

module.exports = {
    getSummary,
    getMonthlySummary,
    getCategorySummary
};