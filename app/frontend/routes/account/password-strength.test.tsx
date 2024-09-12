import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; // Provides custom matchers like .toBeInTheDocument()
import { CreateNewAccount } from './create-account'; // Adjust the import path as necessary
import { MemoryRouter } from 'react-router-dom';

describe('CreateNewAccount Component - Password Strength', () => {
  test('should initially show "Very Weak" password strength when the password field is empty', () => {
    render(
      <MemoryRouter>
        <CreateNewAccount />
      </MemoryRouter>
    );

    // Initially, password strength should be "Very Weak" since no password has been entered
    expect(screen.getByText('Password Strength: Very Weak')).toBeInTheDocument();
  });

  test('should show "Weak" password strength for a weak password', async () => {
    render(
      <MemoryRouter>
        <CreateNewAccount />
      </MemoryRouter>
    );

    const passwordInput = screen.getByLabelText('Password');

    // Change the password input to a weak password
    fireEvent.change(passwordInput, { target: { value: 'weakpassword' } });

    await waitFor(() => {
      expect(screen.getByText('Password Strength: Weak')).toBeInTheDocument();
    });
  });

  test('should show "Medium" password strength for a medium strength password', async () => {
    render(
      <MemoryRouter>
        <CreateNewAccount />
      </MemoryRouter>
    );

    const passwordInput = screen.getByLabelText('Password');

    // Change the password input to a medium strength password
    fireEvent.change(passwordInput, { target: { value: 'validPassword12' } });

    await waitFor(() => {
      expect(screen.getByText('Password Strength: Medium')).toBeInTheDocument();
    });
  });

  test('should show "Strong" password strength for a strong password', async () => {
    render(
      <MemoryRouter>
        <CreateNewAccount />
      </MemoryRouter>
    );

    const passwordInput = screen.getByLabelText('Password');

    // Change the password input to a strong password
    fireEvent.change(passwordInput, { target: { value: 'StrongPassword123!' } });

    await waitFor(() => {
      expect(screen.getByText('Password Strength: Strong')).toBeInTheDocument();
    });
  });

  test('should show "Very Strong" password strength for a very strong password', async () => {
    render(
      <MemoryRouter>
        <CreateNewAccount />
      </MemoryRouter>
    );

    const passwordInput = screen.getByLabelText('Password');

    // Change the password input to a very strong password
    fireEvent.change(passwordInput, { target: { value: 'VeryStrongPassword123!' } });

    await waitFor(() => {
      expect(screen.getByText('Password Strength: Very Strong')).toBeInTheDocument();
    });
  });
});
