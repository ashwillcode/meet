import { render, within, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import App from '../App';
import { getEvents } from '../api';

describe('<App /> component', () => {
  test('renders list of events', () => {
    const AppDOM = render(<App />).container.firstChild;
    expect(AppDOM.querySelector('#event-list')).toBeInTheDocument();
  });

  test('renders CitySearch', () => {
    const AppDOM = render(<App />).container.firstChild;
    expect(AppDOM.querySelector('#city-search')).toBeInTheDocument();
  });

  test('renders NumberOfEvents', () => {
    const AppDOM = render(<App />).container.firstChild;
    expect(AppDOM.querySelector('.number-of-events')).toBeInTheDocument();
  });

  test('renders list of events when app is mounted', async () => {
    let container;
    await act(async () => {
      const renderResult = render(<App />);
      container = renderResult.container;
    });

    const eventListDOM = container.querySelector('#event-list');
    expect(eventListDOM).toBeInTheDocument();

    await waitFor(() => {
      const eventItems = within(eventListDOM).queryAllByRole('listitem');
      expect(eventItems.length).toBeGreaterThan(0);
    });
  });

  test('renders events for the selected city', async () => {
    const user = userEvent.setup();
    let container;
    
    await act(async () => {
      const renderResult = render(<App />);
      container = renderResult.container;
    });

    const citySearchDOM = container.querySelector('#city-search');
    const cityInput = within(citySearchDOM).queryByRole('textbox');

    await act(async () => {
      await user.type(cityInput, 'Berlin');
    });

    await waitFor(() => {
      const berlinSuggestion = within(citySearchDOM).queryByText('Berlin, Germany');
      expect(berlinSuggestion).toBeInTheDocument();
    });

    await act(async () => {
      const berlinSuggestion = within(citySearchDOM).getByText('Berlin, Germany');
      await user.click(berlinSuggestion);
    });

    const eventListDOM = container.querySelector('#event-list');
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