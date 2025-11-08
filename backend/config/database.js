const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const TRANSACTIONS_FILE = path.join(DATA_DIR, 'transactions.json');
const BUDGETS_FILE = path.join(DATA_DIR, 'budgets.json');

/**
 * Validates and initializes a JSON file
 * @param {string} filePath - Path to the JSON file
 * @param {string} fileName - Name of the file for logging
 */
async function initializeFile(filePath, fileName) {
    try {
        await fs.access(filePath);
        // File exists, validate JSON
        const content = await fs.readFile(filePath, 'utf8');
        try {
            JSON.parse(content);
            console.log(`✅ ${fileName} validated`);
        } catch (parseError) {
            console.warn(`⚠️  ${fileName} contains invalid JSON, resetting...`);
            await fs.writeFile(filePath, '[]');
        }
    } catch {
        // File doesn't exist, create it
        await fs.writeFile(filePath, '[]');
        console.log(`📝 ${fileName} created`);
    }
}

async function initializeStorage() {
    try {
        // Create data directory if it doesn't exist
        await fs.mkdir(DATA_DIR, { recursive: true });
        console.log('📁 Data directory ready');
        
        // Initialize both data files
        await initializeFile(TRANSACTIONS_FILE, 'transactions.json');
        await initializeFile(BUDGETS_FILE, 'budgets.json');
        
        console.log('✅ Data storage initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing storage:', error.message);
        throw error;
    }
}

module.exports = {
    initializeStorage,
    TRANSACTIONS_FILE,
    BUDGETS_FILE,
    DATA_DIR
};
