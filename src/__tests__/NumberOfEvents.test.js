import { render } from '@testing-library/react';
import React from 'react';
import NumberOfEvents from '../components/NumberOfEvents';

describe('<NumberOfEvents /> component', () => {
  test('renders number of events input', () => {
    const { getByRole } = render(<NumberOfEvents />);
    expect(getByRole('textbox')).toBeInTheDocument();
  });

  test('default number of events is 32', () => {
    const { getByRole } = render(<NumberOfEvents />);
    expect(getByRole('textbox').value).toBe('32');
  });
}); 