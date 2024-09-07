import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

interface Props {
  type?: 'button' | 'submit';
  href?: string;
  children: ReactNode;
  customClassNames?: string;
}

const classes = 'inline-block py-3 px-6 bg-[hsla(244,49%,49%,1)] text-white';

export function Button({ href, children, type, customClassNames }: Props) {
  if (href) {
    return (
      <Link to={href} className={twMerge(classes, customClassNames)}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes}>
      {children}
    </button>
  );
}
