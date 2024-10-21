import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AppFunctional from './AppFunctional';

test('sanity', () => {
  expect(true).toBe(true)
});

test('typing in the email input changes its value', () => {
  render(<AppFunctional />);
  const emailInput = screen.getByPlaceholderText(/type email/i);

  fireEvent.change(emailInput, { target: { value: 'jondoe@email.com' } });

  expect(emailInput.value).toBe('jondoe@email.com');
});

test('renders the coordinates text', () => {
  render(<AppFunctional />);
  const coordinatesElement = screen.getByText(/Coordinates/i);
  expect(coordinatesElement).toBeInTheDocument();
});

test('renders the steps text', () => {
  render(<AppFunctional />);
  const stepsElement = screen.getByText(/You moved 0 times/i);
  expect(stepsElement).toBeInTheDocument();
});

test('render all movement buttons', () => {
  render(<AppFunctional />);

  expect(screen.getByText(/left/i)).toBeInTheDocument();
  expect(screen.getByText(/right/i)).toBeInTheDocument();
  expect(screen.getByText(/up/i)).toBeInTheDocument();
  expect(screen.getByText(/down/i)).toBeInTheDocument();
});

test('clicking reset resets steps and message', () => {
  render(<AppFunctional />);

  const resetButton = screen.getByText(/reset/i);
  fireEvent.click(resetButton);

  const stepsElement = screen.getByText(/You moved 0 times/i);
  expect(stepsElement).toBeInTheDocument();

  const messageElement = screen.getByTestId('message');
  expect(messageElement).toBeInTheDocument();
  expect(messageElement.textContent).toBe('');
});