import React, { ChangeEvent, useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface Props {
  type: string;
  name: string;
  label: string;
  onChange?: (value: string) => void;
  className: string;
  disabled: boolean;
}

export function Input({ onChange, label, name, type, className, disabled = false }: Props) {
  const [value, setValue] = useState('');
  const id = label.replace(/ /gm, '_');
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setValue(event.target.value);
    onChange?.(event.target.value);
  }
  return (
    <div>
      <label htmlFor={id} className="block text-sm">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        disabled={disabled}
        className={twMerge('block w-full p-2 border-4 border-solid border-slate-300', className)}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}
