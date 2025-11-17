import React from 'react';
import { formatCurrency, capitalize, formatPercentage } from '../../utils/format';
import './CategoryChart.css';

function CategoryChart({ data, type = 'expense' }) {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="category-chart-empty">
        <p>No {type} data available</p>
      </div>
    );
  }

  // Convert to array and sort by amount
  const categories = Object.entries(data)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

  const total = categories.reduce((sum, cat) => sum + cat.amount, 0);

  const getColor = (index) => {
    const colors = type === 'expense'
      ? ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#00bcd4', '#009688']
      : ['#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#795548'];
    return colors[index % colors.length];
  };

  return (
    <div className="category-chart">
      <div className="category-bars">
        {categories.map((cat, index) => {
          const percentage = (cat.amount / total) * 100;
          return (
            <div key={cat.category} className="category-bar-item">
              <div className="category-bar-info">
                <span className="category-bar-name">{capitalize(cat.category)}</span>
                <span className="category-bar-amount">{formatCurrency(cat.amount)}</span>
              </div>
              <div className="category-bar-wrapper">
                <div 
                  className="category-bar-fill"
                  style={{ 
                    width: `${percentage}%`,
                    background: getColor(index)
                  }}
                />
                <span className="category-bar-percentage">{formatPercentage(percentage, 1)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CategoryChart;