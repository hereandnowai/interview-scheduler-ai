import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150';

  // Updated variantStyles with brand colors
  const variantStyles = {
    primary: 'bg-primary hover:bg-primary-dark text-secondary-dark font-semibold focus:ring-primary', // Primary BG, Secondary Text
    secondary: 'bg-secondary-light hover:bg-secondary-lighter text-primary focus:ring-primary', // Light Secondary BG, Primary Text
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500', // Danger remains, assuming it's distinct
    ghost: 'bg-transparent hover:bg-primary/10 text-primary focus:ring-primary border border-primary/50 hover:border-primary', // Primary Text/Border
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      type="button"
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {leftIcon && <span className="mr-2 -ml-0.5 h-5 w-5">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2 -mr-0.5 h-5 w-5">{rightIcon}</span>}
    </button>
  );
};

export default Button;