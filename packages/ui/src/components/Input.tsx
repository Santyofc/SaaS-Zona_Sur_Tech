import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="text-sm font-medium text-zs-text-secondary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full bg-zs-bg-tertiary border border-zs-border rounded-md px-3 py-2
            text-zs-text-primary placeholder:text-zs-text-muted
            focus:outline-none focus:ring-1 focus:ring-zs-accent-primary focus:border-zs-accent-primary
            transition-all duration-200
            ${error ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-500 mt-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
