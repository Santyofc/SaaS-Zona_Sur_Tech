import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  leftIcon,
  className = '',
  disabled,
  ...props
}) => {
  const variants = {
    primary: 'bg-zs-accent-primary text-zs-bg-primary hover:bg-zs-accent-primary/90 shadow-zs-glow-blue',
    secondary: 'bg-zs-bg-tertiary text-zs-text-primary hover:bg-zs-bg-tertiary/80 border border-zs-border',
    outline: 'bg-transparent border border-zs-accent-primary text-zs-accent-primary hover:bg-zs-accent-primary/10',
    ghost: 'bg-transparent text-zs-text-secondary hover:text-zs-text-primary hover:bg-zs-bg-tertiary',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium
        transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : leftIcon ? (
        <span className="mr-2">{leftIcon}</span>
      ) : null}
      {children}
    </button>
  );
};
