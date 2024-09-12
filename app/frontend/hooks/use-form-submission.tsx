import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useFormSubmission = <T extends Record<string, any>>(submitFn: (formState: T) => Promise<any>) => {
  const navigate = useNavigate();
  const [pending, setPending] = useState<boolean>(false);
  const [isBot, setIsBot] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | undefined>(undefined);

  const handleSubmit = async (formState: T) => {
    if (formState.funFact) {
      setIsBot(true);
      return;
    }

    setPending(true);

    try {
      await submitFn(formState);
      navigate('/signup/account-selection');
    } catch (error) {
      if (error instanceof Error) {
        setSubmissionError(error.message);
      } else {
        setSubmissionError('An unknown error occurred.');
      }
    } finally {
      setPending(false);
    }
  };

  return { handleSubmit, pending, isBot, submissionError };
};
