import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { FinanceProvider } from './contexts/FinanceContext';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <FinanceProvider>
        <App />
      </FinanceProvider>
    </ErrorBoundary>
  </React.StrictMode>
);