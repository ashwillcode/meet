import React, { useState, useCallback, useRef, useEffect } from 'react';
import { getEvents, extractLocations } from '../api';

const CitySearch = ({ setCurrentCity, setInfoAlert, setErrorAlert }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setInfoAlert('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setInfoAlert]);

  const updateSuggestions = useCallback(async (value) => {
    try {
      if (value) {
        const events = await getEvents();
        const cities = extractLocations(events);
        const filteredCities = cities.filter(city =>
          city.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(filteredCities);
        
        if (filteredCities.length === 0) {
          setInfoAlert('No cities match your search. Please try another city.');
        } else {
          setInfoAlert('');
        }
      } else {
        setSuggestions([]);
        setInfoAlert('');
      }
      setErrorAlert('');
    } catch (error) {
      setErrorAlert('Error fetching city data. Please try again later.');
    }
  }, [setInfoAlert, setErrorAlert]);

  const handleInputChanged = useCallback(async (event) => {
    const value = event.target.value;
    setQuery(value);
    await updateSuggestions(value);
  }, [updateSuggestions]);

  const handleItemClicked = useCallback((city) => {
    setQuery(city);
    setShowSuggestions(false);
    setCurrentCity(city);
    setInfoAlert('');
    setErrorAlert('');
  }, [setCurrentCity, setInfoAlert, setErrorAlert]);

  return (
    <div id="city-search" ref={searchContainerRef}>
      <input
        type="text"
        placeholder="Search for a city"
        value={query}
        onChange={handleInputChanged}
        onFocus={() => setShowSuggestions(true)}
        className="city-search-input"
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