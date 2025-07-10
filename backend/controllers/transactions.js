const { readTransactions, writeTransactions } = require('../services/storage');
const { validateTransaction } = require('../middleware/validators');
const { generateId } = require('../services/utils');

async function getTransactions(req, res) {
    try {
        const transactions = await readTransactions();
        res.json({ success: true, data: transactions });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching transactions',
            error: error.message
        });
    }
}

async function createTransaction(req, res) {
    try {
        const validation = validateTransaction(req.body);
        
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validation.errors
            });
        }
        
        const transactions = await readTransactions();
        const newTransaction = {
            id: generateId(),
            description: req.body.description.trim(),
            amount: parseFloat(req.body.amount),
            category: req.body.category.trim(),
            type: req.body.type,
            date: req.body.date || new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString()
        };
        
        transactions.push(newTransaction);
        await writeTransactions(transactions);
        
        res.status(201).json({
            success: true,
            message: 'Transaction created successfully',
            data: newTransaction
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating transaction',
            error: error.message
        });
    }
}

async function deleteTransaction(req, res) {
    try {
        const transactions = await readTransactions();
        const transactionIndex = transactions.findIndex(t => t.id === req.params.id);
        
        if (transactionIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }
        
        const deletedTransaction = transactions.splice(transactionIndex, 1)[0];
        await writeTransactions(transactions);
        
        res.json({
            success: true,
            message: 'Transaction deleted successfully',
            data: deletedTransaction
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting transaction',
            error: error.message
        });
    }
}

module.exports = {
    getTransactions,
    createTransaction,
    deleteTransaction
};
