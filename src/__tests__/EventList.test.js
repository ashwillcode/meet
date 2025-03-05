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
      { id: 1, name: 'Event 1' },
      { id: 2, name: 'Event 2' },
      { id: 3, name: 'Event 3' }
    ];
    const { getAllByRole } = render(<EventList events={events} />);
    expect(getAllByRole('listitem')).toHaveLength(events.length);
  });
}); 