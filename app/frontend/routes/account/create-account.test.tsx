import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; // Provides custom matchers like .toBeInTheDocument()
import { CreateNewAccount } from './create-account'; // Adjust the import path as necessary
import zxcvbn from 'zxcvbn'; // Mocking zxcvbn library
import { MemoryRouter } from 'react-router-dom';

// Mocking zxcvbn library for password strength calculation
jest.mock('zxcvbn', () => jest.fn(() => ({ score: 1 }))); // Default mock returns weak password strength

describe('CreateNewAccount Component', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clears mock call history before each test
  });

  test('should disable the Create Account button for invalid inputs', async () => {
    render(
      <MemoryRouter>
        <CreateNewAccount />
      </MemoryRouter>
    );
    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /Create Account/i });

    // Initially, the button should be disabled since no input is provided
    expect(submitButton).toBeDisabled();

    fireEvent.change(usernameInput, { target: { value: 'short' } }); // Invalid username
    fireEvent.change(passwordInput, { target: { value: 'shortPassword1' } }); // Invalid password

    // The button should still be disabled because the password is too short
    expect(submitButton).toBeDisabled();
  });

  test('should enable the Create Account button for valid inputs', async () => {
    (zxcvbn as jest.Mock).mockReturnValue({ score: 3 });

    render(
      <MemoryRouter>
        <CreateNewAccount />
      </MemoryRouter>
    );

    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /Create Account/i });

    fireEvent.change(usernameInput, { target: { value: 'validUsername123' } }); // Valid username (more than 10 characters)
    fireEvent.change(passwordInput, { target: { value: 'ValidPassword123456789' } }); // Valid password (more than 50 characters)

    // "Create Account" button should now be enabled
    expect(submitButton).toBeEnabled();
  });

  test('should display error messages for invalid inputs', async () => {
    render(
      <MemoryRouter>
        <CreateNewAccount />
      </MemoryRouter>
    );

    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');

    fireEvent.change(usernameInput, { target: { value: 'shorthandP' } });
    fireEvent.change(passwordInput, { target: { value: 'shortPassword1' } });

    const submitButton = screen.getByRole('button', { name: /Create Account/i });
    // Attempt to submit the form
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Password must be between 20 and 50 characters./)).toBeInTheDocument();
    });
  });
});
