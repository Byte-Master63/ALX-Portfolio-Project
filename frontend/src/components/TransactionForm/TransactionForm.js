import React, { useState, useContext, useEffect } from 'react';
import { FinanceContext } from '../../contexts/FinanceContext';
import { getCurrentDate } from '../../utils/date';
import Button from '../Button/Button';
import Alert from '../Alert/Alert';
import './TransactionForm.css';

// Match backend categories exactly
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

function TransactionForm() {
  const { createTransaction, loading } = useContext(FinanceContext);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    type: '',
    date: getCurrentDate()
  });
  const [alert, setAlert] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Auto-dismiss alerts after 5 seconds
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Reset category when type changes
    if (name === 'type') {
      setFormData(prev => ({ ...prev, [name]: value, category: '' }));
    } else if (name === 'amount') {
      // Validate amount: positive numbers with max 2 decimal places
      const numValue = parseFloat(value);
      if (value === '' || (!isNaN(numValue) && numValue >= 0)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    // Description validation
    if (!formData.description || formData.description.trim().length < 3) {
      setAlert({ type: 'error', message: 'Description must be at least 3 characters long' });
      return false;
    }

    // Amount validation
    const amount = parseFloat(formData.amount);
    if (!formData.amount || isNaN(amount) || amount <= 0) {
      setAlert({ type: 'error', message: 'Amount must be greater than 0' });
      return false;
    }

    // Check decimal places
    if (formData.amount.includes('.')) {
      const decimals = formData.amount.split('.')[1];
      if (decimals && decimals.length > 2) {
        setAlert({ type: 'error', message: 'Amount can have at most 2 decimal places' });
        return false;
      }
    }

    // Category validation
    if (!formData.category) {
      setAlert({ type: 'error', message: 'Please select a category' });
      return false;
    }

    // Type validation
    if (!formData.type) {
      setAlert({ type: 'error', message: 'Please select a type' });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setAlert(null);

    const result = await createTransaction({
      ...formData,
      amount: parseFloat(formData.amount) // Ensure it's a number
    });
    
    if (result.success) {
      setAlert({ type: 'success', message: 'Transaction added successfully!' });
      // Reset form
      setFormData({
        description: '',
        amount: '',
        category: '',
        type: '',
        date: getCurrentDate()
      });
    } else {
      setAlert({ 
        type: 'error', 
        message: result.message || 'Error adding transaction. Please try again.' 
      });
    }
    
    setSubmitting(false);
  };

  // Get categories based on selected type
  const availableCategories = formData.type ? CATEGORIES[formData.type] : [];

  return (
    <form onSubmit={handleSubmit} className="transaction-form">
      {alert && <Alert type={alert.type} message={alert.message} />}
      
      <div className="form-group">
        <label htmlFor="type">Type *</label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          disabled={submitting || loading}
        >
          <option value="">Select type first</option>
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
          disabled={!formData.type || submitting || loading}
        >
          <option value="">
            {formData.type ? 'Select a category' : 'Select type first'}
          </option>
          {availableCategories.map(cat => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
        {!formData.type && (
          <small className="form-hint">Please select a type first</small>
        )}
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
          placeholder="e.g., Grocery shopping"
          minLength="3"
          maxLength="200"
          disabled={submitting || loading}
        />
        <small className="form-hint">At least 3 characters</small>
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
          placeholder="0.00"
          disabled={submitting || loading}
        />
        <small className="form-hint">Enter amount in your currency</small>
      </div>
      
      <div className="form-group">
        <label htmlFor="date">Date *</label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          max={getCurrentDate()}
          required
          disabled={submitting || loading}
        />
      </div>
      
      <Button 
        type="submit" 
        variant="primary"
        disabled={submitting || loading}
      >
        {submitting ? 'Adding...' : 'Add Transaction'}
      </Button>
    </form>
  );
}

export default TransactionForm;