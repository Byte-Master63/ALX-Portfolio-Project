import React from 'react';
import { formatCurrency } from '../../utils/format';
import './SummaryCards.css';

function SummaryCards({ summary }) {
  const { totalIncome = 0, totalExpenses = 0, balance = 0 } = summary;

  return (
    <div className="summary-cards">
      <div className="summary-card income">
        <div className="summary-icon">📈</div>
        <div className="summary-info">
          <p className="summary-label">Total Income</p>
          <h3 className="summary-value">{formatCurrency(totalIncome)}</h3>
        </div>
      </div>

      <div className="summary-card expense">
        <div className="summary-icon">📉</div>
        <div className="summary-info">
          <p className="summary-label">Total Expenses</p>
          <h3 className="summary-value">{formatCurrency(totalExpenses)}</h3>
        </div>
      </div>

      <div className="summary-card balance">
        <div className="summary-icon">💰</div>
        <div className="summary-info">
          <p className="summary-label">Balance</p>
          <h3 className={`summary-value ${balance >= 0 ? 'positive' : 'negative'}`}>
            {formatCurrency(balance)}
          </h3>
        </div>
      </div>
    </div>
  );
}

export default SummaryCards;