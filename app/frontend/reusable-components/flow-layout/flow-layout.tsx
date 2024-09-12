import React, { ReactNode } from 'react';
import { Button } from '../button/button';
import { useNavigate } from 'react-router-dom';
import { useTokenVerification } from 'app/frontend/hooks/use-token-verification';
import { twMerge } from 'tailwind-merge';

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

  // If the user is not authenticated, any children rendered by flow-layout will have
  // maximum width of 500px
  const className = twMerge('h-full mt-5 mx-auto', isAuthenticated ? 'max-w-[1000px]' : 'max-w-[500px]');

  return (
    <div className={className}>
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
