import React from 'react';
import './TransactionFilter.css';

const CATEGORIES = [
  { value: 'food', label: 'Food' },
  { value: 'transport', label: 'Transport' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'education', label: 'Education' },
  { value: 'salary', label: 'Salary' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'investment', label: 'Investment' },
  { value: 'other', label: 'Other' }
];

function TransactionFilter({ filters, onFilterChange }) {
  const handleChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value });
  };

  const handleClearFilters = () => {
    onFilterChange({ type: '', category: '', search: '' });
  };

  const hasActiveFilters = filters.type || filters.category || filters.search;

  return (
    <div className="transaction-filter">
      <div className="filter-inputs">
        <input
          type="text"
          placeholder="Search transactions..."
          value={filters.search}
          onChange={(e) => handleChange('search', e.target.value)}
          className="filter-search"
        />
        
        <select
          value={filters.type}
          onChange={(e) => handleChange('type', e.target.value)}
          className="filter-select"
        >
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        
        <select
          value={filters.category}
          onChange={(e) => handleChange('category', e.target.value)}
          className="filter-select"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>
      
      {hasActiveFilters && (
        <button className="filter-clear" onClick={handleClearFilters}>
          Clear Filters
        </button>
      )}
    </div>
  );
}

export default TransactionFilter;