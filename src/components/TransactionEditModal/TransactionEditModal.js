import React, { useState } from 'react';
import Button from '../Button/Button';
import Alert from '../Alert/Alert';
import './TransactionEditModal.css';

const CATEGORIES = {
  expense: [
    { value: 'food', label: 'Food & Dining' },
    { value: 'transport', label: 'Transportation' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'education', label: 'Education' },
    { value: 'other', label: 'Other' }
  ],
  income: [
    { value: 'salary', label: 'Salary' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'investment', label: 'Investment' },
    { value: 'other', label: 'Other' }
  ]
};

function TransactionEditModal({ transaction, onSave, onClose }) {
  const [formData, setFormData] = useState({
    description: transaction.description,
    amount: transaction.amount,
    category: transaction.category,
    type: transaction.type,
    date: transaction.date
  });
  const [alert, setAlert] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'type') {
      setFormData(prev => ({ ...prev, [name]: value, category: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setAlert(null);

    const success = await onSave(formData);
    
    if (!success) {
      setAlert({ type: 'error', message: 'Failed to update transaction' });
      setSaving(false);
    }
  };

  const availableCategories = formData.type ? CATEGORIES[formData.type] : [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Transaction</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {alert && <Alert type={alert.type} message={alert.message} />}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="type">Type *</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              disabled={saving}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              disabled={saving}
            >
              <option value="">Select a category</option>
              {availableCategories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              minLength="3"
              maxLength="200"
              disabled={saving}
            />
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount *</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              min="0.01"
              required
              disabled={saving}
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Date *</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              disabled={saving}
            />
          </div>

          <div className="modal-actions">
            <Button type="button" variant="secondary" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TransactionEditModal;