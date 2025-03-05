import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Event = ({ event }) => {
  const [showDetails, setShowDetails] = useState(false);

  if (!event) return null;

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="event" data-testid="event-item">
      <h2 className="event-title" data-testid="event-title">{event.summary}</h2>
      <p className="event-datetime" data-testid="event-datetime">{formatDate(event.created)}</p>
      <p className="event-location" data-testid="event-location">{event.location}</p>
      
      <button 
        className="details-btn"
        data-testid="details-btn"
        onClick={() => setShowDetails(!showDetails)}
        aria-expanded={showDetails}
      >
        {showDetails ? 'Hide Details' : 'Show Details'}
      </button>
      
      {showDetails && (
        <div className="details" data-testid="event-details">
          <p className="event-description">{event.description}</p>
        </div>
      )}
    </div>
  );
};

Event.propTypes = {
  event: PropTypes.shape({
    summary: PropTypes.string.isRequired,
    created: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
  }).isRequired
};

export default Event; 