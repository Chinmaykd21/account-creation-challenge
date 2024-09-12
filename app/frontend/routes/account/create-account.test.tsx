import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; // Provides custom matchers like .toBeInTheDocument()
import { CreateNewAccount } from './create-account'; // Adjust the import path as necessary
import zxcvbn from 'zxcvbn'; // Mocking zxcvbn library
import { MemoryRouter } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';

jest.mock('zxcvbn', () => jest.fn(() => ({ score: 1 }))); // Default mock returns weak password strength
global.fetch = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// const mockNavigate = useNavigate as jest.Mock;

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

  test('should display an error message on submission failure', async () => {
    // Mocking the fetch API response for a submission error
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({ error: '[account_creation_error]: Account creation failed' }),
    });

    render(
      <MemoryRouter>
        <CreateNewAccount />
      </MemoryRouter>
    );

    // Fill in valid username and password
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'validUsername123' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'ValidPassword1234567890' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    // Ensure fetch was called with the correct arguments
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

    // Check if the error message is displayed
    await waitFor(() => {
      expect(screen.getByText('[account_creation_error]: Account creation failed')).toBeInTheDocument();
    });
  });

  test('should not submit the form if honeypot field is filled (bot detection)', async () => {
    render(
      <MemoryRouter>
        <CreateNewAccount />
      </MemoryRouter>
    );

    // Fill in valid username, password, and funFact (honeypot field, simulating a bot)
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'validUsername123' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'ValidPassword1234567890' } });
    fireEvent.change(screen.getByLabelText('FunFact'), { target: { value: 'bot detected' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    // Ensure fetch is not called (because the bot was detected)
    await waitFor(() => {
      expect(global.fetch).not.toHaveBeenCalled();
    });

    // Check if the bot detection error message is displayed
    await waitFor(() => {
      expect(screen.getByText('Bot detected. Submission has been blocked.')).toBeInTheDocument();
    });
  });
});
