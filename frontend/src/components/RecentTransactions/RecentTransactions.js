import React from 'react';
import { formatCurrency, capitalize } from '../../utils/format';
import { formatDate } from '../../utils/date';
import './RecentTransactions.css';

function RecentTransactions({ transactions, limit = 5 }) {
  const recentTransactions = transactions.slice(0, limit);

  if (recentTransactions.length === 0) {
    return (
      <div className="recent-transactions-empty">
        <p>No recent transactions</p>
      </div>
    );
  }

  const getCategoryIcon = (category) => {
    const icons = {
      food: '🍔',
      transport: '🚗',
      entertainment: '🎬',
      utilities: '💡',
      healthcare: '⚕️',
      shopping: '🛍️',
      education: '📚',
      salary: '💼',
      freelance: '💻',
      investment: '📈',
      other: '📦'
    };
    return icons[category] || '💰';
  };

  return (
    <div className="recent-transactions">
      {recentTransactions.map(transaction => (
        <div key={transaction.id} className="recent-transaction-item">
          <div className="recent-transaction-icon">
            {getCategoryIcon(transaction.category)}
          </div>
          <div className="recent-transaction-details">
            <p className="recent-transaction-description">{transaction.description}</p>
            <p className="recent-transaction-meta">
              {capitalize(transaction.category)} • {formatDate(transaction.date)}
            </p>
          </div>
          <div className={`recent-transaction-amount ${transaction.type}`}>
            {transaction.type === 'income' ? '+' : '-'}
            {formatCurrency(transaction.amount)}
          </div>
        </div>
      ))}
    </div>
  );
}

export default RecentTransactions;