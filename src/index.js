import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { FinanceProvider } from './contexts/FinanceContext';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <FinanceProvider>
      <App />
    </FinanceProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
