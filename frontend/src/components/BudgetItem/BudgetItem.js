import React, { useState } from 'react';
import { formatCurrency, capitalize, formatPercentage } from '../../utils/format';
import Button from '../Button/Button';
import BudgetEditModal from '../BudgetEditModal/BudgetEditModal';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';
import './BudgetItem.css';

function BudgetItem({ budget, onDelete, onEdit }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Calculate from budgetStatus in summary
  const spent = budget.spent || 0;
  const remaining = budget.remaining || budget.limit;
  const percentage = budget.percentage || 0;
  const status = budget.status || 'good';

const handleDelete = () => {
  setShowDeleteConfirm(true);
};

const confirmDelete = async () => {
  setShowDeleteConfirm(false);
  setIsDeleting(true);
  await onDelete(budget.id);
  setIsDeleting(false);
};

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleSaveEdit = async (updatedData) => {
    const success = await onEdit(budget.id, updatedData);
    if (success) {
      setShowEditModal(false);
    }
  };

  const getStatusColor = () => {
    if (status === 'exceeded') return '#f44336';
    if (status === 'warning') return '#ff9800';
    return '#4caf50';
  };

  return (
    <>
      <div className="budget-item">
        <div className="budget-header">
          <h4 className="budget-category">{capitalize(budget.category)}</h4>
          <div className="budget-actions">
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

        <div className="budget-progress">
          <div className="budget-progress-bar">
            <div 
              className="budget-progress-fill"
              style={{ 
                width: `${Math.min(percentage, 100)}%`,
                background: getStatusColor()
              }}
            />
          </div>
          <span className="budget-percentage" style={{ color: getStatusColor() }}>
            {formatPercentage(percentage, 1)}
          </span>
        </div>

        <div className="budget-details">
          <div className="budget-stat">
            <span className="budget-label">Spent</span>
            <span className="budget-value spent">{formatCurrency(spent)}</span>
          </div>
          <div className="budget-stat">
            <span className="budget-label">Limit</span>
            <span className="budget-value">{formatCurrency(budget.limit)}</span>
          </div>
          <div className="budget-stat">
            <span className="budget-label">Remaining</span>
            <span className="budget-value remaining" style={{ color: getStatusColor() }}>
              {formatCurrency(remaining)}
            </span>
          </div>
        </div>

        {status === 'exceeded' && (
          <div className="budget-alert">
            ⚠️ Budget exceeded by {formatCurrency(Math.abs(remaining))}
          </div>
        )}
        {status === 'warning' && (
          <div className="budget-warning">
            ⚠️ Approaching budget limit
          </div>
        )}
      </div>

      {showEditModal && (
        <BudgetEditModal
          budget={budget}
          onSave={handleSaveEdit}
          onClose={() => setShowEditModal(false)}
        />
      )}

      <ConfirmDialog
  isOpen={showDeleteConfirm}
  title="Delete Budget"
  message={`Are you sure you want to delete the budget for ${capitalize(budget.category)}?`}
  confirmText="Delete"
  cancelText="Cancel"
  variant="danger"
  onConfirm={confirmDelete}
  onCancel={() => setShowDeleteConfirm(false)}
/>
    </>
  );
}

export default BudgetItem;