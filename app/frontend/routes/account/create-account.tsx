import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { PasswordStrengthMeter } from './password-strength';
import { Spinner } from 'app/frontend/reusable-components/spinner';
import { Button } from 'app/frontend/reusable-components/button/button';
import { FormError } from 'app/frontend/reusable-components/form/form-error';
import { Input } from 'app/frontend/reusable-components/input/input';
import { FlowLayout } from 'app/frontend/reusable-components/flow-layout/flow-layout';
import { Card } from 'app/frontend/reusable-components/card/card';
import { useNavigate } from 'react-router-dom';
import { useFormState } from 'app/frontend/hooks/use-form-state';

export function CreateNewAccount() {
  const navigate = useNavigate();
  const { formState, errors, handleChange, passwordStrength, validate } = useFormState();
  const [pending, setPending] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | undefined>(undefined);
  const [isBot, setIsBot] = useState<boolean>(false);

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    if (formState.funFact) {
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
        navigate('/signup/account-selection');
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
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Hidden funFact input for bot detection */}
          <div className="hidden">
            <Input
              type="text"
              name="funFact"
              label="FunFact"
              disabled={pending}
              onChange={(value) => handleChange('funFact', value)}
              className="border-b-2 border-gray-300 focus:border-blue-500 outline-none w-full p-2"
            />
          </div>

          {/* Username input using Input component */}
          <div className="form-group">
            <Input
              type="text"
              name="username"
              label="Username"
              disabled={pending}
              onChange={(value) => handleChange('username', value)}
              className="border-b-2 border-gray-300 focus:border-blue-500 outline-none w-full p-2"
            />
            {/* Error message for username */}
            <div className="min-h-[10px]" id="username-error">
              {errors.username && <FormError message={errors.username} />}
            </div>
          </div>

          {/* Password input using Input component */}
          <div className="form-group">
            <Input
              type="password"
              name="password"
              label="Password"
              className="border-b-2 border-gray-300 focus:border-blue-500 outline-none w-full p-2"
              disabled={pending}
              onChange={(value) => handleChange('password', value)}
            />
            {/* Error message for password */}
            <div className="min-h-[10px]" id="password-error">
              {errors.password && <FormError message={errors.password} />}
            </div>
          </div>

          <PasswordStrengthMeter passwordValue={formState.password} />

          <div className="min-h-[5px]" id="funFact-error">
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
            isDisabled={pending || passwordStrength < 2}
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
      </Card>
    </FlowLayout>
  );
}
