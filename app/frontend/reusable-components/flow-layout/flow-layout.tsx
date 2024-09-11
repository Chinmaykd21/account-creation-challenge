import axios from 'axios';
import React, { ReactNode, useEffect, useState } from 'react';
import { Button } from '../button/button';
import { useNavigate } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

export function FlowLayout({ children }: Props) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
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
        console.error('[verification_error]: Token verification failed', error);
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/create-account');
  };

  return (
    <div className="h-full mt-5 max-w-[1000px] mx-auto">
      <div className="w-full text-right">
        {isAuthenticated && (
          <Button customClassNames="mb-4 rounded-full" onClick={logout}>
            Logout
          </Button>
        )}
      </div>
      {children}
    </div>
  );
}
