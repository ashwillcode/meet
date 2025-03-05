import React, { useState } from 'react';

const NumberOfEvents = ({ updateEvents }) => {
  const [number, setNumber] = useState('32');

  const handleInputChanged = (event) => {
    const value = event.target.value;
    setNumber(value);
  };

  return (
    <div id="number-of-events">
      <label htmlFor="number-of-events-input">Number of Events: </label>
      <input
        type="text"
        id="number-of-events-input"
        value={number}
        onChange={handleInputChanged}
      />
    </div>
  );
};

export default NumberOfEvents; 