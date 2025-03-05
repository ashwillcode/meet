import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CitySearch from '../components/CitySearch';
import React from 'react';

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
    
    await user.click(cityTextBox);
    
    const suggestionList = queryByRole('list');
    expect(suggestionList).toBeInTheDocument();
    expect(suggestionList).toHaveClass('suggestions');
  });
}); 