import React, { FC, FormEvent, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { PasswordStrengthMeter } from './password-strength';
import { Spinner } from 'app/frontend/reusable-components/spinner/spinner';
import { Button } from 'app/frontend/reusable-components/button/button';
import { FormError } from 'app/frontend/reusable-components/form/form-error';
import { Input } from 'app/frontend/reusable-components/input/input';
import { FlowLayout } from 'app/frontend/reusable-components/flow-layout/flow-layout';
import { Card } from 'app/frontend/reusable-components/card/card';
import { FormErrors, useFormState } from 'app/frontend/hooks/use-form-state';
import { useFormSubmission } from 'app/frontend/hooks/use-form-submission';

const validateAccountForm = (
  formState: { username: string; password: string },
  passwordStrength?: number
): FormErrors<typeof formState> => {
  const errors: FormErrors<typeof formState> = {};

  if (!formState.username.trim()) {
    errors.username = 'Username is required';
  } else if (formState.username.length < 10 || formState.username.length > 50) {
    errors.username = 'Username must be between 10 and 50 characters';
  }

  if (!formState.password.trim()) {
    errors.password = 'Password is required';
  } else if (formState.password.length < 20 || formState.password.length > 50) {
    errors.password = 'Password must be between 20 and 50 characters';
  } else if (!/^(?=.*[a-zA-Z])(?=.*[1-9]).*$/.test(formState.password)) {
    errors.password = 'Password must contain at least one letter and one number.';
  } else if (passwordStrength && passwordStrength < 2) {
    errors.password = 'Password strength must be at least 2 (medium).';
  }

  return errors;
};

const submitAccountForm = async (formState: { username: string; password: string }) => {
  const response = await fetch('/api/create-account', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formState),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || '[account_creation_error]: Account creation failed');
  } else {
    localStorage.setItem('token', data.token);
  }
};

export function CreateNewAccount() {
  const initialFormState = { username: '', password: '', funFact: '' };
  const { formState, errors, handleChange, passwordStrength, validate, touchedFields } = useFormState(
    initialFormState,
    validateAccountForm
  );

  const { handleSubmit, pending, isBot, submissionError } = useFormSubmission(submitAccountForm);
  const [isValid, setIsValid] = useState<boolean>(false);

  useEffect(() => {
    const isFormValid = validate();
    setIsValid(isFormValid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState, passwordStrength]);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (validate()) {
      handleSubmit(formState);
    }
  };

  return (
    <FlowLayout>
      <Card title="Create New Account" showWealthFrontLogo={true}>
        <form onSubmit={onSubmit} noValidate className="space-y-6">
          {/* Hidden funFact input for bot detection */}
          <div className="form-group hidden">
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
          <div className="space-y-5 form-group">
            <Input
              type="text"
              name="username"
              label="Username"
              disabled={pending}
              required={true}
              onChange={(value) => handleChange('username', value)}
              className="border-b-2 border-gray-300 focus:border-blue-500 outline-none w-full p-2"
            />
            {/* Error message for username */}
            <div className="min-h-[10px]" id="username-error">
              {touchedFields.username && errors.username && <FormError message={errors.username} />}
            </div>
          </div>

          {/* Password input using Input component */}
          <div className="space-y-5 form-group">
            <Input
              type="password"
              name="password"
              label="Password"
              className="border-b-2 border-gray-300 focus:border-blue-500 outline-none w-full p-2"
              disabled={pending}
              required={true}
              onChange={(value) => handleChange('password', value)}
            />
            {/* Error message for password */}
            <div className="min-h-[10px]" id="password-error">
              {touchedFields.username && errors.password && <FormError message={errors.password} />}
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

          <FormSubmitButton isValid={isValid} pending={pending} />
        </form>
      </Card>
    </FlowLayout>
  );
}

type FormSubmitButtonProps = {
  pending?: boolean;
  isValid?: boolean;
};

const FormSubmitButton: FC<FormSubmitButtonProps> = ({ isValid, pending }) => {
  return (
    <Button
      classNames={twMerge(
        'w-full text-center rounded-xl disabled:opacity-50 flex items-center justify-center',
        pending ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-[hsla(244,49%,39%,1)]'
      )}
      type="submit"
      isDisabled={pending || !isValid}
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
  );
};
