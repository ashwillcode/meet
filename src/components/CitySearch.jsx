import React, { useState, useCallback } from 'react';
import { getEvents, extractLocations } from '../api';

const CitySearch = ({ setCurrentCity }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const updateSuggestions = useCallback(async (value) => {
    if (value) {
      const events = await getEvents();
      const cities = extractLocations(events);
      const filteredCities = cities.filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredCities);
    } else {
      setSuggestions([]);
    }
  }, []);

  const handleInputChanged = useCallback(async (event) => {
    const value = event.target.value;
    setQuery(value);
    await updateSuggestions(value);
  }, [updateSuggestions]);

  const handleItemClicked = useCallback((city) => {
    setQuery(city);
    setShowSuggestions(false);
    setCurrentCity(city);
  }, [setCurrentCity]);

  return (
    <div id="city-search">
      <input
        type="text"
        placeholder="Search for a city"
        value={query}
        onChange={handleInputChanged}
        onFocus={() => setShowSuggestions(true)}
      />
      {showSuggestions && (
        <ul className="suggestions">
          {suggestions.length > 0 ? (
            <>
              {suggestions.map((city) => (
                <li key={city} onClick={() => handleItemClicked(city)}>
                  {city}
                </li>
              ))}
              <li key="all" onClick={() => handleItemClicked("See all cities")}>
                <b>See all cities</b>
              </li>
            </>
          ) : (
            <li>No cities found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default CitySearch; 