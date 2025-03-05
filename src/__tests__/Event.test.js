import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Event from '../components/Event';
import React from 'react';

describe('<Event /> component', () => {
  let eventProps;
  beforeEach(() => {
    eventProps = {
      summary: 'Sample Event',
      created: '2024-01-01T12:00:00Z',
      location: 'Berlin, Germany',
      description: 'This is a sample event description'
    };
  });

  test('renders event details correctly', () => {
    const { getByTestId } = render(<Event event={eventProps} />);
    
    expect(getByTestId('event-title')).toHaveTextContent('Sample Event');
    expect(getByTestId('event-datetime')).toHaveTextContent('January 1, 2024');
    expect(getByTestId('event-location')).toHaveTextContent('Berlin, Germany');
  });

  test('renders show details button', () => {
    const { getByTestId } = render(<Event event={eventProps} />);
    const button = getByTestId('details-btn');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Show Details');
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  test('shows details when show details button is clicked', async () => {
    const { getByTestId, queryByTestId } = render(<Event event={eventProps} />);
    const user = userEvent.setup();
    
    // Initially, details should not be visible
    expect(queryByTestId('event-details')).not.toBeInTheDocument();
    
    // Click show details button
    await user.click(getByTestId('details-btn'));
    
    // Details should now be visible
    expect(getByTestId('event-details')).toBeInTheDocument();
    expect(getByTestId('details-btn')).toHaveTextContent('Hide Details');
    expect(getByTestId('details-btn')).toHaveAttribute('aria-expanded', 'true');
  });

  test('hides details when hide details button is clicked', async () => {
    const { getByTestId, queryByTestId } = render(<Event event={eventProps} />);
    const user = userEvent.setup();
    
    // Show details first
    await user.click(getByTestId('details-btn'));
    expect(getByTestId('event-details')).toBeInTheDocument();
    
    // Hide details
    await user.click(getByTestId('details-btn'));
    expect(queryByTestId('event-details')).not.toBeInTheDocument();
    expect(getByTestId('details-btn')).toHaveTextContent('Show Details');
    expect(getByTestId('details-btn')).toHaveAttribute('aria-expanded', 'false');
  });
}); 