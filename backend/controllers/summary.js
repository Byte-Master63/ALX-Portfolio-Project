const { readTransactions, readBudgets } = require('../services/storage');

async function getSummary(req, res) {
    const { startDate, endDate } = req.query;
    
    let transactions = await readTransactions();
    const budgets = await readBudgets();
    
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
            spent: parseFloat(spent.toFixed(2)),
            remaining: parseFloat(remaining.toFixed(2)),
            percentage: parseFloat(Math.min(percentage, 100).toFixed(2)),
            status: percentage > 100 ? 'exceeded' : percentage > 80 ? 'warning' : 'good'
        };
    });
    
    res.json({
        success: true,
        data: {
            totalIncome: parseFloat(totalIncome.toFixed(2)),
            totalExpenses: parseFloat(totalExpenses.toFixed(2)),
            balance: parseFloat(balance.toFixed(2)),
            spendingByCategory,
            budgetStatus,
            transactionCount: transactions.length,
            dateRange: {
                start: startDate || 'all',
                end: endDate || 'all'
            }
        }
    });
}

async function getMonthlySummary(req, res) {
    const year = req.query.year || new Date().getFullYear();
    const transactions = await readTransactions();
    
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
        if (transactionDate.getFullYear() !== parseInt(year)) return;
        
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
    
    res.json({
        success: true,
        data: {
            year: parseInt(year),
            months: monthlyData,
            yearTotal: {
                income: parseFloat(monthlyData.reduce((sum, m) => sum + m.income, 0).toFixed(2)),
                expenses: parseFloat(monthlyData.reduce((sum, m) => sum + m.expenses, 0).toFixed(2)),
                balance: parseFloat(monthlyData.reduce((sum, m) => sum + m.balance, 0).toFixed(2))
            }
        }
    });
}

async function getCategorySummary(req, res) {
    const { type, startDate, endDate } = req.query;
    
    let transactions = await readTransactions();
    
    // Filter by type if provided
    if (type && ['income', 'expense'].includes(type)) {
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
        if (!acc[t.category]) {
            acc[t.category] = {
                category: t.category,
                type: t.type,
                total: 0,
                count: 0,
                transactions: []
            };
        }
        
        acc[t.category].total += t.amount;
        acc[t.category].count++;
        acc[t.category].transactions.push({
            id: t.id,
            description: t.description,
            amount: t.amount,
            date: t.date
        });
        
        return acc;
    }, {});
    
    // Convert to array and sort by total (descending)
    const categorySummary = Object.values(categoryData)
        .map(cat => ({
            ...cat,
            total: parseFloat(cat.total.toFixed(2)),
            average: parseFloat((cat.total / cat.count).toFixed(2))
        }))
        .sort((a, b) => b.total - a.total);
    
    res.json({
        success: true,
        data: {
            categories: categorySummary,
            totalAmount: parseFloat(categorySummary.reduce((sum, cat) => sum + cat.total, 0).toFixed(2)),
            totalTransactions: transactions.length,
            filters: { type: type || 'all', startDate: startDate || 'all', endDate: endDate || 'all' }
        }
    });
}

module.exports = {
    getSummary,
    getMonthlySummary,
    getCategorySummary
};
