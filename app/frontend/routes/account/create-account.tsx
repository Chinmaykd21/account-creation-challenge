import React, { useEffect } from 'react';
import { Card } from 'app/frontend/reusable-components/card/card';
import { Button } from 'app/frontend/reusable-components/button/button';
import { FlowLayout } from 'app/frontend/reusable-components/flow-layout/flow-layout';
import { SubmitHandler, useForm } from 'react-hook-form';
import zxcvbn from 'zxcvbn'; // Password strength library
import { twMerge } from 'tailwind-merge';

type AccountFormSchema = {
  username: string;
  password: string;
};

export function CreateNewAccount() {
  const {
    register,
    // watch,
    setFocus,
    formState: { errors },
    handleSubmit,
  } = useForm<AccountFormSchema>({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  // Set focus on username field initially
  useEffect(() => {
    setFocus('username');
  }, [setFocus]);

  const onSubmit: SubmitHandler<AccountFormSchema> = (data) => {
    console.log('**** This is the data', data);
  };

  return (
    <FlowLayout>
      <Card title="Create New Account" showWealthFrontLogo={true}>
        <div className="space-y-2">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
            {/* Username field */}

            <label htmlFor="username">Username</label>
            <input
              {...register('username', {
                required: 'Username is required',
                minLength: { value: 10, message: 'Username must be at least 10 characters' },
                maxLength: { value: 50, message: 'Username must be at least 50 characters' },
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
              })}
              className="border-b-2 border-gray-300 focus:border-blue-500 outline-none w-full p-2"
            />
            {/* Error message for password */}
            <p
              className={twMerge(
                'text-red-600 text-xs min-h-[10px] opacity-0 transition-opacity duration-400 italic',
                errors.password ? 'opacity-100' : 'opacity-0'
              )}
            >
              {errors.password?.message}
            </p>
            <Button customClassNames="w-full text-center rounded-xl" type="submit">
              Create Account
            </Button>
          </form>
        </div>
      </Card>
    </FlowLayout>
  );
}
