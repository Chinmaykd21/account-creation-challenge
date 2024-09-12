import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; // Provides custom matchers like .toBeInTheDocument()
import { MemoryRouter } from 'react-router-dom';
import { CreateNewAccount } from './create-account';

describe('CreateNewAccount Component', () => {
  beforeEach(() => {
    localStorage.clear(); // Clear localStorage before each test
  });

  test('should render the form fields and submit button', () => {
    render(
      <MemoryRouter>
        <CreateNewAccount />
      </MemoryRouter>
    );

    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    const submitButton = screen.getByRole('button', { name: /Create Account/i });
    expect(submitButton).toBeInTheDocument();
  });

  test('should display validation errors for invalid inputs', async () => {
    render(
      <MemoryRouter>
        <CreateNewAccount />
      </MemoryRouter>
    );

    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /Create Account/i });

    // Simulate invalid input
    fireEvent.change(usernameInput, { target: { value: 'short' } });
    fireEvent.change(passwordInput, { target: { value: 'short1' } });

    // Attempt to submit the form
    fireEvent.click(submitButton);

    // Wait for validation errors to appear
    await waitFor(() => {
      expect(screen.getByText(/Username must be between 10 and 50 characters/)).toBeInTheDocument();
      expect(screen.getByText(/Password must be between 20 and 50 characters/)).toBeInTheDocument();
    });
  });

  test('should call the API and store token on successful submission', async () => {
    // Mock the API response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: 'fake-token' }),
      })
    ) as jest.Mock;

    render(
      <MemoryRouter>
        <CreateNewAccount />
      </MemoryRouter>
    );

    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /Create Account/i });

    // Fill in valid inputs
    fireEvent.change(usernameInput, { target: { value: 'validUsername123' } });
    fireEvent.change(passwordInput, { target: { value: 'ValidPassword1234567890' } });

    // Submit the form
    fireEvent.click(submitButton);

    // Ensure fetch is called with the correct arguments
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/create-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'validUsername123',
          password: 'ValidPassword1234567890',
          funFact: '',
        }),
      });
    });

    // Check if the token is stored in localStorage
    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('fake-token');
    });
  });

  test('should show an error message if form submission fails', async () => {
    // Mock a failed API response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: '[account_creation_error]: Account creation failed' }),
      })
    ) as jest.Mock;

    render(
      <MemoryRouter>
        <CreateNewAccount />
      </MemoryRouter>
    );

    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /Create Account/i });

    // Fill in valid inputs
    fireEvent.change(usernameInput, { target: { value: 'validUsername123' } });
    fireEvent.change(passwordInput, { target: { value: 'ValidPassword1234567890' } });

    // Submit the form
    fireEvent.click(submitButton);

    // Check if the error message is displayed
    await waitFor(() => {
      expect(screen.getByText('[account_creation_error]: Account creation failed')).toBeInTheDocument();
    });
  });
});
