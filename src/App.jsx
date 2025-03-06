import React, { useState, useEffect, useCallback } from 'react'
import CitySearch from './components/CitySearch'
import EventList from './components/EventList'
import NumberOfEvents from './components/NumberOfEvents'
import { getEvents } from './api'
import './App.css'

const App = () => {
  const [events, setEvents] = useState([])
  const [currentCity, setCurrentCity] = useState("See all cities")
  const [numberOfEvents, setNumberOfEvents] = useState(32)
  const [allEvents, setAllEvents] = useState([])

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

  return (
    <div className="App">
      <CitySearch setCurrentCity={setCurrentCity} />
      <NumberOfEvents 
        numberOfEvents={numberOfEvents}
        onNumberChange={setNumberOfEvents}
      />
      <EventList events={events} />
    </div>
  )
}

export default App
