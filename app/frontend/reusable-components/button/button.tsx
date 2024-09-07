import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

interface Props {
  type?: 'button' | 'submit';
  href?: string;
  children: ReactNode;
  customClassNames?: string;
}

export function Button({ href, children, type, customClassNames }: Props) {
  const className = twMerge('inline-block py-3 px-6 bg-[hsla(244,49%,49%,1)] text-white', customClassNames);
  if (href) {
    return (
      <Link to={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={className}>
      {children}
    </button>
  );
}
