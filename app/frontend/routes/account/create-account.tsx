import React, { useState } from 'react';
import zxcvbn from 'zxcvbn'; // Password strength library
import { twMerge } from 'tailwind-merge';
import { PasswordStrengthMeter } from './password-strength';
import { Spinner } from 'app/frontend/reusable-components/spinner';
import { Button } from 'app/frontend/reusable-components/button/button';
import { FormError } from 'app/frontend/reusable-components/form/form-error';
import { Input } from 'app/frontend/reusable-components/input/input';
import { FlowLayout } from 'app/frontend/reusable-components/flow-layout/flow-layout';
import { Card } from 'app/frontend/reusable-components/card/card';

// Define the form state schema
interface AccountFormSchema {
  username: string;
  password: string;
  honeypot: string; // Bot detection field
}

// Define possible error states for the form
interface FormErrors {
  username?: string;
  password?: string;
}

export function CreateAccout() {
  const [formState, setFormState] = useState<AccountFormSchema>({
    username: '',
    password: '',
    honeypot: '', // Bot detection field
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const [pending, setPending] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | undefined>(undefined);
  const [isBot, setIsBot] = useState<boolean>(false);

  // Handle input changes
  const handleChange = (name: keyof AccountFormSchema, value: string) => {
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Check password strength when the password field changes
    if (name === 'password') {
      const strength = zxcvbn(value).score;
      setPasswordStrength(strength);
    }
  };

  // Validate the form inputs
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (formState.username.length < 10 || formState.username.length > 50) {
      newErrors.username = 'Username must be between 10 and 50 characters.';
    }

    if (formState.password.length < 20 || formState.password.length > 50) {
      newErrors.password = 'Password must be between 20 and 50 characters.';
    } else if (!/^(?=.*[a-zA-Z])(?=.*[1-9]).*$/.test(formState.password)) {
      newErrors.password = 'Password must contain at least one letter and one number.';
    } else if (passwordStrength < 2) {
      newErrors.password = 'Password strength must be at least 2 (medium).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    if (formState.honeypot) {
      setIsBot(true);
      return;
    }

    setPending(true);

    try {
      const response = await fetch('/api/create-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      });

      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        window.location.href = '/signup/account-selection';
      } else {
        setSubmissionError(data.error || '[account_creation_error]: Account creation failed');
      }
    } catch (error) {
      setSubmissionError('An unknown error occurred.');
    } finally {
      setPending(false);
    }
  };

  return (
    <FlowLayout>
      <Card title="Create New Account" showWealthFrontLogo={true}>
        <div className="space-y-2">
          <form onSubmit={handleSubmit} noValidate>
            {/* Hidden honeypot input for bot detection */}
            <input
              type="text"
              name="honeypot"
              value={formState.honeypot}
              onChange={(e) => handleChange('honeypot', e.target.value)}
              className="hidden"
            />

            {/* Username input using Input component */}
            <div className="form-group">
              <Input
                type="text"
                name="username"
                label="Username"
                className=""
                disabled={pending}
                onChange={(value) => handleChange('username', value)}
              />
              {errors.username && <p className="error">{errors.username}</p>}
            </div>

            {/* Password input using Input component */}
            <div className="form-group">
              <Input
                type="password"
                name="password"
                label="Password"
                className=""
                disabled={pending}
                onChange={(value) => handleChange('password', value)}
              />
              {errors.password && <p className="error">{errors.password}</p>}

              {/* Password strength meter */}
              <PasswordStrengthMeter passwordValue={formState.password} />
            </div>

            <div className="min-h-[10px]" id="honeypot-error">
              {isBot ? (
                <FormError message="Bot detected. Submission has been blocked." isBot={isBot} />
              ) : submissionError ? (
                <FormError message={submissionError} isBot={false} />
              ) : null}
            </div>

            <Button
              classNames={twMerge(
                'w-full text-center rounded-xl disabled:opacity-50 flex items-center justify-center',
                pending ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-[hsla(244,49%,39%,1)]'
              )}
              type="submit"
              isDisabled={pending}
            >
              {pending ? (
                <div className="flex items-center gap-2 ">
                  <Spinner />
                  <span>Creating Account...</span>
                </div>
              ) : (
                <span>Create Account</span>
              )}
            </Button>
          </form>
        </div>
      </Card>
    </FlowLayout>
  );
}
