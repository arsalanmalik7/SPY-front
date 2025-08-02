import React from 'react';
import PropTypes from 'prop-types';

const Avatar = ({
  src,
  alt,
  size = 'md',
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  return (
    <div
      className={`
        relative rounded-full overflow-hidden
        ${sizeClasses[size]}
        ${className}
      `}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="h-full w-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500 text-lg font-medium">
            {alt ? alt.charAt(0).toUpperCase() : '?'}
          </span>
        </div>
      )}
    </div>
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  className: PropTypes.string,
};

export default Avatar; 
