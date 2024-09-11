import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { FC, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

type ProtectedRoutesProps = {
  children: JSX.Element;
};

export const ProtectedRoutes: FC<ProtectedRoutesProps> = ({ children }) => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      const decodedToken: { exp?: number } = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Convert time in seconds

      if (!decodedToken.exp || decodedToken.exp < currentTime) {
        console.error('[verification_failure]: Token expired or missing exp claim');
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.post<{ valid: boolean; error?: string }>('/api/verify-token', null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsAuthenticated(response.data.valid);
      } catch (error) {
        console.error('[verification_failure]: Token verification failed', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, []);

  if (isLoading) {
    return <div>Loading...(TODO: Some nice UI coming later)</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/create-account" state={{ from: location }} replace />;
  }

  return children;
};
