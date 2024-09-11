import React, { ReactNode } from 'react';
import { Button } from '../button/button';
import { useNavigate } from 'react-router-dom';
import { useTokenVerification } from 'app/frontend/hooks/use-token-verification';

interface Props {
  children: ReactNode;
}

export function FlowLayout({ children }: Props) {
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useTokenVerification();

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/create-account');
  };

  return (
    <div className="h-full mt-5 max-w-[1000px] mx-auto">
      <div className="w-full text-right">
        {isAuthenticated && (
          <Button classNames="mb-4 rounded-full" onClick={logout}>
            Logout
          </Button>
        )}
      </div>
      {children}
    </div>
  );
}
