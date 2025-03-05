import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

const Event = ({ event }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDetails = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return 'Date not provided';
    try {
      const date = new Date(dateTimeStr);
      return date.toLocaleString('en-US', {
        dateStyle: 'full',
        timeStyle: 'short'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  return (
    <li 
      className="event"
      role="listitem"
      aria-label={`Event: ${event.summary || 'No title available'}`}
    >
      <div className="event-summary">
        <h2>{event.summary || 'No title available'}</h2>
        <p className="event-location">
          <span className="label">Location: </span>
          {event.location || 'Location not provided'}
        </p>
        <p className="event-datetime">
          <span className="label">When: </span>
          {formatDateTime(event.start?.dateTime)}
        </p>
        <button
          className="details-btn"
          aria-expanded={isExpanded}
          aria-controls={`details-${event.id}`}
          onClick={toggleDetails}
        >
          {isExpanded ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      {isExpanded && (
        <div 
          id={`details-${event.id}`}
          className="event-details"
          role="region"
          aria-label="Event Details"
        >
          <h3>About this event:</h3>
          <p className="event-description">
            {event.description || 'No description available'}
          </p>
          {event.htmlLink && (
            <a 
              href={event.htmlLink}
              target="_blank"
              rel="noopener noreferrer"
              className="event-link"
              aria-label={`View ${event.summary || 'event'} in Google Calendar`}
            >
              View in Google Calendar
            </a>
          )}
        </div>
      )}
    </li>
  );
};

Event.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.string.isRequired,
    summary: PropTypes.string,
    location: PropTypes.string,
    description: PropTypes.string,
    htmlLink: PropTypes.string,
    start: PropTypes.shape({
      dateTime: PropTypes.string,
      timeZone: PropTypes.string
    }),
    end: PropTypes.shape({
      dateTime: PropTypes.string,
      timeZone: PropTypes.string
    })
  }).isRequired
};

export default Event; 