import React from 'react';
import './LoadingSpinner.css';

function LoadingSpinner({ size = 'medium', message = '' }) {
  return (
    <div className={`spinner-container spinner-${size}`}>
      <div className="spinner"></div>
      {message && <p className="spinner-message">{message}</p>}
    </div>
  );
}

export default LoadingSpinner;
