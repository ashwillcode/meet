import { render, screen, waitFor, within } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import * as api from '../api';

// Mock the api module
jest.mock('../api');

describe('<App />', () => {
  const mockEvents = [
    {
      id: '1',
      summary: 'Test Event 1',
      location: 'Berlin, Germany',
      description: 'Test Description 1',
      start: { dateTime: '2024-06-15T19:00:00Z' }
    },
    {
      id: '2',
      summary: 'Test Event 2',
      location: 'London, UK',
      description: 'Test Description 2',
      start: { dateTime: '2024-07-20T09:00:00Z' }
    }
  ];

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    // Mock the getEvents function to return test data
    api.getEvents.mockImplementation(() => Promise.resolve([...mockEvents]));
  });

  describe('Feature 1: Filter Events by City', () => {
    test('renders the EventList component', async () => {
      render(<App />);
      // Wait for loading state to complete
      await waitFor(() => {
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
      });
      expect(screen.getByRole('list', { name: /events/i })).toBeInTheDocument();
    });

    test('renders the CitySearch component', async () => {
      render(<App />);
      // Wait for loading state to complete
      await waitFor(() => {
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
      });
      expect(screen.getByRole('textbox', { name: /city/i })).toBeInTheDocument();
    });

    test('updates events when a city is selected', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Wait for loading state to complete and initial data to be set
      await waitFor(() => {
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
        const eventsList = screen.getByRole('list', { name: /events/i });
        expect(eventsList.children).toHaveLength(mockEvents.length);
      });

      const citySearch = screen.getByRole('textbox', { name: /city/i });
      await user.type(citySearch, 'Berlin');
      
      // Wait for suggestions to be updated with a more specific condition
      await waitFor(() => {
        const suggestions = screen.getByRole('listbox', { name: /suggestions/i });
        const options = within(suggestions).getAllByRole('option');
        const filteredOptions = options.map(option => option.textContent);
        expect(filteredOptions).toContain('Berlin, Germany');
        expect(filteredOptions).toContain('See all cities');
      });

      const suggestions = screen.getByRole('listbox', { name: /suggestions/i });
      const berlinOption = within(suggestions).getAllByRole('option')
        .find(option => option.textContent === 'Berlin, Germany');
      
      expect(berlinOption).toBeDefined();
      await user.click(berlinOption);

      // Should only show Berlin events
      await waitFor(() => {
        const updatedEvents = screen.getAllByRole('listitem');
        expect(updatedEvents).toHaveLength(1);
        expect(updatedEvents[0]).toHaveTextContent('Berlin');
      });
    });

    test('shows all events when "See all cities" is selected', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      await waitFor(() => {
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
      });

      // First select Berlin to filter
      const citySearch = screen.getByRole('textbox', { name: /city/i });
      await user.type(citySearch, 'Berlin');
      const suggestions = screen.getByRole('listbox', { name: /suggestions/i });
      const berlinOption = within(suggestions).getAllByRole('option')[0];
      await user.click(berlinOption);

      // Then select "See all cities"
      await user.click(citySearch);
      const allSuggestions = screen.getByRole('listbox', { name: /suggestions/i });
      const seeAllCitiesOption = within(allSuggestions).getAllByRole('option')[1];
      await user.click(seeAllCitiesOption);

      const eventsList = screen.getByRole('list', { name: /events/i });
      await waitFor(() => {
        expect(eventsList.children).toHaveLength(mockEvents.length);
      });
    });
  });

  describe('Feature 3: Specify Number of Events', () => {
    test('renders NumberOfEvents component', async () => {
      const { container } = render(<App />);
      
      await waitFor(() => {
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
      });

      const numberOfEventsComponent = container.firstChild.querySelector('#number-of-events');
      expect(numberOfEventsComponent).toBeInTheDocument();
      expect(numberOfEventsComponent).toContainElement(
        screen.getByRole('spinbutton', { name: /number of events/i })
      );
    });

    test('updates number of visible events when user changes the number', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      await waitFor(() => {
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
      });

      const numberInput = screen.getByRole('spinbutton', { name: /number of events/i });
      await user.clear(numberInput);
      await user.type(numberInput, '1');

      const eventsList = screen.getByRole('list', { name: /events/i });
      expect(eventsList.children).toHaveLength(1);
    });

    test('shows correct number of events after city selection and number change', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Wait for loading state to complete and initial data to be set
      await waitFor(() => {
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
        const eventsList = screen.getByRole('list', { name: /events/i });
        expect(eventsList.children).toHaveLength(mockEvents.length);
      });

      const citySearch = screen.getByRole('textbox', { name: /city/i });
      await user.type(citySearch, 'London');
      
      // Wait for suggestions to be updated with a more specific condition
      await waitFor(() => {
        const suggestions = screen.getByRole('listbox', { name: /suggestions/i });
        const options = within(suggestions).getAllByRole('option');
        const hasLondon = options.some(option => option.textContent === 'London, UK');
        const hasAllCities = options.some(option => option.textContent === 'See all cities');
        expect(hasLondon && hasAllCities).toBe(true);
      });

      const suggestions = screen.getByRole('listbox', { name: /suggestions/i });
      const londonOption = within(suggestions).getAllByRole('option')
        .find(option => option.textContent === 'London, UK');
      
      expect(londonOption).toBeDefined();
      await user.click(londonOption);

      // Then change number of events
      const numberInput = screen.getByRole('spinbutton', { name: /number of events/i });
      await user.clear(numberInput);
      await user.type(numberInput, '1');

      // Wait for events to be updated
      await waitFor(() => {
        const updatedEvents = screen.getAllByRole('listitem');
        expect(updatedEvents).toHaveLength(1);
        expect(updatedEvents[0]).toHaveTextContent('London');
      });
    });
  });

  describe('Error Handling and Loading States', () => {
    test('shows loading state while fetching events', () => {
      render(<App />);
      expect(screen.getByRole('status')).toHaveTextContent('Loading events...');
    });

    test('shows error state when API call fails', async () => {
      const errorMessage = 'Failed to fetch events. Please try again later.';
      api.getEvents.mockRejectedValueOnce(new Error('API Error'));
      
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(errorMessage);
      });
    });

    test('handles empty events array gracefully', async () => {
      api.getEvents.mockResolvedValueOnce([]);
      
      render(<App />);
      
      await waitFor(() => {
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
      });

      const eventsList = screen.getByRole('list', { name: /events/i });
      expect(eventsList).toHaveTextContent('No events found');
    });
  });
}); 