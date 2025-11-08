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

// Define allowed transaction types
const TRANSACTION_TYPES = ['income', 'expense'];


/**
 * Validates transaction data
 * @param {Object} transaction - Transaction object to validate
 * @returns {Object} Validation result with isValid flag and errors array
 */
function validateTransaction(transaction) {
    const errors = [];
    
    // Validate description
    if (!transaction.description) {
        errors.push('Description is required');
    } else {
        const desc = sanitizeInput(transaction.description);
        if (desc === '') {
            errors.push('Description cannot be empty or only whitespace');
        } else if (desc.length < 3) {
            errors.push('Description must be at least 3 characters long');
        } else if (desc.length > 200) {
            errors.push('Description must not exceed 200 characters');
        }
    }
    // Validate amount
    if (!transaction.amount) {
        errors.push('Amount is required');
    } else {
        const amount = parseFloat(transaction.amount);
        if (isNaN(amount)) {
            errors.push('Amount must be a valid number');
        } else if (amount <= 0) {
            errors.push('Amount must be greater than 0');
        } else if (amount > 1000000000) {
            errors.push('Amount exceeds maximum allowed value');
        } else if (!/^\d+(\.\d{1,2})?$/.test(transaction.amount.toString())) {
            errors.push('Amount can have at most 2 decimal places');
        }
    }

     // Validate category
    if (!transaction.category) {
        errors.push('Category is required');
    } else {
        const category = sanitizeInput(transaction.category).toLowerCase();
        if (category === '') {
            errors.push('Category cannot be empty or only whitespace');
        } else if (!VALID_CATEGORIES.includes(category)) {
            errors.push(`Category must be one of: ${VALID_CATEGORIES.join(', ')}`);
        }
    }
    
    // Validate type
    if (!transaction.type) {
        errors.push('Type is required');
    } else if (!TRANSACTION_TYPES.includes(transaction.type)) {
        errors.push('Type must be either "income" or "expense"');
    }

    // Validate date (if provided)
    if (transaction.date && !isValidDate(transaction.date)) {
        errors.push('Date must be in YYYY-MM-DD format');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Validates budget data
 * @param {Object} budget - Budget object to validate
 * @returns {Object} Validation result with isValid flag and errors array
 */
function validateBudget(budget) {
    const errors = [];
    
    // Validate category
    if (!budget.category) {
        errors.push('Category is required');
    } else {
        const category = sanitizeInput(budget.category).toLowerCase();
        if (category === '') {
            errors.push('Category cannot be empty or only whitespace');
        } else if (!VALID_CATEGORIES.includes(category)) {
            errors.push(`Category must be one of: ${VALID_CATEGORIES.join(', ')}`);
        }
    }

     // Validate limit
    if (!budget.limit) {
        errors.push('Limit is required');
    } else {
        const limit = parseFloat(budget.limit);
        if (isNaN(limit)) {
            errors.push('Limit must be a valid number');
        } else if (limit <= 0) {
            errors.push('Limit must be greater than 0');
        } else if (limit > 1000000000) {
            errors.push('Limit exceeds maximum allowed value');
        } else if (!/^\d+(\.\d{1,2})?$/.test(budget.limit.toString())) {
            errors.push('Limit can have at most 2 decimal places');
        }
    }
     return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Middleware to validate transaction in request body
 */
function validateTransactionMiddleware(req, res, next) {
    const validation = validateTransaction(req.body);
    
    if (!validation.isValid) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: validation.errors
        });
    }
    
    next();
}

/**
 * Middleware to validate budget in request body
 */
function validateBudgetMiddleware(req, res, next) {
    const validation = validateBudget(req.body);
    
    if (!validation.isValid) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: validation.errors
        });
    }
    
    next();
}

module.exports = {
    validateTransaction,
    validateBudget,
    validateTransactionMiddleware,
    validateBudgetMiddleware,
    VALID_CATEGORIES,
    TRANSACTION_TYPES
};
