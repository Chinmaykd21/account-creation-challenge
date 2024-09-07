import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Root } from './routes/root/root.tsx';
import { AccountSelection } from './routes/signup/account-selection/account-selection.tsx';
import { CreateUser } from './routes/signup/create-user/create-user.tsx';
import { Deposit } from './routes/signup/deposit/deposit.tsx';
import { JointAccess } from './routes/signup/joint-access/joint-access.tsx';
import { StockRestrictions } from './routes/signup/stock-restrictions/stock-restrictions.tsx';
import { CreateNewAccount } from './routes/account/create-account.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
  },
  {
    path: '/create-account',
    element: <CreateNewAccount />,
  },
  {
    path: '/signup/account-selection',
    element: <AccountSelection />,
  },
  {
    path: '/signup/create-user',
    element: <CreateUser />,
  },
  {
    path: '/signup/joint-access',
    element: <JointAccess />,
  },
  {
    path: '/signup/stock-restrictions',
    element: <StockRestrictions />,
  },
  {
    path: '/signup/deposit',
    element: <Deposit />,
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
