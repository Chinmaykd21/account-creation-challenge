import React, { FC } from 'react';
import { twMerge } from 'tailwind-merge';

type FormErrorProps = {
  message: string;
  isBot?: boolean;
};

export const FormError: FC<Readonly<FormErrorProps>> = ({ message, isBot = false }) => {
  return (
    <p
      className={twMerge(
        'text-red-600 text-xs opacity-0 transition-opacity duration-400 italic',
        message || isBot ? 'opacity-100' : 'opacity-0'
      )}
    >
      {message}
    </p>
  );
};
