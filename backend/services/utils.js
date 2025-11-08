
const crypto = require('crypto');

/**
 * Generates a unique ID using timestamp and random values
 * @returns {string} A unique identifier
 */
function generateId() {
    // Combine timestamp with crypto random for better uniqueness
    const timestamp = Date.now().toString(36);
    const randomPart = crypto.randomBytes(8).toString('hex');
    return `${timestamp}-${randomPart}`;
}

/**
 * Generates a UUID v4
 * @returns {string} A UUID v4 string
 */
function generateUUID() {
    return crypto.randomUUID();
}

/**
 * Validates if a string is a valid date (YYYY-MM-DD format)
 * @param {string} dateString - Date string to validate
 * @returns {boolean} True if valid date format
 */
function isValidDate(dateString) {
    if (!dateString || typeof dateString !== 'string') return false;
    
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    
    const date = new Date(dateString);
     return date instanceof Date && !isNaN(date);
}

/**
 * Formats a number as currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

/**
 * Sanitizes user input by trimming and removing extra spaces
 * @param {string} input - Input string to sanitize
 * @returns {string} Sanitized string
 */
function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    return input.trim().replace(/\s+/g, ' ');
}

/**
 * Gets current date in YYYY-MM-DD format
 * @returns {string} Current date string
 */
function getCurrentDate() {
    return new Date().toISOString().split('T')[0];
}