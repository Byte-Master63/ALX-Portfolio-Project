const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const TRANSACTIONS_FILE = path.join(DATA_DIR, 'transactions.json');
const BUDGETS_FILE = path.join(DATA_DIR, 'budgets.json');

async function initializeStorage() {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        
        try {
            await fs.access(TRANSACTIONS_FILE);
        } catch {
            await fs.writeFile(TRANSACTIONS_FILE, '[]');
        }
        
        try {
            await fs.access(BUDGETS_FILE);
        } catch {
            await fs.writeFile(BUDGETS_FILE, '[]');
        }
        
        console.log('✅ Data storage initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing storage:', error);
        throw error;
    }
}

module.exports = {
    initializeStorage,
    TRANSACTIONS_FILE,
    BUDGETS_FILE
};
