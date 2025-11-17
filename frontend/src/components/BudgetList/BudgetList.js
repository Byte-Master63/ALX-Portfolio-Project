import React from 'react';
import BudgetItem from '../BudgetItem/BudgetItem';
import './BudgetList.css';

function BudgetList({ budgets, onDelete, onEdit }) {
  if (budgets.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-icon">📊</p>
        <p className="empty-text">No budgets set</p>
        <p className="empty-subtext">Create your first budget to track spending</p>
      </div>
    );
  }

  return (
    <div className="budget-list">
      {budgets.map(budget => (
        <BudgetItem
          key={budget.id}
          budget={budget}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}

export default BudgetList;