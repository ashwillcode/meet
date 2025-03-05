import React, { useState } from 'react';

const CitySearch = () => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  return (
    <div id="city-search">
      <input
        type="text"
        placeholder="Search for a city"
        onFocus={() => setShowSuggestions(true)}
      />
      {showSuggestions && (
        <ul className="suggestions">
          <li>Suggestion 1</li>
          <li>Suggestion 2</li>
          <li>Suggestion 3</li>
        </ul>
      )}
    </div>
  );
};

export default CitySearch; 