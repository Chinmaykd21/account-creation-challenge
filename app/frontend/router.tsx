import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Root } from './routes/root/root.tsx';
import { AccountSelection } from './routes/signup/account-selection/account-selection.tsx';
import { CreateUser } from './routes/signup/create-user/create-user.tsx';
import { Deposit } from './routes/signup/deposit/deposit.tsx';
import { JointAccess } from './routes/signup/joint-access/joint-access.tsx';
import { StockRestrictions } from './routes/signup/stock-restrictions/stock-restrictions.tsx';
// import { CreateNewAccount } from './routes/account/create-account-with-react-hook-form.tsx';

import { ProtectedRoutes } from './reusable-components/protected-routes.tsx';
import { CreateAccout } from './routes/account/create-account.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoutes>
        <Root />
      </ProtectedRoutes>
    ),
  },
  {
    path: '/create-account',
    element: <CreateAccout />,
  },
  {
    path: '/signup/account-selection',
    element: (
      <ProtectedRoutes>
        <AccountSelection />
      </ProtectedRoutes>
    ),
  },
  {
    path: '/signup/create-user',
    element: (
      <ProtectedRoutes>
        <CreateUser />
      </ProtectedRoutes>
    ),
  },
  {
    path: '/signup/joint-access',
    element: (
      <ProtectedRoutes>
        <JointAccess />
      </ProtectedRoutes>
    ),
  },
  {
    path: '/signup/stock-restrictions',
    element: (
      <ProtectedRoutes>
        <StockRestrictions />
      </ProtectedRoutes>
    ),
  },
  {
    path: '/signup/deposit',
    element: (
      <ProtectedRoutes>
        <Deposit />
      </ProtectedRoutes>
    ),
  },
]);

export function Router() {
  return (
    <main className="h-screen w-screen">
      <div className="h-full w-full max-w-[1200px] my-0 mx-auto">
        <RouterProvider router={router} />
      </div>
    </main>
  );
}
