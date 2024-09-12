import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CreateNewAccount } from './create-account';
import { MemoryRouter } from 'react-router-dom';

jest.mock('zxcvbn', () => jest.fn(() => ({ score: 3 })));
jest.mock('app/frontend/reusable-components/spinner');
global.fetch = jest.fn();

describe('CreateNewAccount Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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

    expect(submitButton).toBeDisabled();

    fireEvent.change(usernameInput, { target: { value: 'short' } });
    fireEvent.change(passwordInput, { target: { value: 'shortPassword1' } });

    expect(submitButton).toBeDisabled();
  });

  test('should enable the Create Account button for valid inputs', async () => {
    render(
      <MemoryRouter>
        <CreateNewAccount />
      </MemoryRouter>
    );

    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /Create Account/i });

    fireEvent.change(usernameInput, { target: { value: 'validUsername123' } });
    fireEvent.change(passwordInput, { target: { value: 'ValidPassword123456789' } });

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

    fireEvent.change(usernameInput, { target: { value: 'shortUser' } });
    fireEvent.change(passwordInput, { target: { value: 'shortPassword1' } });

    const submitButton = screen.getByRole('button', { name: /Create Account/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Username must be between 10 and 50 characters./)).toBeInTheDocument();
      expect(screen.getByText(/Password must be between 20 and 50 characters./)).toBeInTheDocument();
    });
  });

  // test('should call the API and store token on successful submission', async () => {
  //   global.fetch.mockResolvedValue({
  //     ok: true,
  //     json: jest.fn().mockResolvedValue({ token: 'fake-token' }),
  //   });

  //   render(
  //     <MemoryRouter>
  //       <CreateNewAccount />
  //     </MemoryRouter>
  //   );

  //   fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'validUsername123' } });
  //   fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'ValidPassword123456789' } });

  //   fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

  //   await waitFor(() => {
  //     expect(global.fetch).toHaveBeenCalledWith('/api/create-account', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         username: 'validUsername123',
  //         password: 'ValidPassword123456789',
  //         funFact: '',
  //       }),
  //     });
  //     expect(localStorage.getItem('token')).toBe('fake-token');
  //   });
  // });
});
