import { render, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CitySearch from '../components/CitySearch';
import React from 'react';
import { getEvents, extractLocations } from '../api';

describe('<CitySearch /> component', () => {
  test('renders text input', () => {
    const { queryByRole } = render(<CitySearch />);
    const textbox = queryByRole('textbox');
    expect(textbox).toBeInTheDocument();
  });

  test('renders a list of suggestions when city textbox gains focus', async () => {
    const { queryByRole } = render(<CitySearch />);
    const user = userEvent.setup();
    const cityTextBox = queryByRole('textbox');
    
    await act(async () => {
      await user.click(cityTextBox);
    });
    
    const suggestionList = queryByRole('list');
    expect(suggestionList).toBeInTheDocument();
    expect(suggestionList).toHaveClass('suggestions');
  });

  // InfoAlert Tests
  test('shows info alert when no cities match search', async () => {
    const setInfoAlert = jest.fn();
    const user = userEvent.setup();
    const { getByRole } = render(<CitySearch setInfoAlert={setInfoAlert} setErrorAlert={() => {}} />);
    
    await act(async () => {
      await user.type(getByRole('textbox'), 'xyz');
    });
    
    expect(setInfoAlert).toHaveBeenCalledWith('No cities match your search. Please try another city.');
  });

  test('clears info alert when cities match search', async () => {
    const setInfoAlert = jest.fn();
    const user = userEvent.setup();
    const { getByRole } = render(<CitySearch setInfoAlert={setInfoAlert} setErrorAlert={() => {}} />);
    
    await act(async () => {
      await user.type(getByRole('textbox'), 'Berlin');
    });
    
    expect(setInfoAlert).toHaveBeenCalledWith('');
  });

  test('clears info alert when input is empty', async () => {
    const setInfoAlert = jest.fn();
    const user = userEvent.setup();
    const { getByRole } = render(<CitySearch setInfoAlert={setInfoAlert} setErrorAlert={() => {}} />);
    
    await act(async () => {
      await user.type(getByRole('textbox'), ' ');
      await user.clear(getByRole('textbox'));
    });
    
    expect(setInfoAlert).toHaveBeenCalledWith('');
  });
}); 