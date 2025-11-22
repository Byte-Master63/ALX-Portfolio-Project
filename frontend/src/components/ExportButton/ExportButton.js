
import React, { useState } from 'react';

import Button from '../Button/Button';

import './ExportButton.css';

function ExportButton({ onExport, disabled = false, children = 'Export' }) {

  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {

    setExporting(true);

    try {

      await onExport();

    } catch (error) {

      console.error('Export error:', error);

    } finally {

      setTimeout(() => setExporting(false), 1000);

    }

  };

  return (

    <Button

      variant="secondary"

      onClick={handleExport}

      disabled={disabled || exporting}

      icon={exporting ? '⏳' : '📥'}

    >

      {exporting ? 'Exporting...' : children}

    </Button>

  );

}

export default ExportButton;

