import { useState } from 'react';
import PropTypes from 'prop-types';

const NumberOfEvents = ({ numberOfEvents = 32, onNumberChange, setErrorAlert }) => {
  const [number, setNumber] = useState(numberOfEvents.toString());
  const [error, setError] = useState('');

  const handleInputChanged = (event) => {
    const value = event.target.value;
    setNumber(value);

    // Validate input
    if (value === '') {
      setError('Number is required');
      setErrorAlert && setErrorAlert('Number is required');
      return;
    }

    const parsedValue = parseInt(value, 10);
    if (isNaN(parsedValue)) {
      setError('Please enter a valid number');
      setErrorAlert && setErrorAlert('Please enter a valid number');
      return;
    }

    if (parsedValue <= 0) {
      setError('Number must be greater than 0');
      setErrorAlert && setErrorAlert('Number must be greater than 0');
      return;
    }

    setError('');
    setErrorAlert && setErrorAlert('');
    onNumberChange && onNumberChange(parsedValue);
  };

  return (
    <div 
      className="number-of-events"
      role="region" 
      aria-label="Number of events to display"
    >
      <label htmlFor="number-of-events-input">
        Number of Events:
      </label>
      <input
        type="number"
        id="number-of-events-input"
        value={number}
        onChange={handleInputChanged}
        className="number-of-events-input"
        min="1"
        aria-describedby={error ? "number-of-events-error" : undefined}
        data-testid="number-of-events-input"
      />
      {error && (
        <div 
          id="number-of-events-error" 
          className="error" 
          role="alert"
          data-testid="error-alert"
        >
          {error}
        </div>
      )}
    </div>
  );
};

NumberOfEvents.propTypes = {
  numberOfEvents: PropTypes.number,
  onNumberChange: PropTypes.func,
  setErrorAlert: PropTypes.func
};

export default NumberOfEvents; 