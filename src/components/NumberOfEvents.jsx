import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

const NumberOfEvents = ({ numberOfEvents = 32, onNumberChange }) => {
  const [value, setValue] = useState(numberOfEvents);
  const [error, setError] = useState('');

  const handleInputChange = useCallback((event) => {
    const rawValue = event.target.value;
    let newValue = parseInt(rawValue, 10);
    
    // Handle invalid input
    if (isNaN(newValue)) {
      setValue(0);
      setError('Please enter a valid number');
      return;
    }

    // Check for negative sign in raw input to handle negative numbers properly
    if (rawValue.startsWith('-')) {
      newValue = 0;
      setError('Number cannot be negative');
    } else if (newValue > 1000) {
      newValue = 1000;
      setError('Please enter a number between 1 and 1000');
    } else {
      setError('');
    }

    // Update value and call onChange handler
    setValue(newValue);
    if (onNumberChange) {
      onNumberChange(newValue);
    }
  }, [onNumberChange]);

  return (
    <div className="number-of-events" id="number-of-events">
      <label 
        htmlFor="number-of-events-input"
        className="visually-hidden"
      >
        Number of events to display
      </label>
      <input
        id="number-of-events-input"
        type="number"
        className="events-number"
        value={value}
        onChange={handleInputChange}
        min="0"
        max="1000"
        aria-label="Number of events to display"
        aria-invalid={!!error}
        aria-describedby={error ? "number-of-events-error" : undefined}
      />
      {error && (
        <div 
          id="number-of-events-error"
          className="error-message"
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  );
};

NumberOfEvents.propTypes = {
  numberOfEvents: PropTypes.number,
  onNumberChange: PropTypes.func
};

export default NumberOfEvents; 