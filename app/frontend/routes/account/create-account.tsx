import React, { useEffect, useState } from 'react';
import { Card } from 'app/frontend/reusable-components/card/card';
import { Button } from 'app/frontend/reusable-components/button/button';
import { FlowLayout } from 'app/frontend/reusable-components/flow-layout/flow-layout';
import { SubmitHandler, useForm } from 'react-hook-form';
import zxcvbn from 'zxcvbn'; // Password strength library
import { twMerge } from 'tailwind-merge';

type AccountFormSchema = {
  username: string;
  password: string;
  honeypot: string; // This field will be hidden from the user but present in dom.
};

export function CreateNewAccount() {
  const [isBot, setIsBot] = useState<boolean>(false);
  const {
    register,
    watch,
    setFocus,
    formState: { errors, isDirty, isValid },
    handleSubmit,
  } = useForm<AccountFormSchema>({
    mode: 'all', // Track changes as soon as inputs are modified
    defaultValues: {
      username: '',
      password: '',
      honeypot: '',
    },
  });

  // Set focus on username field initially
  useEffect(() => {
    setFocus('username');
  }, [setFocus]);

  // Regex pattern to allow only alphanumeric characters (no special characters)
  const noSpecialCharactersPattern = /^[a-zA-Z0-9]*$/;

  // Watch for honeypot value
  const honeypotValue = watch('honeypot');

  const onSubmit: SubmitHandler<AccountFormSchema> = (data) => {
    // Bot submission detected, do not submit form values to the server
    if (honeypotValue) {
      setIsBot(true);
      return;
    }
    console.log('**** This is the data', data);
    setIsBot(false);
  };

  return (
    <FlowLayout>
      <Card title="Create New Account" showWealthFrontLogo={true}>
        <div className="space-y-2">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
            {/* Honeypot hidden field for bot detection */}
            <div className="hidden">
              <label htmlFor="honeypot">Honeypot</label>
              <input type="text" {...register('honeypot')} />
            </div>
            {/* Username field */}
            <label htmlFor="username">Username</label>
            <input
              type="text"
              {...register('username', {
                required: 'Username is required',
                minLength: { value: 10, message: 'Username must be at least 10 characters' },
                maxLength: { value: 50, message: 'Username must be at least 50 characters' },
                pattern: {
                  value: noSpecialCharactersPattern,
                  message: 'Username must not contain special characters, commas, or quotes',
                },
              })}
              className="border-b-2 border-gray-300 focus:border-blue-500 outline-none w-full p-2"
            />
            {/* Error message for username */}
            <p
              className={twMerge(
                'text-red-600 text-xs min-h-[10px] opacity-0 transition-opacity duration-400 italic',
                errors.username ? 'opacity-100' : 'opacity-0'
              )}
            >
              {errors.username?.message}
            </p>

            {/* Password field */}
            <label htmlFor="password">Password</label>
            <input
              type="text"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 20, message: 'Password must be at least 20 characters' },
                maxLength: { value: 50, message: 'Password must be at least 50 characters' },
                validate: {
                  containsLettersAndNumbers: (value) =>
                    (/[a-zA-Z]/.test(value) && /\d/.test(value)) ||
                    'Password must contain at least one letter between [a-zA-Z] and one number between [1-9]',
                  zxcvbnScore: (value) => zxcvbn(value).score >= 2 || 'Password strength must be at least 2',
                },
                pattern: {
                  value: noSpecialCharactersPattern,
                  message: 'Username must not contain special characters, commas, or quotes',
                },
              })}
              className="border-b-2 border-gray-300 focus:border-blue-500 outline-none w-full p-2"
            />
            {/* Error message for password */}
            <p
              className={twMerge(
                'text-red-600 text-xs min-h-[10px] opacity-0 transition-opacity duration-300 italic',
                errors.password ? 'opacity-100' : 'opacity-0'
              )}
            >
              {errors.password?.message}
            </p>

            {/* Bot warning message with reserved space to avoid layout shift. */}
            <p
              className={twMerge(
                'text-red-600 text-xs min-h-[10px] opacity-0 transition-opacity duration-300 italic',
                isBot ? 'opacity-100' : 'opacity-0'
              )}
            >
              Bot submission detected. Submission has been blocked.
            </p>

            {/* Allow users to create account only if form is dirty AND valid */}
            {/* TODO: Add loading state when form is submitted to the server for account creation */}
            <Button
              customClassNames="w-full text-center rounded-xl hover:bg-[hsla(244,49%,39%,1)] disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              isDisabled={!isDirty || !isValid}
            >
              Create Account
            </Button>
          </form>
        </div>
      </Card>
    </FlowLayout>
  );
}
