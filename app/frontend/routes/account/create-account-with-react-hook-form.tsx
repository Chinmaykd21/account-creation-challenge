import React, { useEffect, useState } from 'react';
import { Card } from '../../reusable-components/card/card';
import { Button } from '../../reusable-components/button/button';
import { FlowLayout } from '../../reusable-components/flow-layout/flow-layout';
import { SubmitHandler, useForm } from 'react-hook-form';
import zxcvbn from 'zxcvbn'; // Password strength library
import { FormError } from '../../reusable-components/form/form-error';
import { PasswordStrengthMeter } from './password-strength';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'app/frontend/reusable-components/spinner/spinner';
import { twMerge } from 'tailwind-merge';

type AccountFormSchema = {
  username: string;
  password: string;
  honeypot: string; // This field will be hidden from the user but present in dom.
};

type createAccountResponse = {
  token?: string;
  error?: string;
};

const createAccount = async (username: string, password: string, honeypot: string): Promise<createAccountResponse> => {
  try {
    const response = await axios.post<createAccountResponse>('/api/create-account', {
      username,
      password,
      honeypot,
    });
    const { token, error } = response.data;
    if (token) {
      localStorage.setItem('token', token);
      return { token };
    } else {
      return { error: error || '[account_creation_error]: Account creation failed' };
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage = (error.response?.data as { error: string })?.error || error.message;
      console.error('[submission_error]: Axios submission error', errorMessage);
      return { error: errorMessage };
    } else {
      console.error('[submission_error]: unknown error', error);
      return { error: 'Unknown error occurred' };
    }
  }
};

export function CreateNewAccountReactHookForm() {
  const navigate = useNavigate();
  const [isBot, setIsBot] = useState<boolean>(false);
  const [pending, setPending] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | undefined>(undefined);

  const {
    register,
    watch,
    setFocus,
    formState: { errors, isDirty, isValid },
    handleSubmit,
    reset,
  } = useForm<AccountFormSchema>({
    mode: 'all', // Track changes as soon as inputs are modified
    defaultValues: {
      username: '',
      password: '',
      honeypot: '',
    },
  });

  useEffect(() => {
    setFocus('username');
  }, [setFocus]);

  const passwordValue = watch('password');
  const honeypotValue = watch('honeypot');

  const onSubmit: SubmitHandler<AccountFormSchema> = async (data) => {
    setPending(true);
    if (honeypotValue) {
      // Bot submission detected, do not submit form values to the server
      setIsBot(true);
      setPending(false);
      // Simulate sending metric to some kind of data collection tool, for example, datadog
      console.info('[info_log]: Bot detected');
      reset();
      return;
    }
    const { username, password, honeypot } = data;

    const { error, token } = await createAccount(username, password, honeypot);
    if (token) {
      navigate('/signup/account-selection');
    } else {
      setSubmissionError(error);
    }
    setIsBot(false);
    setPending(false);
    reset();
  };

  return (
    <FlowLayout>
      <Card title="Create New Account" showWealthFrontLogo={true}>
        <div className="space-y-2">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
            {/* Honeypot hidden field for bot detection */}
            <div className="hidden">
              <label htmlFor="honeypot">Honeypot</label>
              <input id="honeypot" type="text" {...register('honeypot')} />
            </div>
            {/* Username field */}
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              disabled={pending}
              {...register('username', {
                required: 'Username is required',
                minLength: { value: 10, message: 'Username must be at least 10 characters' },
                maxLength: { value: 50, message: 'Username must be at most 50 characters' },
              })}
              className="border-b-2 border-gray-300 focus:border-blue-500 outline-none w-full p-2"
            />
            {/* Error message for username */}
            <div className="min-h-[10px]" id="username-error">
              {errors.username?.message && <FormError message={errors.username.message} />}
            </div>

            {/* Password field */}
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              disabled={pending}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 20, message: 'Password must be at least 20 characters' },
                maxLength: { value: 50, message: 'Password must be at most 50 characters' },
                validate: {
                  passwordStrengthScore: (value) => zxcvbn(value).score >= 2 || 'Password strength must be at least 2',
                },
                pattern: {
                  value: /^(?=.*[a-zA-Z])(?=.*[1-9]).*$/,
                  message: 'Password must contain at least one letter and one number',
                },
              })}
              className="border-b-2 border-gray-300 focus:border-blue-500 outline-none w-full p-2"
            />
            {/* Error message for password */}
            <div className="min-h-[10px]" id="password-error">
              {errors.password?.message && <FormError message={errors.password.message} />}
            </div>

            {/* Password Strength Meter */}
            <PasswordStrengthMeter passwordValue={passwordValue} />

            {/* Bot error message with reserved space to avoid layout shift. */}
            <div className="min-h-[10px]" id="honeypot-error">
              {isBot ? (
                <FormError message="Bot detected. Submission has been blocked." isBot={isBot} />
              ) : submissionError ? (
                <FormError message={submissionError} isBot={false} />
              ) : null}
            </div>

            {/* Allow users to create account only if form is dirty AND valid */}
            <Button
              classNames={twMerge(
                'w-full text-center rounded-xl disabled:opacity-50 flex items-center justify-center',
                pending ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-[hsla(244,49%,39%,1)]'
              )}
              type="submit"
              isDisabled={!isDirty || !isValid || pending}
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
