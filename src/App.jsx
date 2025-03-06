import React, { useState, useEffect } from 'react'
import CitySearch from './components/CitySearch'
import EventList from './components/EventList'
import NumberOfEvents from './components/NumberOfEvents'
import { getEvents } from './api'
import './App.css'

const App = () => {
  const [events, setEvents] = useState([])
  const [numberOfEvents, setNumberOfEvents] = useState(32)

  useEffect(() => {
    const fetchEvents = async () => {
      const events = await getEvents()
      setEvents(events)
    }
    fetchEvents()
  }, [])

  return (
    <div className="App">
      <CitySearch />
      <NumberOfEvents 
        numberOfEvents={numberOfEvents}
        onNumberChange={setNumberOfEvents}
      />
      <EventList events={events} />
    </div>
  )
}

export default App
