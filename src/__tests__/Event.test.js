import { render, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Event from '../components/Event';
import React from 'react';

describe('<Event /> component', () => {
  let eventProps;
  beforeEach(() => {
    eventProps = {
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
    };
  });

  test('renders event title in collapsed view', () => {
    const { getByTestId } = render(<Event event={eventProps} />);
    expect(getByTestId('event-title')).toHaveTextContent('React Meetup');
  });

  test('renders event start time in collapsed view', () => {
    const { getByTestId } = render(<Event event={eventProps} />);
    const dateElement = getByTestId('event-datetime');
    expect(dateElement).toBeInTheDocument();
    // Should show date and time in a readable format
    expect(dateElement.textContent).toMatch(/June 15, 2024 at 07:00 PM/);
  });

  test('renders event location in collapsed view', () => {
    const { getByTestId } = render(<Event event={eventProps} />);
    expect(getByTestId('event-location')).toHaveTextContent('Berlin, Germany');
  });

  test('renders show details button with correct initial state', () => {
    const { getByTestId } = render(<Event event={eventProps} />);
    const button = getByTestId('details-btn');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Show Details');
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  test('shows details when show details button is clicked', async () => {
    const user = userEvent.setup();
    const { getByTestId, queryByTestId } = render(<Event event={eventProps} />);
    
    // Initially, details should not be visible
    expect(queryByTestId('event-details')).not.toBeInTheDocument();
    
    // Click show details button
    await act(async () => {
      await user.click(getByTestId('details-btn'));
    });
    
    // Details should now be visible
    const details = getByTestId('event-details');
    expect(details).toBeInTheDocument();
    expect(details).toHaveTextContent('Join us for an evening of React discussions and networking');
    expect(getByTestId('details-btn')).toHaveTextContent('Hide Details');
    expect(getByTestId('details-btn')).toHaveAttribute('aria-expanded', 'true');
  });

  test('hides details when hide details button is clicked', async () => {
    const user = userEvent.setup();
    const { getByTestId, queryByTestId } = render(<Event event={eventProps} />);
    
    // Show details first
    await act(async () => {
      await user.click(getByTestId('details-btn'));
    });
    expect(getByTestId('event-details')).toBeInTheDocument();
    
    // Hide details
    await act(async () => {
      await user.click(getByTestId('details-btn'));
    });
    expect(queryByTestId('event-details')).not.toBeInTheDocument();
    expect(getByTestId('details-btn')).toHaveTextContent('Show Details');
    expect(getByTestId('details-btn')).toHaveAttribute('aria-expanded', 'false');
  });

  test('handles missing event data gracefully', () => {
    const incompleteEvent = {
      summary: "Incomplete Event"
      // Missing other required fields
    };
    
    // Component should not throw error when rendering incomplete data
    expect(() => render(<Event event={incompleteEvent} />)).not.toThrow();
  });

  test('handles null event prop gracefully', () => {
    const { container } = render(<Event event={null} />);
    expect(container).toBeEmptyDOMElement();
  });
}); 