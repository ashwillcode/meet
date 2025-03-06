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
      const eventItems = within(eventListDOM).queryAllByRole('listitem');
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
}); 