import React from 'react';
import PropTypes from 'prop-types';
import Event from './Event';

const EventList = ({ events = [] }) => {
  const hasEvents = events && events.length > 0;

  return (
    <ul 
      id="event-list"
      className="event-list"
      role="list"
      aria-label="events"
    >
      {hasEvents ? (
        events.map((event) => (
          <Event 
            key={event.id} 
            event={event}
            aria-label={`Event: ${event.summary || 'No title available'}`}
          />
        ))
      ) : (
        <li className="no-events" role="alert">
          No events found
        </li>
      )}
    </ul>
  );
};

EventList.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      summary: PropTypes.string,
      location: PropTypes.string,
      description: PropTypes.string,
      start: PropTypes.shape({
        dateTime: PropTypes.string,
        timeZone: PropTypes.string
      }),
      end: PropTypes.shape({
        dateTime: PropTypes.string,
        timeZone: PropTypes.string
      })
    })
  )
};

export default EventList; 