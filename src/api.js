// Mock data for development and testing
const mockData = [
  {
    id: "1",
    summary: "React Meetup",
    location: "Berlin, Germany",
    description: "Join us for an evening of React discussions and networking",
    htmlLink: "https://example.com/event1",
    start: {
      dateTime: "2024-06-15T19:00:00Z",
      timeZone: "UTC"
    },
    end: {
      dateTime: "2024-06-15T22:00:00Z",
      timeZone: "UTC"
    }
  },
  {
    id: "2",
    summary: "JavaScript Conference",
    location: "London, UK",
    description: "Annual JavaScript conference with industry experts",
    htmlLink: "https://example.com/event2",
    start: {
      dateTime: "2024-07-20T09:00:00Z",
      timeZone: "UTC"
    },
    end: {
      dateTime: "2024-07-21T17:00:00Z",
      timeZone: "UTC"
    }
  },
  {
    id: "3",
    summary: "Web Development Workshop",
    location: "Paris, France",
    description: "Hands-on workshop covering modern web development practices",
    htmlLink: "https://example.com/event3",
    start: {
      dateTime: "2024-08-10T14:00:00Z",
      timeZone: "UTC"
    },
    end: {
      dateTime: "2024-08-10T18:00:00Z",
      timeZone: "UTC"
    }
  }
];

/**
 * Extract unique locations from events
 * @param {Array} events - Array of event objects
 * @returns {Array} Array of unique location strings
 */
export const extractLocations = (events) => {
  const locations = events.map(event => event.location);
  const uniqueLocations = [...new Set(locations)];
  return uniqueLocations;
};

/**
 * Get events from the API
 * @returns {Promise<Array>} Promise that resolves to array of events
 */
export const getEvents = async () => {
  // TODO: Replace with actual API call
  return Promise.resolve(mockData);
}; 