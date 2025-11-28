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

/**
 * Update an existing user
 * @param {string} userId - User ID
 * @param {Object} updateData - Updated user data
 * @returns {Promise<Object>} Updated user object
 */
async function updateUser(userId, updateData) {
    const users = await readUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
        throw new Error('User not found');
    }
    
    // Update user while preserving ID and createdAt
    users[userIndex] = {
        ...updateData,
        id: users[userIndex].id,
        createdAt: users[userIndex].createdAt
    };
    
    await writeUsers(users);
    return users[userIndex];
}

/**
 * Delete a user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Deleted user object
 */
async function deleteUser(userId) {
    const users = await readUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
        throw new Error('User not found');
    }
    
    const deletedUser = users.splice(userIndex, 1)[0];
    await writeUsers(users);
    return deletedUser;
}

/**
 * Get all users (admin function - use with caution)
 * @returns {Promise<Array>} Array of user objects (without passwords)
 */
async function getAllUsers() {
    const users = await readUsers();
    return users.map(({ password, ...user }) => user);
}

/**
 * Check if email exists
 * @param {string} email - Email to check
 * @returns {Promise<boolean>} True if email exists
 */
async function emailExists(email) {
    const user = await findUserByEmail(email);
    return !!user;
}

/**
 * Get user count
 * @returns {Promise<number>} Number of registered users
 */
async function getUserCount() {
    const users = await readUsers();
    return users.length;
}

module.exports = {
    readUsers,
    writeUsers,
    findUserByEmail,
    findUserById,
    createUser,
    updateUser,
    deleteUser,
    getAllUsers,
    emailExists,
    getUserCount
};