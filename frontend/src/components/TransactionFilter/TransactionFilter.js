import React from 'react';
import DateRangePicker from '../DateRangePicker/DateRangePicker';
import './TransactionFilter.css';

const CATEGORIES = [
  { value: 'food', label: '🍔 Food & Dining' },
  { value: 'transport', label: '🚗 Transportation' },
  { value: 'entertainment', label: '🎬 Entertainment' },
  { value: 'utilities', label: '💡 Utilities' },
  { value: 'healthcare', label: '⚕️ Healthcare' },
  { value: 'shopping', label: '🛍️ Shopping' },
  { value: 'education', label: '📚 Education' },
  { value: 'housing', label: '🏠 Housing' },
  { value: 'insurance', label: '🛡️ Insurance' },
  { value: 'debt', label: '💳 Debt' },
  { value: 'fitness', label: '💪 Fitness' },
  { value: 'gifts', label: '🎁 Gifts' },
  { value: 'travel', label: '✈️ Travel' },
  { value: 'pets', label: '🐾 Pets' },
  { value: 'subscriptions', label: '📱 Subscriptions' },
  { value: 'personal', label: '💇 Personal Care' },
  { value: 'salary', label: '💼 Salary' },
  { value: 'freelance', label: '💻 Freelance' },
  { value: 'investment', label: '📈 Investment' },
  { value: 'savings', label: '🏦 Savings' },
  { value: 'other', label: '📦 Other' }
];

function TransactionFilter({ filters, onFilterChange }) {
  const handleChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value });
  };

  const handleClearFilters = () => {
    onFilterChange({ type: '', category: '', search: '', startDate: '', endDate: '' });
  };

  const handleClearDates = () => {
    onFilterChange({ ...filters, startDate: '', endDate: '' });
  };

  const hasActiveFilters = filters.type || filters.category || filters.search || filters.startDate || filters.endDate;

  return (
    <div className="transaction-filter">
      <div className="filter-row">
        <input
          type="text"
          placeholder="🔍 Search transactions..."
          value={filters.search || ''}
          onChange={(e) => handleChange('search', e.target.value)}
          className="filter-search"
        />
        
        <select
          value={filters.type || ''}
          onChange={(e) => handleChange('type', e.target.value)}
          className="filter-select"
        >
          <option value="">All Types</option>
          <option value="income">💰 Income</option>
          <option value="expense">💸 Expense</option>
        </select>
        
        <select
          value={filters.category || ''}
          onChange={(e) => handleChange('category', e.target.value)}
          className="filter-select"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>

      <div className="filter-row">
        <DateRangePicker
          startDate={filters.startDate || ''}
          endDate={filters.endDate || ''}
          onStartDateChange={(date) => handleChange('startDate', date)}
          onEndDateChange={(date) => handleChange('endDate', date)}
          onClear={handleClearDates}
        />
      </div>
      
      {hasActiveFilters && (
        <button className="filter-clear" onClick={handleClearFilters}>
          ✕ Clear All Filters
        </button>
      )}
    </div>
  );
}

export default TransactionFilter;