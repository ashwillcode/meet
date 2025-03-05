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
    const { getByText } = render(<Event event={eventProps} />);
    
    expect(getByText('Sample Event')).toBeInTheDocument();
    expect(getByText('2024-01-01T12:00:00Z')).toBeInTheDocument();
    expect(getByText('Berlin, Germany')).toBeInTheDocument();
  });

  test('renders show details button', () => {
    const { getByText } = render(<Event event={eventProps} />);
    expect(getByText('Show Details')).toBeInTheDocument();
  });

  test('shows details when show details button is clicked', async () => {
    const { getByText, queryByText } = render(<Event event={eventProps} />);
    const user = userEvent.setup();
    
    // Initially, description should not be visible
    expect(queryByText('This is a sample event description')).not.toBeInTheDocument();
    
    // Click show details button
    await user.click(getByText('Show Details'));
    
    // Description should now be visible
    expect(getByText('This is a sample event description')).toBeInTheDocument();
    expect(getByText('Hide Details')).toBeInTheDocument();
  });

  test('hides details when hide details button is clicked', async () => {
    const { getByText, queryByText } = render(<Event event={eventProps} />);
    const user = userEvent.setup();
    
    // Show details first
    await user.click(getByText('Show Details'));
    expect(getByText('This is a sample event description')).toBeInTheDocument();
    
    // Hide details
    await user.click(getByText('Hide Details'));
    expect(queryByText('This is a sample event description')).not.toBeInTheDocument();
    expect(getByText('Show Details')).toBeInTheDocument();
  });
}); 