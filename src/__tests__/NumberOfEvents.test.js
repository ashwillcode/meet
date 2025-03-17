import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NumberOfEvents from '../components/NumberOfEvents';

describe('<NumberOfEvents /> component', () => {
  test('renders number of events input', () => {
    render(<NumberOfEvents setErrorAlert={() => {}} />);
    expect(screen.getByRole('spinbutton')).toBeInTheDocument();
  });

  test('default number of events is 32', () => {
    render(<NumberOfEvents setErrorAlert={() => {}} />);
    expect(screen.getByRole('spinbutton')).toHaveValue(32);
  });

  test('updates number of events when user types', async () => {
    const user = userEvent.setup();
    render(<NumberOfEvents setErrorAlert={() => {}} />);
    const input = screen.getByRole('spinbutton');

    await act(async () => {
      await user.clear(input);
      await user.type(input, '10');
    });

    expect(input).toHaveValue(10);
  });

  test('shows error for invalid input', async () => {
    const user = userEvent.setup();
    render(<NumberOfEvents setErrorAlert={() => {}} />);
    const input = screen.getByRole('spinbutton');

    await act(async () => {
      await user.clear(input);
      await user.type(input, '-1');
    });

    expect(screen.getByText('Number must be greater than 0')).toBeInTheDocument();
  });

  test('accepts custom initial number of events', () => {
    render(<NumberOfEvents numberOfEvents={50} setErrorAlert={() => {}} />);
    expect(screen.getByRole('spinbutton')).toHaveValue(50);
  });

  test('calls onNumberChange with valid numbers only', async () => {
    const onNumberChange = jest.fn();
    const user = userEvent.setup();
    render(<NumberOfEvents onNumberChange={onNumberChange} setErrorAlert={() => {}} />);
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

  test('shows error for invalid number input', async () => {
    const user = userEvent.setup();
    render(<NumberOfEvents setErrorAlert={() => {}} />);
    const input = screen.getByRole('spinbutton');

    // Test with zero (invalid number)
    await act(async () => {
      await user.clear(input);
      await user.type(input, '0');
    });

    expect(screen.getByText('Number must be greater than 0')).toBeInTheDocument();
  });

  test('shows error for empty input', async () => {
    const user = userEvent.setup();
    render(<NumberOfEvents setErrorAlert={() => {}} />);
    const input = screen.getByRole('spinbutton');

    await act(async () => {
      await user.clear(input);
    });

    expect(screen.getByText('Number is required')).toBeInTheDocument();
  });

  test('calls setErrorAlert with appropriate messages', async () => {
    const setErrorAlert = jest.fn();
    const user = userEvent.setup();
    render(<NumberOfEvents setErrorAlert={setErrorAlert} />);
    const input = screen.getByRole('spinbutton');

    // Test empty input
    await act(async () => {
      await user.clear(input);
    });
    expect(setErrorAlert).toHaveBeenCalledWith('Number is required');

    // Test negative number
    await act(async () => {
      await user.clear(input);
      await user.type(input, '-1');
    });
    expect(setErrorAlert).toHaveBeenCalledWith('Number must be greater than 0');

    // Test zero (invalid number)
    await act(async () => {
      await user.clear(input);
      await user.type(input, '0');
    });
    expect(setErrorAlert).toHaveBeenCalledWith('Number must be greater than 0');

    // Test valid number clears error
    await act(async () => {
      await user.clear(input);
      await user.type(input, '10');
    });
    expect(setErrorAlert).toHaveBeenCalledWith('');
  });
}); 