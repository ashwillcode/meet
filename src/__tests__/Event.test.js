import React from 'react';
import { render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Event from '../components/Event';
import { getEvents } from '../api';

describe('<Event /> component', () => {
  const mockEvent = {
    id: "1",
    summary: "Test Event",
    location: "Berlin, Germany",
    description: "A test event description",
    htmlLink: "https://test.com",
    start: {
      dateTime: "2024-06-15T19:00:00Z",
      timeZone: "UTC"
    },
    end: {
      dateTime: "2024-06-15T22:00:00Z",
      timeZone: "UTC"
    }
  };

  let EventComponent;
  beforeEach(() => {
    EventComponent = render(<Event event={mockEvent} />);
  });

  // Test specifically for event title using queryByText
  test('renders event title (summary) correctly', () => {
    const titleElement = EventComponent.queryByText(mockEvent.summary);
    expect(titleElement).toBeInTheDocument();
  });

  // Test specifically for event location using queryByText
  test('renders event location correctly', () => {
    const locationElement = EventComponent.queryByText(mockEvent.location);
    expect(locationElement).toBeInTheDocument();
  });

  // Test specifically for event start time
  test('renders event start time correctly', () => {
    const startTime = new Date(mockEvent.start.dateTime).toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'short'
    });
    const timeElement = EventComponent.queryByText(startTime);
    expect(timeElement).toBeInTheDocument();
  });

  // Test specifically for show details button
  test('renders show details button', () => {
    const button = EventComponent.queryByText('Show Details');
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe('BUTTON');
  });

  // Test using actual API data
  test('renders with actual event data from API', async () => {
    const allEvents = await getEvents();
    const { container } = render(<Event event={allEvents[0]} />);
    
    const eventElement = container.querySelector('.event');
    expect(eventElement).toBeInTheDocument();
    expect(eventElement).toHaveTextContent(allEvents[0].summary);
    expect(eventElement).toHaveTextContent(allEvents[0].location);
  });

  test('renders event with proper accessibility attributes', () => {
    const eventItem = EventComponent.getByRole('listitem');
    expect(eventItem).toHaveAttribute('aria-label', expect.stringContaining(mockEvent.summary));
  });

  test('renders basic event information', () => {
    const title = EventComponent.getByRole('heading', { level: 2 });
    expect(title).toHaveTextContent(mockEvent.summary);
    expect(EventComponent.getByText(mockEvent.location)).toBeInTheDocument();
    expect(EventComponent.getByText(/june 15, 2024/i)).toBeInTheDocument();
  });

  test('renders show/hide details button with proper attributes', () => {
    const button = EventComponent.getByRole('button');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveAttribute('aria-controls', `details-${mockEvent.id}`);
    expect(button).toHaveTextContent('Show Details');
  });

  test('expands and collapses event details when button is clicked', async () => {
    const user = userEvent.setup();
    const button = EventComponent.getByRole('button');
    
    // Initially, details should be hidden
    expect(EventComponent.queryByRole('region')).not.toBeInTheDocument();
    
    // Click to show details
    await user.click(button);
    const details = EventComponent.getByRole('region');
    expect(details).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(button).toHaveTextContent('Hide Details');
    
    // Click to hide details
    await user.click(button);
    expect(EventComponent.queryByRole('region')).not.toBeInTheDocument();
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveTextContent('Show Details');
  });

  test('handles missing event data gracefully', () => {
    const incompleteEvent = {
      id: "2"
    };
    
    const { getByRole, getByText } = render(<Event event={incompleteEvent} />);
    
    expect(getByText('No title available')).toBeInTheDocument();
    expect(getByText('Location not provided')).toBeInTheDocument();
    expect(getByText('Date not provided')).toBeInTheDocument();
  });

  test('formats date correctly', () => {
    const dateRegex = /june 15, 2024 at \d{1,2}:\d{2} [ap]m/i;
    expect(EventComponent.getByText(dateRegex)).toBeInTheDocument();
  });

  test('handles invalid date gracefully', () => {
    const eventWithInvalidDate = {
      ...mockEvent,
      start: {
        dateTime: 'invalid-date'
      }
    };
    
    const { getByText } = render(<Event event={eventWithInvalidDate} />);
    expect(getByText('Invalid Date')).toBeInTheDocument();
  });

  test('renders event link when htmlLink is provided', async () => {
    const user = userEvent.setup();
    const button = EventComponent.getByRole('button');
    
    await user.click(button);
    
    const link = EventComponent.getByRole('link');
    expect(link).toHaveAttribute('href', mockEvent.htmlLink);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('expanded details section has proper accessibility attributes', async () => {
    const user = userEvent.setup();
    const button = EventComponent.getByRole('button');
    
    await user.click(button);
    
    const details = EventComponent.getByRole('region');
    expect(details).toHaveAttribute('aria-label', 'Event Details');
    expect(details).toHaveAttribute('id', `details-${mockEvent.id}`);
  });

  // Test for initial state of details section
  test('details section is hidden by default', () => {
    const detailsSection = EventComponent.queryByRole('region');
    const button = EventComponent.getByRole('button');
    
    expect(detailsSection).not.toBeInTheDocument();
    expect(button).toHaveTextContent('Show Details');
  });

  // Test for showing details when clicking show details button
  test('shows details section when "Show Details" button is clicked', async () => {
    const user = userEvent.setup();
    const button = EventComponent.getByRole('button');
    
    await user.click(button);
    
    const detailsSection = EventComponent.getByRole('region');
    expect(detailsSection).toBeInTheDocument();
    expect(detailsSection).toHaveTextContent(mockEvent.description);
    expect(button).toHaveTextContent('Hide Details');
  });

  // Test for hiding details when clicking hide details button
  test('hides details section when "Hide Details" button is clicked', async () => {
    const user = userEvent.setup();
    const button = EventComponent.getByRole('button');
    
    // First show the details
    await user.click(button);
    expect(EventComponent.getByRole('region')).toBeInTheDocument();
    expect(button).toHaveTextContent('Hide Details');
    
    // Then hide the details
    await user.click(button);
    expect(EventComponent.queryByRole('region')).not.toBeInTheDocument();
    expect(button).toHaveTextContent('Show Details');
  });

  // Test for details content when expanded
  test('shows correct content in details section when expanded', async () => {
    const user = userEvent.setup();
    const button = EventComponent.getByRole('button');
    
    await user.click(button);
    
    const detailsSection = EventComponent.getByRole('region');
    expect(detailsSection).toHaveTextContent('About this event:');
    expect(detailsSection).toHaveTextContent(mockEvent.description);
    expect(EventComponent.getByRole('link')).toHaveTextContent('View in Google Calendar');
  });
}); 