import React, { useState } from 'react';
import TransactionItem from '../TransactionItem/TransactionItem';
import TransactionFilter from '../TransactionFilter/TransactionFilter';
import ExportButton from '../ExportButton/ExportButton';
import { exportTransactionsToCSV } from '../../utils/export';
import './TransactionList.css';

function TransactionList({ transactions, onDelete, onEdit }) {
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    search: '',
    startDate: '',
    endDate: ''
  });

  // Apply filters
  const filteredTransactions = transactions.filter(transaction => {
    // Type filter
    if (filters.type && transaction.type !== filters.type) return false;
    
    // Category filter
    if (filters.category && transaction.category !== filters.category) return false;
    
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return transaction.description.toLowerCase().includes(searchLower);
    }
    
    // Date range filter
    if (filters.startDate || filters.endDate) {
      const transactionDate = new Date(transaction.date);
      if (filters.startDate && transactionDate < new Date(filters.startDate)) return false;
      if (filters.endDate && transactionDate > new Date(filters.endDate)) return false;
    }
    
    return true;
  });

  // Export handler
  const handleExport = () => {
    const dataToExport = filteredTransactions.map(t => ({
      date: t.date,
      description: t.description,
      category: t.category,
      type: t.type,
      amount: t.amount
    }));

    const timestamp = new Date().toISOString().split('T')[0];
    exportTransactionsToCSV(dataToExport, `transactions-${timestamp}.csv`);
  };

  return (
    <div className="transaction-list-container">
      <div className="transaction-list-header">
        <ExportButton 
          onExport={handleExport}
          disabled={filteredTransactions.length === 0}
        >
          Export to CSV
        </ExportButton>
      </div>

      <TransactionFilter filters={filters} onFilterChange={setFilters} />
      
      {filteredTransactions.length === 0 ? (
        <div className="empty-state">
          <p className="empty-icon">📭</p>
          <p className="empty-text">No transactions found</p>
          <p className="empty-subtext">
            {filters.type || filters.category || filters.search || filters.startDate || filters.endDate
              ? 'Try adjusting your filters'
              : 'Start by adding your first transaction'}
          </p>
        </div>
      ) : (
        <div className="transaction-list">
          {filteredTransactions.map(transaction => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
      
      {filteredTransactions.length > 0 && (
        <div className="transaction-summary">
          <p>Showing {filteredTransactions.length} of {transactions.length} transactions</p>
        </div>
      )}
    </div>
  );
}

export default TransactionList;
