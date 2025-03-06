import { render, within, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import App from '../App';
import { getEvents } from '../api';

describe('<App /> component', () => {
  test('renders list of events', async () => {
    let renderResult;
    await act(async () => {
      renderResult = render(<App />);
    });
    expect(renderResult.container.querySelector('#event-list')).toBeInTheDocument();
  });

  test('renders CitySearch', async () => {
    let renderResult;
    await act(async () => {
      renderResult = render(<App />);
    });
    expect(renderResult.container.querySelector('#city-search')).toBeInTheDocument();
  });

  test('renders NumberOfEvents', async () => {
    let renderResult;
    await act(async () => {
      renderResult = render(<App />);
    });
    expect(renderResult.container.querySelector('.number-of-events')).toBeInTheDocument();
  });

  test('renders list of events when app is mounted', async () => {
    let renderResult;
    await act(async () => {
      renderResult = render(<App />);
    });

    const eventListDOM = renderResult.container.querySelector('#event-list');
    expect(eventListDOM).toBeInTheDocument();

    await waitFor(() => {
      const eventItems = within(eventListDOM).queryAllByTestId('event-item');
      expect(eventItems.length).toBeGreaterThan(0);
    });
  });

  test('renders events for the selected city', async () => {
    const user = userEvent.setup();
    let renderResult;
    
    await act(async () => {
      renderResult = render(<App />);
    });

    const citySearchDOM = renderResult.container.querySelector('#city-search');
    const cityInput = within(citySearchDOM).queryByRole('textbox');

    await act(async () => {
      await user.type(cityInput, 'Berlin');
    });

    let berlinSuggestion;
    await waitFor(() => {
      berlinSuggestion = within(citySearchDOM).queryByText('Berlin, Germany');
      expect(berlinSuggestion).toBeInTheDocument();
    });

    await act(async () => {
      await user.click(berlinSuggestion);
    });

    const eventListDOM = renderResult.container.querySelector('#event-list');
    await waitFor(() => {
      const eventItems = within(eventListDOM).queryAllByTestId('event-item');
      const berlinEvents = eventItems.filter(event => 
        within(event).getByTestId('event-location').textContent === 'Berlin, Germany'
      );
      expect(berlinEvents.length).toBeGreaterThan(0);
      expect(berlinEvents.length).toBe(eventItems.length);
    });
  });

  test('renders the correct number of events', async () => {
    const user = userEvent.setup();
    let renderResult;
    
    await act(async () => {
      renderResult = render(<App />);
    });

    // Wait for initial events to load
    const eventListDOM = renderResult.container.querySelector('#event-list');
    await waitFor(() => {
      const eventItems = within(eventListDOM).queryAllByTestId('event-item');
      expect(eventItems.length).toBe(3); // Initially shows all 3 events
    });

    // Find and update the number of events input
    const numberOfEventsInput = renderResult.container.querySelector('#number-of-events-input');
    expect(numberOfEventsInput).toBeInTheDocument();

    // Clear the input and type new value
    await act(async () => {
      await user.clear(numberOfEventsInput);
      await user.type(numberOfEventsInput, "2");
    });

    // Wait for the events list to update with the new number of events
    await waitFor(() => {
      const eventItems = within(eventListDOM).queryAllByTestId('event-item');
      expect(eventItems).toHaveLength(2); // Should now show only 2 events
    }, {
      timeout: 3000
    });
  });
}); 