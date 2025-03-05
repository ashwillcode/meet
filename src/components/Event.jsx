import React, { useState } from 'react';

const Event = ({ event }) => {
  const [showDetails, setShowDetails] = useState(false);

  if (!event) return null;

  return (
    <div className="event">
      <h2>{event.summary}</h2>
      <p>{event.created}</p>
      <p>{event.location}</p>
      
      <button onClick={() => setShowDetails(!showDetails)}>
        {showDetails ? 'Hide Details' : 'Show Details'}
      </button>
      
      {showDetails && (
        <div className="details">
          <p>{event.description}</p>
        </div>
      )}
    </div>
  );
};

export default Event; 