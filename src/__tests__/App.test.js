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

  describe('Integration tests', () => {
    test('number of events integration - default value and user input', async () => {
      const user = userEvent.setup();
      let renderResult;
      
      // Given the user has just opened the app
      await act(async () => {
        renderResult = render(<App />);
      });

      // Wait for initial events to load with default value (32)
      const eventListDOM = renderResult.container.querySelector('#event-list');
      const numberOfEventsInput = renderResult.container.querySelector('#number-of-events-input');
      
      // Verify initial state
      expect(numberOfEventsInput).toBeInTheDocument();
      expect(numberOfEventsInput).toHaveValue(32); // Default value
      
      await waitFor(() => {
        const eventItems = within(eventListDOM).queryAllByTestId('event-item');
        expect(eventItems.length).toBe(3); // Our mock data has 3 events
      });

      // When the user changes the value of the "number of events" input field
      await act(async () => {
        await user.type(numberOfEventsInput, '{backspace}{backspace}2');
      });

      // Then the number of events in the list will change accordingly
      await waitFor(() => {
        const eventItems = within(eventListDOM).queryAllByTestId('event-item');
        expect(eventItems).toHaveLength(2);
      });

      // Test changing to a number larger than available events
      await act(async () => {
        await user.clear(numberOfEventsInput);
        await user.type(numberOfEventsInput, '10');
      });

      // Should show all available events when requested number is larger
      await waitFor(() => {
        const eventItems = within(eventListDOM).queryAllByTestId('event-item');
        expect(eventItems).toHaveLength(3); // All available events
      });
    });

    test('city filtering integration - events for selected city', async () => {
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
  });
}); 