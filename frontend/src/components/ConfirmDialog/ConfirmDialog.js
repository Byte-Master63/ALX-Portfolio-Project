
import React from 'react';

import Button from '../Button/Button';

import './ConfirmDialog.css';

function ConfirmDialog({ 

  isOpen, 

  title, 

  message, 

  confirmText = 'Confirm',

  cancelText = 'Cancel',

  onConfirm, 

  onCancel,

  variant = 'danger' // danger, warning, info

}) {

  if (!isOpen) return null;

  return (

    <div className="confirm-overlay" onClick={onCancel}>

      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>

        <div className={`confirm-icon ${variant}`}>

          {variant === 'danger' && '⚠️'}

          {variant === 'warning' && '❗'}

          {variant === 'info' && 'ℹ️'}

        </div>

        

        <h3 className="confirm-title">{title}</h3>

        <p className="confirm-message">{message}</p>

        

        <div className="confirm-actions">

          <Button variant="secondary" onClick={onCancel}>

            {cancelText}

          </Button>

          <Button variant={variant} onClick={onConfirm}>

            {confirmText}

          </Button>

        </div>

      </div>

    </div>

  );

}

export default ConfirmDialog;

