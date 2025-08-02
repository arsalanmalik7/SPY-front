import React from 'react';
import PropTypes from 'prop-types';

const Card = ({
  children,
  header,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`
        bg-white rounded-lg shadow-card
        ${className}
      `}
      {...props}
    >
      {header && (
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          {header}
        </div>
      )}
      <div className="px-4 py-5 sm:p-6">
        {children}
      </div>
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  header: PropTypes.node,
  className: PropTypes.string,
};

export default Card; 
