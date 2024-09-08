import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CreateNewAccount } from './create-account';
import { MemoryRouter } from 'react-router-dom';

describe('Create Account component', () => {
  // Utility to fill out the form
  // const fillForm = async () => {
  //   const usernameInput = screen.getByLabelText(/username/i);
  //   const passwordInput = screen.getByLabelText(/password/i);

  //   fireEvent.change(usernameInput, { target: { value: 'validusername' } });
  //   fireEvent.change(passwordInput, { target: { value: 'validPassword123' } });

  //   await waitFor(() => expect(usernameInput).toHaveValue('validusername'));
  //   await waitFor(() => expect(passwordInput).toHaveValue('validPassword123'));
  // };

  test.only('renders the form correctly', () => {
    render(
      <MemoryRouter>
        <CreateNewAccount />
      </MemoryRouter>
    );

    // Check that all the form fields are present
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });
});
