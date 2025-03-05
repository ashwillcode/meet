import React from 'react';

const EventList = ({ events = [] }) => {
  return (
    <ul id="event-list">
      {events.map(event => (
        <li key={event.id}>
          {event.name}
        </li>
      ))}
    </ul>
  );
};

export default EventList; 