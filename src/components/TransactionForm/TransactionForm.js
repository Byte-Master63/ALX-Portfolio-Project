import React, { useState, useContext } from 'react';
import { FinanceContext } from '../../contexts/FinanceContext';
import { getCurrentDate } from '../../utils/date';
import Button from '../Button/Button';
import Alert from '../Alert/Alert';
import './TransactionForm.css';

function TransactionForm() {
  const { createTransaction } = useContext(FinanceContext);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    type: '',
    date: getCurrentDate()
  });
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await createTransaction(formData);
    
    if (result.success) {
      setAlert({ type: 'success', message: 'Transaction added successfully!' });
      setFormData({
        description: '',
        amount: '',
        category: '',
        type: '',
        date: getCurrentDate()
      });
    } else {
      setAlert({ type: 'error', message: result.message || 'Error adding transaction' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {alert && <Alert type={alert.type} message={alert.message} />}
      
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          placeholder="e.g., Grocery shopping"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="amount">Amount</label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          step="0.01"
          required
          placeholder="0.00"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select a category</option>
          <option value="Food & Dining">Food & Dining</option>
          <option value="Transportation">Transportation</option>
          <option value="Shopping">Shopping</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Bills & Utilities">Bills & Utilities</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Education">Education</option>
          <option value="Travel">Travel</option>
          <option value="Income">Income</option>
          <option value="Other">Other</option>
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="type">Type</label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
        >
          <option value="">Select type</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="date">Date</label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>
      
      <Button type="submit" variant="primary">
        Add Transaction
      </Button>
    </form>
  );
}

export default TransactionForm;
