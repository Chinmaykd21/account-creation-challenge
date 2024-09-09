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

  test('shows validation errors for incorrect form fields', async () => {
    render(
      <MemoryRouter>
        <CreateNewAccount />
      </MemoryRouter>
    );

    // When both fields have values but do not satisfy any validation criteria
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

    // Use waitFor to handle the async nature of form validation
    await waitFor(() => {
      expect(screen.getByText('Username must be at least 10 characters')).toBeInTheDocument();
      expect(screen.getByText('Password must be at least 20 characters')).toBeInTheDocument();
    });

    // When password passes minimum character validation criteria but does not satisfy other validations
    fireEvent.input(screen.getByLabelText(/password/i), {
      target: {
        value: 'indexindexindexindexindex',
      },
    });

    await waitFor(() => {
      expect(
        screen.getByText('Password must contain at least one letter between [a-zA-Z] and one number between [1-9]')
      ).toBeInTheDocument();
    });

    // When password passes minimum character validation criteria but has strength score less than 2
    fireEvent.input(screen.getByLabelText(/password/i), {
      target: {
        value: 'aaaaaaaaaaaaaaaaaaaaaaaa1',
      },
    });

    await waitFor(() => {
      expect(screen.getByText('Password strength must be at least 2')).toBeInTheDocument();
    });
  });

  test('updates password strength at different password values', async () => {
    render(
      <MemoryRouter>
        <CreateNewAccount />
      </MemoryRouter>
    );

    fireEvent.input(screen.getByLabelText(/password/i), {
      target: {
        value: 'test',
      },
    });

    // Use waitFor to handle the async nature of form validation
    await waitFor(() => {
      expect(screen.getByTestId('password-strength')).toHaveTextContent('Very Weak');
    });

    fireEvent.input(screen.getByLabelText(/password/i), {
      target: {
        value: 'test1',
      },
    });

    // Use waitFor to handle the async nature of form validation
    await waitFor(() => {
      expect(screen.getByTestId('password-strength')).toHaveTextContent('Weak');
    });

    fireEvent.input(screen.getByLabelText(/password/i), {
      target: {
        value: 'test1Tester',
      },
    });

    // Use waitFor to handle the async nature of form validation
    await waitFor(() => {
      expect(screen.getByTestId('password-strength')).toHaveTextContent('Medium');
    });

    fireEvent.input(screen.getByLabelText(/password/i), {
      target: {
        value: 'test1Tester12',
      },
    });

    // Use waitFor to handle the async nature of form validation
    await waitFor(() => {
      expect(screen.getByTestId('password-strength')).toHaveTextContent('Strong');
    });

    fireEvent.input(screen.getByLabelText(/password/i), {
      target: {
        value: 'test1Tester12Long',
      },
    });

    // Use waitFor to handle the async nature of form validation
    await waitFor(() => {
      expect(screen.getByTestId('password-strength')).toHaveTextContent('Very Strong');
    });
  });

  // TODO: Implement test to check valid form submission functionality. Ref: https://react-hook-form.com/advanced-usage#TestingForm
  // TODO: Implement test to check honeypot functionality
});
