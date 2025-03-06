import React from 'react';
import Event from './Event';

const EventList = ({ events = [] }) => {
  return (
    <ul id="event-list">
      {events.map(event => (
        <li key={event.id}>
          <Event event={event} />
        </li>
      ))}
    </ul>
  );
};

export default EventList; 