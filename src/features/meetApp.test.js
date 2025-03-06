/* eslint-disable jest/expect-expect */
import { render, within, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { defineFeature, loadFeature } from 'jest-cucumber';
import App from '../App';

const feature = loadFeature('./src/features/meetApp.feature');

defineFeature(feature, test => {
  let renderResult;
  let user;

  beforeEach(() => {
    user = userEvent.setup();
  });

  // Scenario 1: Show all upcoming events when no city is searched
  test('Show all upcoming events when no city is searched', ({ given, when, then }) => {
    given('the user has not entered a city in the search field', async () => {
      await act(async () => {
        renderResult = render(<App />);
      });
      const citySearchInput = renderResult.container.querySelector('#city-search input');
      expect(citySearchInput.value).toBe('');
    });

    when('the user opens the app', async () => {
      await waitFor(() => {
        const eventList = renderResult.container.querySelector('#event-list');
        expect(eventList).toBeInTheDocument();
      });
    });

    then('the user should see upcoming events from all cities', async () => {
      const eventList = renderResult.container.querySelector('#event-list');
      await waitFor(() => {
        const eventItems = within(eventList).queryAllByTestId('event-item');
        expect(eventItems.length).toBeGreaterThan(0);
      });
    });
  });

  // Scenario 2: Expand event details
  test('Expand event details', ({ given, when, then }) => {
    given('an event\'s details are hidden', async () => {
      await act(async () => {
        renderResult = render(<App />);
      });
      await waitFor(() => {
        const eventList = renderResult.container.querySelector('#event-list');
        const eventItems = within(eventList).queryAllByTestId('event-item');
        expect(eventItems.length).toBeGreaterThan(0);
        // Check if the button indicates details are hidden
        const detailsButton = within(eventItems[0]).getByTestId('details-btn');
        expect(detailsButton).toHaveTextContent('Show Details');
        expect(detailsButton).toHaveAttribute('aria-expanded', 'false');
      });
    });

    when('the user clicks the "Details" button for that event', async () => {
      const eventList = renderResult.container.querySelector('#event-list');
      const eventItems = within(eventList).queryAllByTestId('event-item');
      const detailsButton = within(eventItems[0]).getByText('Show Details');
      await act(async () => {
        await user.click(detailsButton);
      });
    });

    then('the event details should be displayed', async () => {
      const eventList = renderResult.container.querySelector('#event-list');
      const eventItems = within(eventList).queryAllByTestId('event-item');
      await waitFor(() => {
        const detailsButton = within(eventItems[0]).getByTestId('details-btn');
        expect(detailsButton).toHaveTextContent('Hide Details');
        expect(detailsButton).toHaveAttribute('aria-expanded', 'true');
      });
    });
  });

  // Scenario 3: Change the number of events displayed
  test('Change the number of events displayed', ({ given, when, then }) => {
    given('32 events are displayed by default', async () => {
      await act(async () => {
        renderResult = render(<App />);
      });
      const numberOfEventsInput = renderResult.container.querySelector('#number-of-events-input');
      expect(numberOfEventsInput.value).toBe('32');
    });

    when('the user enters a different number in the event count field', async () => {
      const numberOfEventsInput = renderResult.container.querySelector('#number-of-events-input');
      await act(async () => {
        await user.clear(numberOfEventsInput);
        await user.type(numberOfEventsInput, '2');
      });
    });

    then('the app should update to show the specified number of events', async () => {
      const eventList = renderResult.container.querySelector('#event-list');
      await waitFor(() => {
        const eventItems = within(eventList).queryAllByTestId('event-item');
        // Since we only have 3 mock events, requesting 2 should show 2
        expect(eventItems).toHaveLength(2);
      });
    });
  });
});
