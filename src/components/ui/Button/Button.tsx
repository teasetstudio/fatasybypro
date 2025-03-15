import React from 'react';
import clsx from 'clsx';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'disabled';
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  className,
  children,
  onClick,
}) => {
  // Define base styles for the button
  const baseStyles = 'px-2 py-1 rounded focus:outline-none';

  // Define variant styles using Tailwind CSS
  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary-600',
    secondary: 'bg-secondary text-white hover:bg-secondary-600',
    outline: 'border border-neutral text-neutral hover:bg-base',
    disabled: 'bg-neutral text-gray-700 cursor-not-allowed',
  };

  // Combine base styles with variant styles and any additional className
  const buttonClasses = clsx(
    baseStyles,
    variantStyles[variant],
    className,
    {
      'pointer-events-none': variant === 'disabled', // Disable pointer events if disabled
    }
  );

  return (
    <button
      className={buttonClasses}
      onClick={variant !== 'disabled' ? onClick : undefined} // Disable onClick if disabled
    >
      {children}
    </button>
  );
};

export default Button; 