
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