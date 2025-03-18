import React, { useState, useEffect, useCallback } from 'react'
import CitySearch from './components/CitySearch'
import EventList from './components/EventList'
import NumberOfEvents from './components/NumberOfEvents'
import InstallPrompt from './components/InstallPrompt'
import { InfoAlert, ErrorAlert, WarningAlert } from './components/Alert'
import { getEvents } from './api'
import './App.css'

const App = () => {
  const [events, setEvents] = useState([])
  const [currentCity, setCurrentCity] = useState("See all cities")
  const [numberOfEvents, setNumberOfEvents] = useState(32)
  const [allEvents, setAllEvents] = useState([])
  const [infoAlert, setInfoAlert] = useState("")
  const [errorAlert, setErrorAlert] = useState("")
  const [warningAlert, setWarningAlert] = useState("")

  const fetchInitialEvents = useCallback(async () => {
    try {
      let fetchedEvents;
      if (navigator.onLine) {
        // If online, fetch from API
        fetchedEvents = await getEvents();
        // Store in localStorage
        localStorage.setItem('lastEvents', JSON.stringify(fetchedEvents));
        setWarningAlert(""); // Clear any offline warning
      } else {
        // If offline, get from localStorage
        const cachedEvents = localStorage.getItem('lastEvents');
        fetchedEvents = cachedEvents ? JSON.parse(cachedEvents) : [];
        setWarningAlert("You are offline. The event list may not be up to date.");
      }
      setAllEvents(fetchedEvents);
    } catch (error) {
      setErrorAlert("Error loading events. Please try again later.");
      console.error('Error fetching events:', error);
    }
  }, []);

  const filterEvents = useCallback(() => {
    let filteredEvents = currentCity === "See all cities"
      ? [...allEvents]
      : allEvents.filter(event => event.location === currentCity)
    
    // Apply numberOfEvents limit
    filteredEvents = filteredEvents.slice(0, numberOfEvents)
    setEvents(filteredEvents)
  }, [currentCity, allEvents, numberOfEvents])

  // Check online status and fetch events
  useEffect(() => {
    const handleOnlineStatus = () => {
      if (navigator.onLine) {
        setWarningAlert("");
        fetchInitialEvents();
      } else {
        setWarningAlert("You are offline. The event list may not be up to date.");
      }
    };

    // Add event listeners for online/offline status
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    // Initial fetch
    fetchInitialEvents();

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, [fetchInitialEvents]);

  // Filter events when dependencies change
  useEffect(() => {
    filterEvents()
  }, [filterEvents])

  const handleNumberOfEvents = (value) => {
    setNumberOfEvents(value)
  }

  return (
    <div className="App">
      <h1 className="app-title">Meet<span>App</span></h1>
      <InstallPrompt />
      <div className="alerts-container">
        {infoAlert && (
          <InfoAlert 
            text={infoAlert} 
            onClose={() => setInfoAlert("")}
          />
        )}
        {errorAlert && (
          <ErrorAlert 
            text={errorAlert} 
            onClose={() => setErrorAlert("")}
          />
        )}
        {warningAlert && (
          <WarningAlert 
            text={warningAlert} 
            onClose={() => setWarningAlert("")}
          />
        )}
      </div>
      <CitySearch 
        setCurrentCity={setCurrentCity}
        setInfoAlert={setInfoAlert}
        setErrorAlert={setErrorAlert}
      />
      <NumberOfEvents 
        numberOfEvents={numberOfEvents}
        onNumberChange={handleNumberOfEvents}
        setWarningAlert={setWarningAlert}
      />
      <EventList events={events} />
    </div>
  )
}

export default App
