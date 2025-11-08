const { isValidDate, sanitizeInput } = require('../services/utils');

// Define allowed categories
const VALID_CATEGORIES = [
    'food',
    'transport',
    'entertainment',
    'utilities',
    'healthcare',
    'shopping',
    'education',
    'salary',
    'freelance',
    'investment',
    'other'
];

function validateTransaction(transaction) {
    const errors = [];
    
    if (!transaction.description || transaction.description.trim() === '') {
        errors.push('Description is required');
    }
    
    if (!transaction.amount || isNaN(transaction.amount) || transaction.amount <= 0) {
        errors.push('Amount must be a positive number');
    }
    
    if (!transaction.category || transaction.category.trim() === '') {
        errors.push('Category is required');
    }
    
    if (!transaction.type || !['income', 'expense'].includes(transaction.type)) {
        errors.push('Type must be either "income" or "expense"');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}

module.exports = {
    validateTransaction
};
