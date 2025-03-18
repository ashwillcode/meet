import { useState } from 'react';
import PropTypes from 'prop-types';

const Event = ({ event }) => {
  const [showDetails, setShowDetails] = useState(false);

  if (!event) return null;

  const formatDate = (dateTime, timeZone) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: timeZone || 'UTC'
    };
    return new Date(dateTime).toLocaleString(undefined, options);
  };

  // Ensure required fields exist
  const summary = event.summary || 'No Title';
  const location = event.location || 'No Location';
  const description = event.description || 'No Description Available';
  const startDateTime = event.start?.dateTime || event.created || new Date().toISOString();
  const timeZone = event.start?.timeZone || 'UTC';

  return (
    <div className="event" data-testid="event-item">
      <div className="event-summary">
        <h2 className="event-title" data-testid="event-title">{summary}</h2>
        <p className="event-datetime" data-testid="event-datetime">
          {formatDate(startDateTime, timeZone)}
        </p>
        <p className="event-location" data-testid="event-location">{location}</p>
        
        <button 
          className="details-btn"
          data-testid="details-btn"
          onClick={() => setShowDetails(!showDetails)}
          aria-expanded={showDetails}
          aria-controls="event-details"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      {showDetails && (
        <div 
          id="event-details"
          className="details" 
          data-testid="event-details"
          aria-label="Event Details"
        >
          <p className="event-description">{description}</p>
          {event.htmlLink && (
            <a 
              href={event.htmlLink}
              target="_blank"
              rel="noopener noreferrer"
              className="event-link"
            >
              See details on Google Calendar
            </a>
          )}
        </div>
      )}
    </div>
  );
};

Event.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.string,
    summary: PropTypes.string,
    created: PropTypes.string,
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
  })
};

export default Event; 