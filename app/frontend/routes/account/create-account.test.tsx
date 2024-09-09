import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CreateNewAccount } from './create-account';
import { MemoryRouter } from 'react-router-dom';

describe('Create Account component', () => {
  const setup = () => {
    render(
      <MemoryRouter>
        <CreateNewAccount />
      </MemoryRouter>
    );

    const USERNAME_LABEL = /username/i;
    const PASSWORD_LABEL = /password/i;
    const SUBMIT_BUTTON_LABEL = /create account/i;

    return { USERNAME_LABEL, PASSWORD_LABEL, SUBMIT_BUTTON_LABEL };
  };

  test('renders the form correctly', async () => {
    const { USERNAME_LABEL, PASSWORD_LABEL, SUBMIT_BUTTON_LABEL } = setup();

    // Check that all the form fields are present
    expect(screen.getByLabelText(USERNAME_LABEL)).toBeInTheDocument();
    expect(screen.getByLabelText(PASSWORD_LABEL)).toBeInTheDocument();

    const createAccountBtn = screen.getByRole('button', { name: SUBMIT_BUTTON_LABEL });
    expect(createAccountBtn).toBeInTheDocument();
    // Create account button will be disabled when form renders
    expect(createAccountBtn).toBeDisabled();
  });

  test('displays validation error for the username field if input is invalid', async () => {
    const { USERNAME_LABEL } = setup();

    fireEvent.input(screen.getByLabelText(USERNAME_LABEL), {
      target: {
        value: 'test', // Invalid username (too short)
      },
    });

    // Wait for validation error to appear
    await waitFor(() => {
      expect(screen.getByText('Username must be at least 10 characters')).toBeInTheDocument();
    });
  });

  test('displays validation errors for the password field when input is invalid', async () => {
    const { PASSWORD_LABEL } = setup();

    fireEvent.input(screen.getByLabelText(PASSWORD_LABEL), {
      target: {
        value: 'test', // Invalid password (too short)
      },
    });

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 20 characters')).toBeInTheDocument();
    });

    // When password passes minimum character validation criteria but does not satisfy other validations
    fireEvent.input(screen.getByLabelText(PASSWORD_LABEL), {
      target: {
        value: 'indexindexindexindexindex', // Invalid password (no number)
      },
    });

    await waitFor(() => {
      expect(
        screen.getByText('Password must contain at least one letter between [a-zA-Z] and one number between [1-9]')
      ).toBeInTheDocument();
    });

    // When password passes minimum character validation criteria but has strength score less than 2
    fireEvent.input(screen.getByLabelText(PASSWORD_LABEL), {
      target: {
        value: 'aaaaaaaaaaaaaaaaaaaaaaaa1', // Invalid password (weak password)
      },
    });

    await waitFor(() => {
      expect(screen.getByText('Password strength must be at least 2')).toBeInTheDocument();
    });
  });

  // Test password strength levels displayed based on input
  test('displays the correct strength keywords for each password strength level', async () => {
    const { PASSWORD_LABEL } = setup();

    // Simulate weak password input
    fireEvent.input(screen.getByLabelText(PASSWORD_LABEL), {
      target: {
        value: 'test',
      },
    });

    const passwordStrengthKeyword = screen.getByTestId('password-strength');

    await waitFor(() => {
      expect(passwordStrengthKeyword).toHaveTextContent('Very Weak');
    });

    // Simulate weak password input with a slight improvement
    fireEvent.input(screen.getByLabelText(PASSWORD_LABEL), {
      target: {
        value: 'test1',
      },
    });

    await waitFor(() => {
      expect(passwordStrengthKeyword).toHaveTextContent('Weak');
    });

    // Simulate medium strength password
    fireEvent.input(screen.getByLabelText(PASSWORD_LABEL), {
      target: {
        value: 'test1Tester',
      },
    });

    await waitFor(() => {
      expect(passwordStrengthKeyword).toHaveTextContent('Medium');
    });

    // Simulate strong password
    fireEvent.input(screen.getByLabelText(PASSWORD_LABEL), {
      target: {
        value: 'test1Tester12',
      },
    });

    await waitFor(() => {
      expect(passwordStrengthKeyword).toHaveTextContent('Strong');
    });

    // Simulate very strong password
    fireEvent.input(screen.getByLabelText(PASSWORD_LABEL), {
      target: {
        value: 'test1Tester12Long',
      },
    });

    await waitFor(() => {
      expect(passwordStrengthKeyword).toHaveTextContent('Very Strong');
    });
  });

  // TODO: Implement test to check valid form submission functionality. Ref: https://react-hook-form.com/advanced-usage#TestingForm
  // TODO: Implement test to check honeypot functionality
});
