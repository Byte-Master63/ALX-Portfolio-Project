import React, { useState, useContext, useEffect } from 'react';
import { FinanceContext } from '../../contexts/FinanceContext';
import Button from '../Button/Button';
import Alert from '../Alert/Alert';
import './BudgetForm.css';

const EXPENSE_CATEGORIES = [
  { value: 'food', label: '🍔 Food & Dining' },
  { value: 'transport', label: '🚗 Transportation' },
  { value: 'entertainment', label: '🎬 Entertainment' },
  { value: 'utilities', label: '💡 Utilities' },
  { value: 'healthcare', label: '⚕️ Healthcare' },
  { value: 'shopping', label: '🛍️ Shopping' },
  { value: 'education', label: '📚 Education' },
  { value: 'housing', label: '🏠 Housing & Rent' },
  { value: 'insurance', label: '🛡️ Insurance' },
  { value: 'debt', label: '💳 Debt & Loans' },
  { value: 'fitness', label: '💪 Fitness & Sports' },
  { value: 'gifts', label: '🎁 Gifts & Donations' },
  { value: 'travel', label: '✈️ Travel' },
  { value: 'pets', label: '🐾 Pets' },
  { value: 'subscriptions', label: '📱 Subscriptions' },
  { value: 'personal', label: '💇 Personal Care' },
  { value: 'other', label: '📦 Other' }
];

function BudgetForm() {
  const { createBudget, budgets, loading } = useContext(FinanceContext);
  const [formData, setFormData] = useState({
    category: '',
    limit: ''
  });
  const [alert, setAlert] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Auto-dismiss alerts
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // Get categories that don't have budgets yet
  const availableCategories = EXPENSE_CATEGORIES.filter(
    cat => !budgets.find(b => b.category === cat.value)
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.category || !formData.limit) {
      setAlert({ type: 'error', message: 'Please fill in all fields' });
      return;
    }

    const limit = parseFloat(formData.limit);
    if (isNaN(limit) || limit <= 0) {
      setAlert({ type: 'error', message: 'Limit must be greater than 0' });
      return;
    }

    setSubmitting(true);
    setAlert(null);

    const result = await createBudget({
      category: formData.category,
      limit: limit
    });

    if (result.success) {
      setAlert({ type: 'success', message: 'Budget created successfully!' });
      setFormData({ category: '', limit: '' });
    } else {
      setAlert({ 
        type: 'error', 
        message: result.message || 'Error creating budget' 
      });
    }
    
    setSubmitting(false);
  };

  if (availableCategories.length === 0) {
    return (
      <div className="budget-form-empty">
        <p>✅ You have set budgets for all categories!</p>
        <p className="budget-form-hint">
          You can edit existing budgets from the list below.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="budget-form">
      {alert && <Alert type={alert.type} message={alert.message} />}

      <div className="form-group">
        <label htmlFor="category">Category *</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          disabled={submitting || loading}
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
          placeholder="0.00"
          disabled={submitting || loading}
        />
        <small className="form-hint">Set your spending limit for this category</small>
      </div>

      <Button 
        type="submit" 
        variant="primary"
        disabled={submitting || loading}
        fullWidth
      >
        {submitting ? 'Creating...' : 'Create Budget'}
      </Button>
    </form>
  );
}

export default BudgetForm;