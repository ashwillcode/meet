import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NumberOfEvents from '../components/NumberOfEvents';

describe('<NumberOfEvents /> component', () => {
  test('renders number of events input', () => {
    render(<NumberOfEvents />);
    expect(screen.getByRole('spinbutton')).toBeInTheDocument();
  });

  test('default number of events is 32', () => {
    render(<NumberOfEvents />);
    expect(screen.getByRole('spinbutton')).toHaveValue(32);
  });

  test('updates number of events when user types', async () => {
    const user = userEvent.setup();
    render(<NumberOfEvents />);
    const input = screen.getByRole('spinbutton');

    await act(async () => {
      await user.clear(input);
      await user.type(input, '10');
    });

    expect(input).toHaveValue(10);
  });

  test('shows error for invalid input', async () => {
    const user = userEvent.setup();
    render(<NumberOfEvents />);
    const input = screen.getByRole('spinbutton');

    await act(async () => {
      await user.clear(input);
      await user.type(input, '-1');
    });

    expect(screen.getByText('Number must be greater than 0')).toBeInTheDocument();
  });

  test('accepts custom initial number of events', () => {
    render(<NumberOfEvents numberOfEvents={50} />);
    expect(screen.getByRole('spinbutton')).toHaveValue(50);
  });

  test('calls onNumberChange with valid numbers only', async () => {
    const onNumberChange = jest.fn();
    const user = userEvent.setup();
    render(<NumberOfEvents onNumberChange={onNumberChange} />);
    const input = screen.getByRole('spinbutton');

    await act(async () => {
      await user.clear(input);
      await user.type(input, '15');
    });

    expect(onNumberChange).toHaveBeenCalledWith(15);

    await act(async () => {
      await user.clear(input);
      await user.type(input, '-1');
    });

    // onNumberChange should not be called with invalid number
    expect(onNumberChange).not.toHaveBeenCalledWith(-1);
  });
}); 