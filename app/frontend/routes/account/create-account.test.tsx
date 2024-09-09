import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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

  test('renders the form correctly', async () => {
    render(
      <MemoryRouter>
        <CreateNewAccount />
      </MemoryRouter>
    );

    // Check that all the form fields are present
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    const createAccountBtn = screen.getByRole('button', { name: /create account/i });
    expect(createAccountBtn).toBeInTheDocument();
    // The create account button will be disabled when form renders
    expect(createAccountBtn).toBeDisabled();
  });

  test('shows validation errors for incorrect fields on submission', async () => {
    render(
      <MemoryRouter>
        <CreateNewAccount />
      </MemoryRouter>
    );

    fireEvent.input(screen.getByLabelText(/username/i), {
      target: {
        value: 'test',
      },
    });
    fireEvent.input(screen.getByLabelText(/password/i), {
      target: {
        value: 'test',
      },
    });

    const submitButton = screen.getByRole('button', { name: /Create Account/i });
    fireEvent.click(submitButton); // Click submit without filling in the form

    // Use waitFor to handle the async nature of form validation
    await waitFor(() => {
      expect(screen.getByText('Username must be at least 10 characters')).toBeInTheDocument();
      expect(screen.getByText('Password must be at least 20 characters')).toBeInTheDocument();
    });
  });

  // TODO: This test is not working
  // test('detects bot submission, and displays bot detection error message upon form submission', async () => {
  //   render(
  //     <MemoryRouter>
  //       <CreateNewAccount />
  //     </MemoryRouter>
  //   );

  //   fireEvent.change(screen.getByLabelText(/honeypot/i), {
  //     target: {
  //       value: 'test',
  //     },
  //   });

  //   // Simulate form click event
  //   fireEvent.click(screen.getByRole('button', { name: /create account/i }));

  //   // Use waitFor to handle the async nature of form validation
  //   await waitFor(() => {
  //     // Bot field detection validation error message is present in the dom
  //     expect(screen.getByText(/bot detected. submission has been blocked/i)).toBeInTheDocument();
  //   });
  // });
});
