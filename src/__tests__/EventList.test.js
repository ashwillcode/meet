import React from 'react';
import { render, within } from '@testing-library/react';
import EventList from '../components/EventList';
import { getEvents } from '../api';

describe('<EventList /> component', () => {
  let EventListComponent;
  beforeEach(() => {
    EventListComponent = render(<EventList />);
  });

  test('has an element with "list" role and proper accessibility attributes', () => {
    const list = EventListComponent.getByRole('list');
    expect(list).toBeInTheDocument();
    expect(list).toHaveAttribute('aria-label', 'events');
  });

  test('renders correct number of events', async () => {
    const allEvents = await getEvents();
    EventListComponent.rerender(<EventList events={allEvents} />);
    const eventItems = EventListComponent.getAllByRole('listitem');
    expect(eventItems).toHaveLength(allEvents.length);
    
    // Check that each event item has proper accessibility attributes
    eventItems.forEach((item, index) => {
      expect(item).toHaveAttribute('aria-label', expect.stringContaining('Event'));
    });
  });

  test('handles empty events array gracefully', () => {
    EventListComponent.rerender(<EventList events={[]} />);
    const list = EventListComponent.getByRole('list');
    expect(list).toBeInTheDocument();
    expect(within(list).queryAllByRole('listitem')).toHaveLength(0);
    expect(EventListComponent.getByText('No events found')).toBeInTheDocument();
  });

  test('handles missing events prop gracefully', () => {
    EventListComponent.rerender(<EventList />);
    const list = EventListComponent.getByRole('list');
    expect(list).toBeInTheDocument();
    expect(within(list).queryAllByRole('listitem')).toHaveLength(0);
    expect(EventListComponent.getByText('No events found')).toBeInTheDocument();
  });

  test('handles null events gracefully', () => {
    EventListComponent.rerender(<EventList events={null} />);
    const list = EventListComponent.getByRole('list');
    expect(list).toBeInTheDocument();
    expect(within(list).queryAllByRole('listitem')).toHaveLength(0);
    expect(EventListComponent.getByText('No events found')).toBeInTheDocument();
  });

  test('renders events with proper structure and content', async () => {
    const allEvents = await getEvents();
    EventListComponent.rerender(<EventList events={allEvents} />);
    const eventItems = EventListComponent.getAllByRole('listitem');

    eventItems.forEach((item, index) => {
      const event = allEvents[index];
      const title = within(item).getByRole('heading');
      expect(title).toHaveTextContent(event.summary || '');
      
      // Verify event details are present
      expect(item).toHaveTextContent(event.location || '');
      
      // Check for formatted date string
      if (event.start?.dateTime) {
        const date = new Date(event.start.dateTime);
        const formattedDate = date.toLocaleString('en-US', {
          dateStyle: 'full',
          timeStyle: 'short'
        });
        expect(item).toHaveTextContent(formattedDate);
      } else {
        expect(item).toHaveTextContent('Date not provided');
      }
    });
  });

  test('handles events with missing data gracefully', async () => {
    const incompleteEvents = [
      { id: "1" }, // Missing summary and location
      { id: "2", summary: 'Test Event' }, // Missing location
      { id: "3", location: 'Test Location' }, // Missing summary
    ];

    EventListComponent.rerender(<EventList events={incompleteEvents} />);
    const eventItems = EventListComponent.getAllByRole('listitem');
    expect(eventItems).toHaveLength(3);

    // First event should show placeholders
    expect(eventItems[0]).toHaveTextContent('No title available');
    expect(eventItems[0]).toHaveTextContent('Location not provided');

    // Second event should show title but placeholder for location
    expect(eventItems[1]).toHaveTextContent('Test Event');
    expect(eventItems[1]).toHaveTextContent('Location not provided');

    // Third event should show location but placeholder for title
    expect(eventItems[2]).toHaveTextContent('No title available');
    expect(eventItems[2]).toHaveTextContent('Test Location');
  });
}); 