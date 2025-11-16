import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { FinanceProvider } from './contexts/FinanceContext';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <FinanceProvider>
            <App />
          </FinanceProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  </React.StrictMode>
);