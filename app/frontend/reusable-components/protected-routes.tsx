import React, { FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useTokenVerification } from '../hooks/use-token-verification';

type ProtectedRoutesProps = {
  children: JSX.Element;
};

export const ProtectedRoutes: FC<ProtectedRoutesProps> = ({ children }) => {
  const location = useLocation();
  const { isLoading, isAuthenticated } = useTokenVerification();

  if (isLoading) {
    return <div>Loading...(TODO: Some nice UI coming later)</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/create-account" state={{ from: location }} replace />;
  }

  return children;
};
