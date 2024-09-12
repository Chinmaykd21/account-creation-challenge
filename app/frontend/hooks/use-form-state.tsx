import { useState } from 'react';
import zxcvbn from 'zxcvbn';

export type AccountFormSchema = {
  username: string;
  password: string;
  funFact: string; // Bot detection field
};

type FormErrors = Partial<Pick<AccountFormSchema, 'username' | 'password'>>;

export const useFormState = () => {
  const [formState, setFormState] = useState<AccountFormSchema>({
    username: '',
    password: '',
    funFact: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const [touchedFields, setTouchedFields] = useState<{ [key in keyof AccountFormSchema]?: boolean }>({
    username: false,
    password: false,
  });

  // Handle input changes and update form state
  const handleChange = (name: keyof AccountFormSchema, value: string) => {
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    setTouchedFields((prevState) => ({
      ...prevState,
      [name]: true,
    }));

    // Check password strength when the password field changes
    if (name === 'password') {
      const strength = zxcvbn(value).score;
      setPasswordStrength(strength);
    }
  };

  // Validate form inputs
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (touchedFields.username && (formState.username.length < 10 || formState.username.length > 50)) {
      newErrors.username = 'Username must be between 10 and 50 characters.';
    }

    if (touchedFields.password) {
      if (formState.password.length < 20 || formState.password.length > 50) {
        newErrors.password = 'Password must be between 20 and 50 characters.';
      } else if (!/^(?=.*[a-zA-Z])(?=.*[1-9]).*$/.test(formState.password)) {
        newErrors.password = 'Password must contain at least one letter and one number.';
      } else if (passwordStrength < 2) {
        newErrors.password = 'Password strength must be at least 2 (medium).';
      }
    }

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
