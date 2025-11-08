const { readTransactions, writeTransactions } = require('../services/storage');
const { generateId, sanitizeInput, getCurrentDate } = require('../services/utils');
const { NotFoundError } = require('../middleware/errorHandler');

/**
 * Get all transactions with optional filtering
 * Query params: type, category, startDate, endDate, limit, offset
 */
async function getTransactions(req, res) {
    const { type, category, startDate, endDate, limit, offset } = req.query;
    
    let transactions = await readTransactions();
    
    // Filter by type
    if (type && ['income', 'expense'].includes(type)) {
        transactions = transactions.filter(t => t.type === type);
    }
    
    // Filter by category
    if (category) {
        const normalizedCategory = category.toLowerCase().trim();
        transactions = transactions.filter(
            t => t.category.toLowerCase() === normalizedCategory
        );
    }
    
    // Filter by date range
    if (startDate || endDate) {
        transactions = transactions.filter(t => {
            const transactionDate = new Date(t.date);
            if (startDate && transactionDate < new Date(startDate)) return false;
            if (endDate && transactionDate > new Date(endDate)) return false;
            return true;
        });
    }
    
    // Sort by date (newest first)
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Pagination
    const total = transactions.length;
    const startIndex = offset ? parseInt(offset) : 0;
    const endIndex = limit ? startIndex + parseInt(limit) : transactions.length;
    const paginatedTransactions = transactions.slice(startIndex, endIndex);
    
    res.json({
        success: true,
        data: paginatedTransactions,
        pagination: {
            total,
            count: paginatedTransactions.length,
            offset: startIndex,
            limit: limit ? parseInt(limit) : total
        },
        filters: {
            type: type || 'all',
            category: category || 'all',
            startDate: startDate || 'all',
            endDate: endDate || 'all'
        }
    });
}

/**
 * Get a single transaction by ID
 */
async function getTransactionById(req, res) {
    const transactions = await readTransactions();
    const transaction = transactions.find(t => t.id === req.params.id);
    
    if (!transaction) {
        throw new NotFoundError('Transaction not found');
    }
    
    res.json({
        success: true,
        data: transaction
    });
}

/**
 * Create a new transaction
 */
async function createTransaction(req, res) {
    // Validation already handled by middleware
    const transactions = await readTransactions();
    
    const newTransaction = {
        id: generateId(),
        description: sanitizeInput(req.body.description),
        amount: parseFloat(req.body.amount),
        category: sanitizeInput(req.body.category).toLowerCase(),
        type: req.body.type,
        date: req.body.date || getCurrentDate(),
        createdAt: new Date().toISOString()
    };
    
    transactions.push(newTransaction);
    await writeTransactions(transactions);
    
    res.status(201).json({
        success: true,
        message: 'Transaction created successfully',
        data: newTransaction
    });
}

/**
 * Update an existing transaction
 */
async function updateTransaction(req, res) {
    // Validation already handled by middleware
    const transactions = await readTransactions();
    const transactionIndex = transactions.findIndex(t => t.id === req.params.id);
    
    if (transactionIndex === -1) {
        throw new NotFoundError('Transaction not found');
    }
    
    // Keep original ID and createdAt, update everything else
    const updatedTransaction = {
        id: transactions[transactionIndex].id,
        description: sanitizeInput(req.body.description),
        amount: parseFloat(req.body.amount),
        category: sanitizeInput(req.body.category).toLowerCase(),
        type: req.body.type,
        date: req.body.date || transactions[transactionIndex].date,
        createdAt: transactions[transactionIndex].createdAt,
        updatedAt: new Date().toISOString()
    };
    
    transactions[transactionIndex] = updatedTransaction;
    await writeTransactions(transactions);
    
    res.json({
        success: true,
        message: 'Transaction updated successfully',
        data: updatedTransaction
    });
}

/**
 * Delete a transaction
 */
async function deleteTransaction(req, res) {
    const transactions = await readTransactions();
    const transactionIndex = transactions.findIndex(t => t.id === req.params.id);
    
    if (transactionIndex === -1) {
        throw new NotFoundError('Transaction not found');
    }
    
    const deletedTransaction = transactions.splice(transactionIndex, 1)[0];
    await writeTransactions(transactions);
    
    res.json({
        success: true,
        message: 'Transaction deleted successfully',
        data: deletedTransaction
    });
}

module.exports = {
    getTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction
};
