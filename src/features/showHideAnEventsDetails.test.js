import { loadFeature, defineFeature } from 'jest-cucumber';
import { render, within, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

const feature = loadFeature('./src/features/showHideAnEventsDetails.feature');

defineFeature(feature, test => {
  let renderResult;
  let user;

  beforeEach(() => {
    user = userEvent.setup();
  });

  test('Event details are collapsed by default', ({ given, when, then }) => {
    given('the list of events has been loaded', async () => {
      await act(async () => {
        renderResult = render(<App />);
      });
      await waitFor(() => {
        const eventList = renderResult.container.querySelector('#event-list');
        expect(eventList).toBeInTheDocument();
      });
    });

    when('each event is displayed', async () => {
      await waitFor(() => {
        const eventList = renderResult.container.querySelector('#event-list');
        const eventItems = within(eventList).queryAllByTestId('event-item');
        expect(eventItems.length).toBeGreaterThan(0);
      });
    });

    then('the event details should be hidden by default', () => {
      const eventList = renderResult.container.querySelector('#event-list');
      const eventItems = within(eventList).queryAllByTestId('event-item');
      eventItems.forEach(item => {
        const detailsSection = within(item).queryByTestId('event-details');
        expect(detailsSection).not.toBeInTheDocument();
      });
    });
  });

  test('User can expand event details', ({ given, when, then }) => {
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

    when('the user clicks the "Show Details" button for that event', async () => {
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
        const detailsSection = within(eventItems[0]).getByTestId('event-details');
        expect(detailsSection).toBeInTheDocument();
        const detailsButton = within(eventItems[0]).getByTestId('details-btn');
        expect(detailsButton).toHaveTextContent('Hide Details');
        expect(detailsButton).toHaveAttribute('aria-expanded', 'true');
      });
    });
  });

  test('User can collapse event details', ({ given, when, then }) => {
    given('an event\'s details are currently expanded', async () => {
      await act(async () => {
        renderResult = render(<App />);
      });
      await waitFor(() => {
        const eventList = renderResult.container.querySelector('#event-list');
        const eventItems = within(eventList).queryAllByTestId('event-item');
        const detailsButton = within(eventItems[0]).getByTestId('details-btn');
        user.click(detailsButton);
        expect(within(eventItems[0]).getByTestId('event-details')).toBeInTheDocument();
      });
    });

    when('the user clicks the "Hide Details" button', async () => {
      const eventList = renderResult.container.querySelector('#event-list');
      const eventItems = within(eventList).queryAllByTestId('event-item');
      const detailsButton = within(eventItems[0]).getByText('Hide Details');
      await act(async () => {
        await user.click(detailsButton);
      });
    });

    then('the event details should be hidden', async () => {
      const eventList = renderResult.container.querySelector('#event-list');
      const eventItems = within(eventList).queryAllByTestId('event-item');
      await waitFor(() => {
        const detailsSection = within(eventItems[0]).queryByTestId('event-details');
        expect(detailsSection).not.toBeInTheDocument();
        const detailsButton = within(eventItems[0]).getByTestId('details-btn');
        expect(detailsButton).toHaveTextContent('Show Details');
        expect(detailsButton).toHaveAttribute('aria-expanded', 'false');
      });
    });
  });
}); 