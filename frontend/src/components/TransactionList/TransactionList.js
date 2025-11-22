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
    if (filters.type && transaction.type !== filters.type) return false;
    if (filters.category && transaction.category !== filters.category) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return transaction.description.toLowerCase().includes(searchLower);
    }

    if (filters.startDate || filters.endDate) {
      const transactionDate = new Date(transaction.date);
      if (filters.startDate && transactionDate < new Date(filters.startDate)) return false;
      if (filters.endDate && transactionDate > new Date(filters.endDate)) return false;
    }

    return true;
  });

  
  

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
            {filters.type || filters.category || filters.search
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