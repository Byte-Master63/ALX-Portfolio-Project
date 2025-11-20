import React, { useState } from 'react';
import { formatCurrency, capitalize } from '../../utils/format';
import { formatDate } from '../../utils/date';
import Button from '../Button/Button';
import TransactionEditModal from '../TransactionEditModal/TransactionEditModal';
import './TransactionItem.css';

function TransactionItem({ transaction, onDelete, onEdit }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      setIsDeleting(true);
      await onDelete(transaction.id);
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleSaveEdit = async (updatedData) => {
    const success = await onEdit(transaction.id, updatedData);
    if (success) {
      setShowEditModal(false);
    }
  };

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
      other: '📦',
      housing: '🏠',
      insurance: '🛡️',
      savings: '🏦',
      debt: '💳',
      fitness: '💪',
      gifts: '🎁',
      travel: '✈️',
      pets: '🐾',
      subscriptions: '📱',
      personal: '💇',
      housing: '🏠',
      insurance: '🛡️',
      savings: '🏦',
      debt: '💳',
      fitness: '💪',
      gifts: '🎁',
      travel: '✈️',
      pets: '🐾',
      subscriptions: '📱',
      personal: '💇'
    };
    return icons[category] || '💰';
  };

  return (
    <>
      <div className={`transaction-item ${transaction.type}`}>
        <div className="transaction-icon">
          {getCategoryIcon(transaction.category)}
        </div>
        
        <div className="transaction-details">
          <h4 className="transaction-description">{transaction.description}</h4>
          <div className="transaction-meta">
            <span className="transaction-category">{capitalize(transaction.category)}</span>
            <span className="transaction-date">{formatDate(transaction.date)}</span>
          </div>
        </div>
        
        <div className="transaction-right">
          <div className={`transaction-amount ${transaction.type}`}>
            {transaction.type === 'income' ? '+' : '-'}
            {formatCurrency(transaction.amount)}
          </div>
          
          <div className="transaction-actions">
            <Button
              variant="secondary"
              size="small"
              onClick={handleEdit}
              disabled={isDeleting}
            >
              ✏️
            </Button>
            <Button
              variant="danger"
              size="small"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? '...' : '🗑️'}
            </Button>
          </div>
        </div>
      </div>

      {showEditModal && (
        <TransactionEditModal
          transaction={transaction}
          onSave={handleSaveEdit}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  );
}

export default TransactionItem;