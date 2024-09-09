import React, { useEffect, useState } from 'react';
import { Card } from '../../reusable-components/card/card';
import { Button } from '../../reusable-components/button/button';
import { FlowLayout } from '../../reusable-components/flow-layout/flow-layout';
import { SubmitHandler, useForm } from 'react-hook-form';
import zxcvbn from 'zxcvbn'; // Password strength library
import { FormError } from '../../reusable-components/form/form-error';
import { PasswordStrengthMeter } from './password-strength';

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

  useEffect(() => {
    setFocus('username');
  }, [setFocus]);

  const passwordValue = watch('password');
  const honeypotValue = watch('honeypot');

  const onSubmit: SubmitHandler<AccountFormSchema> = (data) => {
    if (honeypotValue) {
      // Bot submission detected, do not submit form values to the server
      setIsBot(true);
      // Below console statement will simulate sending metric to some kind of data collection tool, for example, datadog
      console.info('[Info_Log]: Bot detected');
      return;
    }
    console.log('**** This is the data', data);
    setIsBot(false);
  };

  // Regex pattern to allow only alphanumeric characters (no special characters)
  const noSpecialCharactersPattern = /^[a-zA-Z0-9]*$/;

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
              {...register('username', {
                required: 'Username is required',
                minLength: { value: 10, message: 'Username must be at least 10 characters' },
                maxLength: { value: 50, message: 'Username must be at most 50 characters' },
                pattern: {
                  value: noSpecialCharactersPattern,
                  message: 'Username must not contain special characters, commas, or quotes',
                },
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
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 20, message: 'Password must be at least 20 characters' },
                maxLength: { value: 50, message: 'Password must be at most 50 characters' },
                validate: {
                  containsLettersAndNumbers: (value) =>
                    (/[a-zA-Z]/.test(value) && /\d/.test(value)) ||
                    'Password must contain at least one letter between [a-zA-Z] and one number between [1-9]',
                  passwordStrengthScore: (value) => zxcvbn(value).score >= 2 || 'Password strength must be at least 2',
                },
                // TODO: Decide if this is duplicated and even required
                // pattern: {
                //   value: noSpecialCharactersPattern,
                //   message: 'Username must not contain special characters, commas, or quotes',
                // },
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
              {isBot && <FormError message="Bot detected. Submission has been blocked." isBot={isBot} />}
            </div>

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
