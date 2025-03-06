import { render } from '@testing-library/react';
import React from 'react';
import EventList from '../components/EventList';

describe('<EventList /> component', () => {
  test('has an element with "list" role', () => {
    const { queryByRole } = render(<EventList />);
    expect(queryByRole('list')).toBeInTheDocument();
  });

  test('renders correct number of events', () => {
    const events = [
      { 
        id: "1",
        summary: "Event 1",
        location: "Location 1",
        description: "Description 1",
        start: {
          dateTime: "2024-06-15T19:00:00Z",
          timeZone: "UTC"
        }
      },
      { 
        id: "2",
        summary: "Event 2",
        location: "Location 2",
        description: "Description 2",
        start: {
          dateTime: "2024-06-15T19:00:00Z",
          timeZone: "UTC"
        }
      },
      { 
        id: "3",
        summary: "Event 3",
        location: "Location 3",
        description: "Description 3",
        start: {
          dateTime: "2024-06-15T19:00:00Z",
          timeZone: "UTC"
        }
      }
    ];
    const { getAllByRole } = render(<EventList events={events} />);
    expect(getAllByRole('listitem')).toHaveLength(events.length);
  });
}); 