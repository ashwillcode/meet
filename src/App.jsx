import React, { useState, useEffect } from 'react'
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

  useEffect(() => {
    const fetchEvents = async () => {
      const events = await getEvents()
      setAllEvents(events)
      setEvents(currentCity === "See all cities" 
        ? events 
        : events.filter(event => event.location === currentCity)
      )
    }
    fetchEvents()
  }, [currentCity])

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
