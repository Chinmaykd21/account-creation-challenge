import React, { ChangeEvent, useState } from 'react';

interface Props {
  type?: string;
  name?: string;
  label: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

export function Input({ onChange, label, name, type, className, disabled = false, required }: Props) {
  const [value, setValue] = useState('');
  const id = label.replace(/ /gm, '_');
  const defaultClassName = 'block w-full p-2 border-4 border-solid border-slate-300';
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
        className={className ? className : defaultClassName}
        value={value}
        onChange={handleChange}
        required={required}
      />
    </div>
  );
}
