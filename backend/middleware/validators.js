const { isValidDate, sanitizeInput } = require('../services/utils');
const { sanitizeInput } = require('../services/utils');

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
    'other',
    'housing',        
    'insurance',
    'savings',
    'debt',
    'fitness',
    'gifts',
    'travel',
    'pets', 
    'subscriptions',
    'personal'   
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

/**
 * Validates registration data
 * @param {Object} data - Registration data
 * @returns {Object} Validation result
 */
function validateRegistration(data) {
    const errors = [];
    
    // Validate name
    if (!data.name) {
        errors.push('Name is required');
    } else {
        const name = sanitizeInput(data.name);
        if (name.length < 2) {
            errors.push('Name must be at least 2 characters long');
        } else if (name.length > 100) {
            errors.push('Name must not exceed 100 characters');
        }
    }
    
    // Validate email
    if (!data.email) {
        errors.push('Email is required');
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            errors.push('Please provide a valid email address');
        }
    }
    
    // Validate password
    if (!data.password) {
        errors.push('Password is required');
    } else if (data.password.length < 6) {
        errors.push('Password must be at least 6 characters long');
    } else if (data.password.length > 100) {
        errors.push('Password must not exceed 100 characters');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Validates login data
 * @param {Object} data - Login data
 * @returns {Object} Validation result
 */
function validateLogin(data) {
    const errors = [];
    
    // Validate email
    if (!data.email) {
        errors.push('Email is required');
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            errors.push('Please provide a valid email address');
        }
    }
    
    // Validate password
    if (!data.password) {
        errors.push('Password is required');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Middleware to validate registration in request body
 */
function validateRegistrationMiddleware(req, res, next) {
    const validation = validateRegistration(req.body);
    
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
 * Middleware to validate login in request body
 */
function validateLoginMiddleware(req, res, next) {
    const validation = validateLogin(req.body);
    
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
 * Validates profile update data
 * @param {Object} data - Profile update data
 * @returns {Object} Validation result
 */
function validateProfileUpdate(data) {
    const errors = [];
    
    // Validate name (optional, but if provided must be valid)
    if (data.name !== undefined && data.name !== null) {
        const name = sanitizeInput(data.name);
        if (name.length > 0 && name.length < 2) {
            errors.push('Name must be at least 2 characters long');
        } else if (name.length > 100) {
            errors.push('Name must not exceed 100 characters');
        }
    }
    
    // If changing password, validate all password fields
    if (data.newPassword) {
        // Current password required
        if (!data.currentPassword) {
            errors.push('Current password is required to change password');
        }
        
        // New password validation
        if (data.newPassword.length < 6) {
            errors.push('New password must be at least 6 characters long');
        } else if (data.newPassword.length > 100) {
            errors.push('New password must not exceed 100 characters');
        }
    }
    
    // If current password provided without new password
    if (data.currentPassword && !data.newPassword) {
        errors.push('New password is required when current password is provided');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Middleware to validate profile update in request body
 */
function validateProfileUpdateMiddleware(req, res, next) {
    const validation = validateProfileUpdate(req.body);
    
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
    validateRegistration,
    validateLogin,
    validateRegistrationMiddleware,
    validateLoginMiddleware,
    validateProfileUpdate,
    validateProfileUpdateMiddleware,
    VALID_CATEGORIES,
    TRANSACTION_TYPES
};
