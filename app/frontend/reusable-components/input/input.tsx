import React, { ChangeEvent, useState } from 'react';

interface Props {
  label: string;
  onChange?: (value: string) => void;
}

export function Input({ onChange, label }: Props) {
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
        className="block w-full p-2 border-4 border-solid border-slate-300"
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}
