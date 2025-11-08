
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