import { render, within, waitFor, act } from '@testing-library/react';
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
}); 