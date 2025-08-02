import React from 'react';
import PropTypes from 'prop-types';

const Input = ({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="flex align-start text-sm font-medium text-text-main"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={`
          block w-full rounded-md border
          ${error ? 'border-danger' : 'border-gray-300'}
          shadow-sm focus:border-primary focus:ring-primary
          sm:text-sm
          px-3 py-2
          bg-background
        `}
        {...props}
      />
      {(error || helperText) && (
        <p className={`text-sm ${error ? 'text-danger' : 'text-text-light'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  helperText: PropTypes.string,
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
};

export default Input; 
