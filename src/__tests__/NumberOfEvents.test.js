import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NumberOfEvents from '../components/NumberOfEvents';

describe('<NumberOfEvents /> component', () => {
  test('renders number of events input with proper accessibility labels', () => {
    render(<NumberOfEvents />);
    const input = screen.getByRole('spinbutton', { name: /number of events/i });
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-label', 'Number of events to display');
    expect(input).toHaveAttribute('type', 'number');
  });

  test('default value is 32', () => {
    render(<NumberOfEvents />);
    const input = screen.getByRole('spinbutton', { name: /number of events/i });
    expect(input).toHaveValue(32);
  });

  test('updates value when user types a new number', async () => {
    const user = userEvent.setup();
    render(<NumberOfEvents />);
    const input = screen.getByRole('spinbutton', { name: /number of events/i });
    
    await user.clear(input);
    await user.type(input, '10');
    
    expect(input).toHaveValue(10);
  });

  test('calls onChange handler when value changes', async () => {
    const handleNumberChange = jest.fn();
    const user = userEvent.setup();
    render(
      <NumberOfEvents 
        numberOfEvents={32} 
        onNumberChange={handleNumberChange}
      />
    );
    
    const input = screen.getByRole('spinbutton', { name: /number of events/i });
    await user.clear(input);
    await user.type(input, '10');
    
    expect(handleNumberChange).toHaveBeenCalledWith(10);
  });

  test('does not allow negative numbers', async () => {
    const user = userEvent.setup();
    render(<NumberOfEvents />);
    const input = screen.getByRole('spinbutton', { name: /number of events/i });
    
    // First set a positive number
    await user.clear(input);
    await user.type(input, '5');
    expect(input).toHaveValue(5);

    // Then try to make it negative
    await user.clear(input);
    await user.type(input, '-');
    expect(input).toHaveValue(0);
    expect(screen.getByText('Please enter a valid number')).toBeInTheDocument();
  });

  test('shows error message for invalid input', async () => {
    const user = userEvent.setup();
    render(<NumberOfEvents />);
    const input = screen.getByRole('spinbutton', { name: /number of events/i });
    
    await user.clear(input);
    await user.type(input, '1001');
    
    expect(input).toHaveValue(1000);
    expect(screen.getByText(/please enter a number between 1 and 1000/i)).toBeInTheDocument();
  });

  test('handles missing props gracefully', () => {
    render(<NumberOfEvents />);
    const input = screen.getByRole('spinbutton', { name: /number of events/i });
    expect(input).toHaveValue(32);
  });
}); 