import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

const CitySearch = ({ allLocations = [], onCitySelect }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [focusedOptionIndex, setFocusedOptionIndex] = useState(-1);

  const handleInputChanged = useCallback((event) => {
    const value = event.target.value;
    const filteredLocations = value
      ? allLocations.filter((location) => 
          location.toUpperCase().includes(value.toUpperCase())
        )
      : allLocations;

    setQuery(value);
    setSuggestions(filteredLocations);
    setShowSuggestions(true);
    setFocusedOptionIndex(-1);
  }, [allLocations]);

  const handleItemClicked = useCallback((suggestion) => {
    const cityName = suggestion ? suggestion.split(',')[0].trim() : '';
    setQuery(cityName);
    setShowSuggestions(false);
    setFocusedOptionIndex(-1);
    onCitySelect(cityName);
  }, [onCitySelect]);

  const handleKeyDown = useCallback((event) => {
    if (!showSuggestions) return;

    switch (event.key) {
      case 'Escape':
        setShowSuggestions(false);
        setFocusedOptionIndex(-1);
        break;
      case 'ArrowDown':
        event.preventDefault();
        setFocusedOptionIndex(prev => 
          prev < suggestions.length ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedOptionIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        if (focusedOptionIndex >= 0) {
          handleItemClicked(suggestions[focusedOptionIndex]);
        }
        break;
      default:
        break;
    }
  }, [showSuggestions, suggestions, focusedOptionIndex, handleItemClicked]);

  return (
    <div 
      id="city-search"
      role="combobox"
      aria-expanded={showSuggestions}
      aria-haspopup="listbox"
      aria-controls="city-suggestions"
    >
      <input
        type="text"
        className="city"
        placeholder="Search for a city"
        value={query}
        aria-label="Enter a city"
        aria-expanded={showSuggestions}
        aria-autocomplete="list"
        aria-controls="city-suggestions"
        onFocus={() => setShowSuggestions(true)}
        onChange={handleInputChanged}
        onKeyDown={handleKeyDown}
      />
      {showSuggestions && (
        <ul 
          id="city-suggestions"
          className="suggestions"
          role="listbox"
          aria-label="suggestions"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion}
              role="option"
              aria-selected={index === focusedOptionIndex}
              tabIndex={index === focusedOptionIndex ? 0 : -1}
              onClick={() => handleItemClicked(suggestion)}
            >
              {suggestion}
            </li>
          ))}
          <li
            key="see-all-cities"
            role="option"
            onClick={() => handleItemClicked('')}
          >
            <b>See all cities</b>
          </li>
        </ul>
      )}
    </div>
  );
};

CitySearch.propTypes = {
  allLocations: PropTypes.arrayOf(PropTypes.string),
  onCitySelect: PropTypes.func
};

export default CitySearch; 