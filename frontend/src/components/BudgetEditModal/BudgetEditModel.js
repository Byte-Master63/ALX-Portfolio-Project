import React, { useState } from 'react';
import Button from '../Button/Button';
import Alert from '../Alert/Alert';
import { capitalize } from '../../utils/format';
import '../TransactionEditModal/TransactionEditModal.css';

function BudgetEditModal({ budget, onSave, onClose }) {
  const [formData, setFormData] = useState({
    category: budget.category,
    limit: budget.limit
  });
  const [alert, setAlert] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setAlert(null);

    const success = await onSave({
      category: formData.category,
      limit: parseFloat(formData.limit)
    });
    
    if (!success) {
      setAlert({ type: 'error', message: 'Failed to update budget' });
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Budget</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {alert && <Alert type={alert.type} message={alert.message} />}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input
              type="text"
              id="category"
              name="category"
              value={capitalize(formData.category)}
              disabled
              style={{ background: '#f5f5f5', cursor: 'not-allowed' }}
            />
            <small className="form-hint">Category cannot be changed</small>
          </div>

          <div className="form-group">
            <label htmlFor="limit">Monthly Limit *</label>
            <input
              type="number"
              id="limit"
              name="limit"
              value={formData.limit}
              onChange={handleChange}
              step="0.01"
              min="0.01"
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

export default BudgetEditModal;