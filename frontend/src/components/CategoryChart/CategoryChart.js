import React from 'react';
import { formatCurrency, capitalize, formatPercentage } from '../../utils/format';
import './CategoryChart.css';

function useTheme() {
  const [theme, setTheme] = React.useState(document.documentElement.getAttribute('data-theme') || 'light');
  React.useEffect(() => {
    const observer = new MutationObserver(() => setTheme(document.documentElement.getAttribute('data-theme')));
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);
  return theme;
}

function CategoryChart({ data, type='expense' }) {
  const theme = useTheme();

  if (!data || Object.keys(data).length===0) return <div className="category-chart-empty"><p>No {type} data available</p></div>;

  const categories = Object.entries(data).map(([category, amount]) => ({category, amount}))
    .sort((a,b)=>b.amount-a.amount);
  const total = categories.reduce((sum, cat)=>sum+cat.amount,0);

  const getColor = index => {
    const colorsLight = type==='expense' ? ['#f44336','#e91e63','#9c27b0','#673ab7','#3f51b5','#2196f3','#00bcd4','#009688'] :
      ['#4caf50','#8bc34a','#cddc39','#ffeb3b','#ffc107','#ff9800','#ff5722','#795548'];
    const colorsDark = type==='expense' ? ['#ff6b6b','#ff4d94','#ba68c8','#9575cd','#5c6bc0','#42a5f5','#26c6da','#26a69a'] :
      ['#28a745','#7cb342','#cddc39','#fdd835','#ffb300','#ff7043','#ff5252','#8d6e63'];
    return theme==='dark' ? colorsDark[index % colorsDark.length] : colorsLight[index % colorsLight.length];
  };

  return (
    <div className="category-chart">
      <div className="category-bars">
        {categories.map((cat,index)=>{
          const percentage = (cat.amount/total)*100;
          return (
            <div key={cat.category} className="category-bar-item">
              <div className="category-bar-info">
                <span className="category-bar-name">{capitalize(cat.category)}</span>
                <span className="category-bar-amount">{formatCurrency(cat.amount)}</span>
              </div>
              <div className="category-bar-wrapper">
                <div className="category-bar-fill" style={{width:`${percentage}%`, backgroundColor:getColor(index)}} />
                <span className="category-bar-percentage">{formatPercentage(percentage,1)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CategoryChart;

