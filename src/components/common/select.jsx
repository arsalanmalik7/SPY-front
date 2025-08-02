import React from 'react';
import PropTypes from 'prop-types';

const Select = ({
  label,
  error,
  helperText,
  options,
  className = '',
  id,
  ...props
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-text-main"
        >
          {label}
        </label>
      )}
      <select
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
      >
        {options.map((option) => (
          <option className='   bg-background' key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {(error || helperText) && (
        <p className={`text-sm ${error ? 'text-danger' : 'text-text-light'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

Select.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  helperText: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
};

export default Select; 
