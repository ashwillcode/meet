import React, { useState } from 'react'
import CitySearch from './components/CitySearch'
import EventList from './components/EventList'
import './App.css'

const App = () => {
  const [events, setEvents] = useState([])

  return (
    <div className="App">
      <CitySearch />
      <EventList events={events} />
    </div>
  )
}

export default App
