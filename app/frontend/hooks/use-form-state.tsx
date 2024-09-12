import { useState } from 'react';
import zxcvbn from 'zxcvbn';

export type FormErrors<T> = Partial<Record<keyof T, string>>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useFormState = <T extends Record<string, any>>(
  initialState: T,
  validateFn: (formState: T) => FormErrors<T>
) => {
  const [formState, setFormState] = useState<T>(initialState);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const [touchedFields, setTouchedFields] = useState<Partial<Record<keyof T, boolean>>>({});

  const handleChange = (name: keyof T, value: string) => {
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    setTouchedFields((prevState) => ({
      ...prevState,
      [name]: true,
    }));

    // If the form has a password field, check password strength
    if (name === 'password') {
      const strength = zxcvbn(value).score;
      setPasswordStrength(strength);
    }
  };

  // Validate form inputs using custom validation function
  const validate = (): boolean => {
    const newErrors = validateFn(formState);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    formState,
    handleChange,
    validate,
    passwordStrength,
    touchedFields,
    errors,
  };
};
