import { loadFeature, defineFeature } from 'jest-cucumber';
import { render, within, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

const feature = loadFeature('./src/features/specifyNumberOfEvents.feature');

defineFeature(feature, test => {
  let renderResult;
  const user = userEvent.setup();

  test('Default number of events', ({ given, when, then }) => {
    given('the user hasn\'t specified a number of events', () => {
      // This is the default state, no action needed
    });

    when('the user opens the app', async () => {
      await act(async () => {
        renderResult = render(<App />);
      });
    });

    then('32 events should be shown by default', () => {
      const numberOfEventsInput = renderResult.container.querySelector('#number-of-events-input');
      expect(numberOfEventsInput.value).toBe('32');
    });
  });

  test('User can change the number of events they want to see', ({ given, when, then }) => {
    given('the user is on the main page', async () => {
      await act(async () => {
        renderResult = render(<App />);
      });
    });

    when('the user enters "10" in the number of events input', async () => {
      const numberOfEventsInput = renderResult.container.querySelector('#number-of-events-input');
      await act(async () => {
        await user.clear(numberOfEventsInput);
        await user.type(numberOfEventsInput, '10');
      });
    });

    then('the app should display 10 events', async () => {
      const eventList = renderResult.container.querySelector('#event-list');
      await waitFor(() => {
        const eventItems = within(eventList).queryAllByTestId('event-item');
        // Since we only have 3 mock events, requesting 10 should show all 3
        expect(eventItems).toHaveLength(3);
      });
    });
  });

  test('User enters an invalid number', ({ given, when, then }) => {
    given('the user is on the main page', async () => {
      await act(async () => {
        renderResult = render(<App />);
      });
    });

    when('the user enters "0" in the number of events input', async () => {
      const numberOfEventsInput = renderResult.container.querySelector('#number-of-events-input');
      await act(async () => {
        await user.clear(numberOfEventsInput);
        await user.type(numberOfEventsInput, '0');
      });
    });

    then('the app should display an error message "Number must be greater than 0"', () => {
      const errorMessage = renderResult.getByText('Number must be greater than 0');
      expect(errorMessage).toBeInTheDocument();
    });
  });

  test('User enters a number larger than total events available', ({ given, and, when, then }) => {
    given('the user is on the main page', async () => {
      await act(async () => {
        renderResult = render(<App />);
      });
    });

    and('there are only 3 events available', async () => {
      const eventList = renderResult.container.querySelector('#event-list');
      await waitFor(() => {
        const eventItems = within(eventList).queryAllByTestId('event-item');
        expect(eventItems).toHaveLength(3);
      });
    });

    when('the user enters "10" in the number of events input', async () => {
      const numberOfEventsInput = renderResult.container.querySelector('#number-of-events-input');
      await act(async () => {
        await user.clear(numberOfEventsInput);
        await user.type(numberOfEventsInput, '10');
      });
    });

    then('the app should display all 3 events', async () => {
      const eventList = renderResult.container.querySelector('#event-list');
      await waitFor(() => {
        const eventItems = within(eventList).queryAllByTestId('event-item');
        expect(eventItems).toHaveLength(3);
      });
    });
  });
}); 