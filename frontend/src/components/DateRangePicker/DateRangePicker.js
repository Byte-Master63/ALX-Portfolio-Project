
import React from 'react';

import { getCurrentDate } from '../../utils/date';

import './DateRangePicker.css';

function DateRangePicker({ startDate, endDate, onStartDateChange, onEndDateChange, onClear }) {

  const handleStartChange = (e) => {

    onStartDateChange(e.target.value);

  };

  const handleEndChange = (e) => {

    onEndDateChange(e.target.value);

  };

  const hasDateRange = startDate || endDate;

  return (

    <div className="date-range-picker">

      <div className="date-inputs">

        <div className="date-input-group">

          <label htmlFor="startDate">From</label>

          <input

            type="date"

            id="startDate"

            value={startDate || ''}

            onChange={handleStartChange}

            max={endDate || getCurrentDate()}

          />

        </div>

        <div className="date-input-group">

          <label htmlFor="endDate">To</label>

          <input

            type="date"

            id="endDate"

            value={endDate || ''}

            onChange={handleEndChange}

            min={startDate || ''}

            max={getCurrentDate()}

          />

        </div>

      </div>

      {hasDateRange && (

        <button className="clear-dates-btn" onClick={onClear} title="Clear date range">

          ✕ Clear

        </button>

      )}

    </div>

  );

}

export default DateRangePicker;

