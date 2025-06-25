import React from 'react';
import { ChevronDownIcon } from './Icons';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  containerClassName?: string;
  placeholder?: string; 
}

const Select: React.FC<SelectProps> = ({ 
  label, 
  id, 
  options, 
  error, 
  className = '', 
  containerClassName = '', 
  placeholder, 
  ...restProps 
}) => {
  const defaultId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && (
        <label htmlFor={defaultId} className="block text-sm font-medium text-gray-300 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={defaultId}
          className={`block w-full appearance-none px-3 py-2 bg-secondary-light border border-secondary-lighter rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-gray-100 ${error ? 'border-red-500' : ''} ${className}`}
          {...restProps} 
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-secondary-light text-gray-100">
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
          <ChevronDownIcon className="h-4 w-4" />
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
};

export default Select;