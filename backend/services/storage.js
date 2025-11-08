const fs = require('fs').promises;
const { TRANSACTIONS_FILE, BUDGETS_FILE } = require('../config/database');

// Write locks to prevent race conditions
const writeLocks = new Map();

async function readTransactions() {
    return readData(TRANSACTIONS_FILE, transactions);
}

async function writeTransactions(data) {
    return writeData(TRANSACTIONS_FILE, data, 'transactions');
}

async function readBudgets() {
    return readData(BUDGETS_FILE, 'budgets');
}

async function writeBudgets(data) {
    return writeData(BUDGETS_FILE, data, budgets);
}

async function readData(filePath, dataType) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        const parsed = JSON.parse(data);
        
        // Validate that parsed data is an array
        if (!Array.isArray(parsed)) {
            console.error(`Error: ${dataType} file contains non-array data, returning empty array`);
            return [];
        }
        
        return parsed;
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.warn(`${dataType} file not found, returning empty array`);
            return [];
        }
        
        console.error(`Error reading ${dataType} from ${filePath}:`, error.message);
        throw new Error(`Failed to read ${dataType}: ${error.message}`);
    }
}

async function writeData(filePath, data) {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error(`Error writing to ${filePath}:`, error);
        throw error;
    }
}

module.exports = {
    readTransactions,
    writeTransactions,
    readBudgets,
    writeBudgets
};
