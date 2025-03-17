import React, { useState, useEffect, useCallback } from 'react'
import CitySearch from './components/CitySearch'
import EventList from './components/EventList'
import NumberOfEvents from './components/NumberOfEvents'
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
    const fetchedEvents = await getEvents()
    setAllEvents(fetchedEvents)
  }, [])

  const filterEvents = useCallback(() => {
    let filteredEvents = currentCity === "See all cities"
      ? [...allEvents]
      : allEvents.filter(event => event.location === currentCity)
    
    // Apply numberOfEvents limit
    filteredEvents = filteredEvents.slice(0, numberOfEvents)
    setEvents(filteredEvents)
  }, [currentCity, allEvents, numberOfEvents])

  // Fetch events on mount
  useEffect(() => {
    fetchInitialEvents()
  }, [fetchInitialEvents])

  // Filter events when dependencies change
  useEffect(() => {
    filterEvents()
  }, [filterEvents])

  const handleNumberOfEvents = (value) => {
    setNumberOfEvents(value)
  }

  return (
    <div className="App">
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
