import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CitySearch from '../components/CitySearch';
import { extractLocations, getEvents } from '../api';

describe('<CitySearch /> component', () => {
  let CitySearchComponent;
  let mockOnCitySelect;

  beforeEach(() => {
    mockOnCitySelect = jest.fn();
    CitySearchComponent = render(<CitySearch onCitySelect={mockOnCitySelect} />);
  });

  test('renders text input with proper accessibility labels', () => {
    const cityTextBox = CitySearchComponent.getByRole('textbox', { name: /city/i });
    expect(cityTextBox).toBeInTheDocument();
    expect(cityTextBox).toHaveClass('city');
    expect(cityTextBox).toHaveAttribute('aria-label', 'Enter a city');
    expect(cityTextBox).toHaveAttribute('aria-expanded', 'false');
  });

  test('suggestions list is hidden by default', () => {
    const suggestionList = CitySearchComponent.queryByRole('listbox', { name: /suggestions/i });
    expect(suggestionList).not.toBeInTheDocument();
  });

  test('renders a list of suggestions when city textbox gains focus', async () => {
    const user = userEvent.setup();
    const cityTextBox = CitySearchComponent.getByRole('textbox', { name: /city/i });
    
    await act(async () => {
      await user.click(cityTextBox);
    });
    
    const suggestionList = CitySearchComponent.getByRole('listbox', { name: /suggestions/i });
    expect(suggestionList).toBeInTheDocument();
    expect(suggestionList).toHaveClass('suggestions');
    expect(cityTextBox).toHaveAttribute('aria-expanded', 'true');
  });

  test('updates list of suggestions correctly when user types in city textbox', async () => {
    const user = userEvent.setup();
    const allEvents = await getEvents();
    const allLocations = extractLocations(allEvents);
    
    CitySearchComponent.rerender(
      <CitySearch 
        allLocations={allLocations} 
        onCitySelect={mockOnCitySelect}
      />
    );

    const cityTextBox = CitySearchComponent.getByRole('textbox', { name: /city/i });
    
    await act(async () => {
      await user.type(cityTextBox, "Berlin");
    });

    const suggestions = allLocations ? allLocations.filter((location) => {
      return location.toUpperCase().indexOf(cityTextBox.value.toUpperCase()) > -1;
    }) : [];

    const suggestionListItems = CitySearchComponent.getAllByRole('option');
    expect(suggestionListItems).toHaveLength(suggestions.length + 1);
    for (let i = 0; i < suggestions.length; i += 1) {
      expect(suggestionListItems[i].textContent).toBe(suggestions[i]);
    }
  });

  test('handles empty input gracefully', async () => {
    const user = userEvent.setup();
    const allEvents = await getEvents();
    const allLocations = extractLocations(allEvents);
    
    CitySearchComponent.rerender(
      <CitySearch 
        allLocations={allLocations} 
        onCitySelect={mockOnCitySelect}
      />
    );

    const cityTextBox = CitySearchComponent.getByRole('textbox', { name: /city/i });
    
    await act(async () => {
      await user.type(cityTextBox, " ");
    });
    
    const suggestionListItems = CitySearchComponent.getAllByRole('option');
    expect(suggestionListItems.length).toBe(allLocations.length + 1);
  });

  test('handles special characters in search', async () => {
    const user = userEvent.setup();
    const allEvents = await getEvents();
    const allLocations = extractLocations(allEvents);
    
    CitySearchComponent.rerender(
      <CitySearch 
        allLocations={allLocations} 
        onCitySelect={mockOnCitySelect}
      />
    );

    const cityTextBox = CitySearchComponent.getByRole('textbox', { name: /city/i });
    
    await act(async () => {
      await user.type(cityTextBox, "!@#$");
    });
    
    const suggestionList = CitySearchComponent.getByRole('listbox', { name: /suggestions/i });
    expect(suggestionList).toBeInTheDocument();
    expect(CitySearchComponent.getAllByRole('option')).toHaveLength(1);
  });

  test('is keyboard accessible', async () => {
    const user = userEvent.setup();
    const allEvents = await getEvents();
    const allLocations = extractLocations(allEvents);
    
    CitySearchComponent.rerender(
      <CitySearch 
        allLocations={allLocations} 
        onCitySelect={mockOnCitySelect}
      />
    );

    const cityTextBox = CitySearchComponent.getByRole('textbox', { name: /city/i });
    
    await act(async () => {
      await user.type(cityTextBox, "Berlin");
      await user.keyboard('{ArrowDown}');
    });
    
    const suggestionListItems = CitySearchComponent.getAllByRole('option');
    expect(suggestionListItems[0]).toHaveAttribute('aria-selected', 'true');
    expect(suggestionListItems[0]).toHaveAttribute('tabIndex', '0');
  });

  test('handles missing allLocations prop gracefully', () => {
    CitySearchComponent.rerender(<CitySearch onCitySelect={mockOnCitySelect} />);
    const cityTextBox = CitySearchComponent.getByRole('textbox', { name: /city/i });
    expect(cityTextBox).toBeInTheDocument();
    expect(cityTextBox.getAttribute('placeholder')).toBe('Search for a city');
  });

  test('renders the suggestion text in the textbox upon clicking on the suggestion', async () => {
    const user = userEvent.setup();
    const allEvents = await getEvents();
    const allLocations = extractLocations(allEvents);
    
    CitySearchComponent.rerender(
      <CitySearch 
        allLocations={allLocations} 
        onCitySelect={mockOnCitySelect}
      />
    );

    const cityTextBox = CitySearchComponent.getByRole('textbox', { name: /city/i });
    
    await act(async () => {
      await user.type(cityTextBox, "Berlin");
      const BerlinGermanySuggestion = CitySearchComponent.getAllByRole('option')[0];
      await user.click(BerlinGermanySuggestion);
    });

    expect(cityTextBox).toHaveValue("Berlin");
    expect(cityTextBox).toHaveAttribute('aria-expanded', 'false');
    expect(mockOnCitySelect).toHaveBeenCalledWith("Berlin");
  });

  test('closes suggestion list when escape key is pressed', async () => {
    const user = userEvent.setup();
    const allEvents = await getEvents();
    const allLocations = extractLocations(allEvents);
    
    CitySearchComponent.rerender(
      <CitySearch 
        allLocations={allLocations} 
        onCitySelect={mockOnCitySelect}
      />
    );

    const cityTextBox = CitySearchComponent.getByRole('textbox', { name: /city/i });
    
    await act(async () => {
      await user.type(cityTextBox, "Berlin");
      await user.keyboard('{Escape}');
    });

    const suggestionList = CitySearchComponent.queryByRole('listbox', { name: /suggestions/i });
    expect(suggestionList).not.toBeInTheDocument();
    expect(cityTextBox).toHaveAttribute('aria-expanded', 'false');
  });
}); 