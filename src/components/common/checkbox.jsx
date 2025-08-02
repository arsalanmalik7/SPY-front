import React from 'react';
import PropTypes from 'prop-types';

const Checkbox = ({
  label,
  checked,
  onChange,
  disabled = false,
  className = '',
  id,
  ...props
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={`
          h-4 w-4 rounded border-gray-300
          text-primary focus:ring-primary
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        {...props}
      />
      {label && (
        <label
          htmlFor={id}
          className={`ml-2 block text-sm text-text-main ${disabled ? 'opacity-50' : ''}`}
        >
          {label}
        </label>
      )}
    </div>
  );
};

Checkbox.propTypes = {
  label: PropTypes.string,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
};

export default Checkbox; 
