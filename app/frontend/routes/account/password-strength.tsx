import React, { FC, useEffect, useState } from 'react';
import zxcvbn from 'zxcvbn';

type PasswordStrengthMeterProps = {
  passwordValue: string;
};

export const PasswordStrengthMeter: FC<Readonly<PasswordStrengthMeterProps>> = ({ passwordValue }) => {
  const [passwordStrength, setPasswordStrength] = useState<number>(0);

  // Function to determine password strength text
  const getPasswordStrengthText = (): string => {
    switch (passwordStrength) {
      case 0:
        return 'Very Weak';
      case 1:
        return 'Weak';
      case 2:
        return 'Medium';
      case 3:
        return 'Strong';
      case 4:
        return 'Very Strong';
      default:
        return '';
    }
  };

  // Function to get color based on password strength to provide visual feedback to the user
  const getBarColor = (index: number): string => {
    switch (passwordStrength) {
      case 0:
        return index === 0 ? 'bg-red-500' : 'bg-gray-300'; // Very Weak (only the first bar red)
      case 1:
        return index === 0 ? 'bg-orange-500' : 'bg-gray-300'; // Weak (only the first bar orange)
      case 2:
        return index < 2 ? 'bg-yellow-500' : 'bg-gray-300'; // Medium (first two bars yellow)
      case 3:
        return index < 3 ? 'bg-green-400' : 'bg-gray-300'; // Strong (first three bars green)
      case 4:
        return 'bg-green-700'; // Very Strong (all bars green)
      default:
        return 'bg-gray-300'; // Default gray color for all bars
    }
  };

  useEffect(() => {
    if (passwordValue) {
      const result = zxcvbn(passwordValue);
      setPasswordStrength(result.score); // Score varies from 0 (very weak) to 4 (very strong)
    } else {
      setPasswordStrength(0); // Reset score to 0 when password field is empty
    }
  }, [passwordValue]);

  return (
    <>
      <div className="grid grid-cols-4 gap-1 mt-1 min-h-[10px]">
        {' '}
        {/* Grid layout with reserved space */}
        {[0, 1, 2, 3].map((index) => (
          <div key={index} className={`h-2 ${getBarColor(index)} transition-colors duration-300`}></div>
        ))}
      </div>

      {/* Display password strength text */}
      <p data-testid="password-strength" className="mt-1 text-sm font-medium">
        Password Strength: {getPasswordStrengthText()}
      </p>
    </>
  );
};
