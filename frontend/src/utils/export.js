/**
 * Export utilities for downloading data as CSV
 */

/**
 * Convert array of objects to CSV string
 * @param {Array} data - Array of objects
 * @param {Array} headers - Array of header objects with label and key
 * @returns {string} CSV string
 */
export const convertToCSV = (data, headers) => {
  if (!data || data.length === 0) return '';

  // Create header row
  const headerRow = headers.map(h => h.label).join(',');

  // Create data rows
  const dataRows = data.map(item => {
    return headers.map(h => {
      let value = item[h.key];
      
      // Handle special cases
      if (value === null || value === undefined) {
        value = '';
      } else if (typeof value === 'string' && value.includes(',')) {
        // Escape commas by wrapping in quotes
        value = `"${value}"`;
      }
      
      return value;
    }).join(',');
  });

  return [headerRow, ...dataRows].join('\n');
};

/**
 * Download CSV file
 * @param {string} csvContent - CSV string
 * @param {string} filename - Name of file to download
 */
export const downloadCSV = (csvContent, filename) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    // Create download link
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);
  }
};

/**
 * Export transactions to CSV
 * @param {Array} transactions - Array of transaction objects
 * @param {string} filename - Optional filename
 */
export const exportTransactionsToCSV = (transactions, filename = 'transactions.csv') => {
  const headers = [
    { label: 'Date', key: 'date' },
    { label: 'Description', key: 'description' },
    { label: 'Category', key: 'category' },
    { label: 'Type', key: 'type' },
    { label: 'Amount', key: 'amount' }
  ];

  const csvContent = convertToCSV(transactions, headers);
  downloadCSV(csvContent, filename);
};

/**
 * Export budgets to CSV
 * @param {Array} budgets - Array of budget objects
 * @param {string} filename - Optional filename
 */
export const exportBudgetsToCSV = (budgets, filename = 'budgets.csv') => {
  const headers = [
    { label: 'Category', key: 'category' },
    { label: 'Limit', key: 'limit' },
    { label: 'Spent', key: 'spent' },
    { label: 'Remaining', key: 'remaining' },
    { label: 'Percentage', key: 'percentage' },
    { label: 'Status', key: 'status' }
  ];

  const csvContent = convertToCSV(budgets, headers);
  downloadCSV(csvContent, filename);
};

/**
 * Export summary to CSV
 * @param {Object} summary - Summary object
 * @param {string} filename - Optional filename
 */
export const exportSummaryToCSV = (summary, filename = 'summary.csv') => {
  const data = [
    { label: 'Total Income', value: summary.totalIncome || 0 },
    { label: 'Total Expenses', value: summary.totalExpenses || 0 },
    { label: 'Balance', value: summary.balance || 0 },
    { label: 'Transaction Count', value: summary.transactionCount || 0 }
  ];

  const headers = [
    { label: 'Metric', key: 'label' },
    { label: 'Value', key: 'value' }
  ];

  const csvContent = convertToCSV(data, headers);
  downloadCSV(csvContent, filename);
};
