const fs = require('fs').promises;
const { USERS_FILE } = require('../config/database');

// Write locks to prevent race conditions
const writeLock = { locked: false };

/**
 * Read all users from storage
 * @returns {Promise<Array>} Array of user objects
 */
async function readUsers() {
    try {
        const fileContent = await fs.readFile(USERS_FILE, 'utf8');
        const parsed = JSON.parse(fileContent);
        
        if (!Array.isArray(parsed)) {
            console.error('Error: users file contains non-array data, returning empty array');
            return [];
        }
        
        return parsed;
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.warn('Users file not found, returning empty array');
            return [];
        }
        
        console.error(`Error reading users from ${USERS_FILE}:`, error.message);
        throw new Error(`Failed to read users: ${error.message}`);
    }
}

/**
 * Write users to storage
 * @param {Array} data - Array of user objects
 * @returns {Promise<void>}
 */
async function writeUsers(data) {
    if (!Array.isArray(data)) {
        throw new Error('Users data must be an array');
    }
    
    // Acquire write lock
    while (writeLock.locked) {
        await new Promise(resolve => setTimeout(resolve, 10));
    }
    writeLock.locked = true;
    
    try {
        // Write to temporary file first (atomic write)
        const tempPath = `${USERS_FILE}.tmp`;
        await fs.writeFile(tempPath, JSON.stringify(data, null, 2), 'utf8');
        
        // Rename temp file to actual file (atomic operation)
        await fs.rename(tempPath, USERS_FILE);
        
        console.log(`✅ Users saved successfully (${data.length} users)`);
    } catch (error) {
        console.error(`Error writing users to ${USERS_FILE}:`, error.message);
        throw new Error(`Failed to write users: ${error.message}`);
    } finally {
        // Release write lock
        writeLock.locked = false;
    }
}

/**
 * Find a user by email
 * @param {string} email - User email
 * @returns {Promise<Object|null>} User object or null
 */
async function findUserByEmail(email) {
    const users = await readUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

/**
 * Find a user by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} User object or null
 */
async function findUserById(userId) {
    const users = await readUsers();
    return users.find(u => u.id === userId) || null;
}

/**
 * Create a new user
 * @param {Object} userData - User data
 * @returns {Promise<Object>} Created user object
 */
async function createUser(userData) {
    const users = await readUsers();
    users.push(userData);
    await writeUsers(users);
    return userData;
}

module.exports = {
    readUsers,
    writeUsers,
    findUserByEmail,
    findUserById,
    createUser
};