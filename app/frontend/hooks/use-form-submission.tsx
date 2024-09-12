import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AccountFormSchema } from './use-form-state';

export const useFormSubmission = () => {
  const navigate = useNavigate();
  const [pending, setPending] = useState<boolean>(false);
  const [isBot, setIsBot] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | undefined>(undefined);

  const handleSubmit = async (formState: AccountFormSchema) => {
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

  return { handleSubmit, pending, isBot, submissionError };
};
