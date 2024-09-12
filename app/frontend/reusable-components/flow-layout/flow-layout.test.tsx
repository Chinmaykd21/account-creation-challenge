import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { jwtDecode } from 'jwt-decode';
import { MemoryRouter } from 'react-router-dom';
import { CreateNewAccount } from 'app/frontend/routes/account/create-account';

jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(),
}));

global.fetch = jest.fn();

describe('FlowLayout and useTokenVerification hook', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockReset();
    (jwtDecode as jest.Mock).mockReset();
    localStorage.clear();
  });

  test('should show Logout button when token is valid and authenticated', async () => {
    // Mock localStorage token
    localStorage.setItem('token', 'valid-token');

    // Mock jwtDecode to return a valid token
    (jwtDecode as jest.Mock).mockReturnValue({ exp: Date.now() / 1000 + 3600 }); // Token expiring in 1 hour

    // Mock fetch to return a valid response
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ valid: true }),
    });

    render(
      <MemoryRouter>
        <CreateNewAccount />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });
  });

  test('should remove token and redirect on Logout button click', async () => {
    // Mock localStorage token
    localStorage.setItem('token', 'valid-token');

    // Mock jwtDecode to return a valid token
    (jwtDecode as jest.Mock).mockReturnValue({ exp: Date.now() / 1000 + 3600 }); // Token expiring in 1 hour

    // Mock fetch to return a valid response
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ valid: true }),
    });

    render(
      <MemoryRouter>
        <CreateNewAccount />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Logout'));

    // Verify that the token is removed from localStorage
    expect(localStorage.getItem('token')).toBeNull();
    // Verify that Logout button is not rendered
    await waitFor(() => {
      expect(screen.queryByText('Logout')).not.toBeInTheDocument();
    });
  });

  test('should not show Logout button when token is missing', async () => {
    render(
      <MemoryRouter>
        <CreateNewAccount />
      </MemoryRouter>
    );

    // Verify that Logout button is not rendered
    await waitFor(() => {
      expect(screen.queryByText('Logout')).not.toBeInTheDocument();
    });
  });

  test('should handle expired token and not authenticate', async () => {
    localStorage.setItem('token', 'expired-token');

    (jwtDecode as jest.Mock).mockReturnValue({ exp: Date.now() / 1000 - 3600 }); // Token expired 1 hour ago

    render(
      <MemoryRouter>
        <CreateNewAccount />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Logout')).not.toBeInTheDocument();
    });
  });

  test('should handle server-side token verification failure', async () => {
    localStorage.setItem('token', 'invalid-token');

    (jwtDecode as jest.Mock).mockReturnValue({ exp: Date.now() / 1000 + 3600 }); // Token expiring in 1 hour

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ valid: false }),
    });

    render(
      <MemoryRouter>
        <CreateNewAccount />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Logout')).not.toBeInTheDocument();
    });
  });
});
