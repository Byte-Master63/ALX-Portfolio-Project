const fs = require('fs').promises;
const { TRANSACTIONS_FILE, BUDGETS_FILE } = require('../config/database');

async function readTransactions() {
    return readData(TRANSACTIONS_FILE);
}

async function writeTransactions(data) {
    return writeData(TRANSACTIONS_FILE, data);
}

async function readBudgets() {
    return readData(BUDGETS_FILE);
}

async function writeBudgets(data) {
    return writeData(BUDGETS_FILE, data);
}

async function readData(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
        return [];
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
