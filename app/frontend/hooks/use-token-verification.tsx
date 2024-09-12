// import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';

export const useTokenVerification = (): {
  isLoading: boolean;
  isAuthenticated: boolean | null;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean | null>>;
} => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const verifyToken = async () => {
      // Verify if token exists
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        setIsAuthenticated(false);
        return;
      }

      // Verify if token has not expired
      const decodedToken: { exp?: number } = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Time in seconds

      if (!decodedToken.exp || decodedToken.exp < currentTime) {
        console.error('[token_verification_error]: Token expired or missing expired claim');
        setIsLoading(false);
        setIsAuthenticated(false);
        return;
      }

      // Verify token on the server
      try {
        const response = await fetch('/api/verify-token', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        // Expected response from server is either { valid: true, error: "" } OR { valid: false, error: <error message> }
        const data: { valid: boolean; error?: string } = await response.json();
        if (response.ok) {
          setIsAuthenticated(data.valid);
        } else {
          if (data.error) {
            console.error('[token_verification_error]:', data.error);
          } else {
            console.error('An unknown error has occurred');
          }
          setIsAuthenticated(false);
        }
      } catch (error) {
        if (error) {
          console.error('[token_verification_error]: Token verification failed', error);
        } else {
          console.error('An unknown error has occurred');
        }
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, []);
  return { isLoading, isAuthenticated, setIsAuthenticated };
};
