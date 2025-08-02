import React from 'react';
import PropTypes from 'prop-types';

const ProgressBar = ({
  value,
  max = 100,
  showLabel = true,
  className = '',
  progressClassName = '',
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={className}>
      <div className="w-full bg-gray-200 rounded-full h-2.5 relative">
        {percentage > 0 && (
          <div
            className={`
              h-2.5 rounded-full transition-all duration-300 absolute top-0 left-0
              ${progressClassName}
            `}
            style={{ width: `${percentage}%`, backgroundColor: '#990033' }}
          />
        )}
        {showLabel && (
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-900 z-10">
            {percentage.toFixed(0)}%
          </span>
        )}
      </div>
    </div>
  );
};

ProgressBar.propTypes = {
  value: PropTypes.number.isRequired,
  max: PropTypes.number,
  showLabel: PropTypes.bool,
  className: PropTypes.string,
  progressClassName: PropTypes.string,
};

export default ProgressBar; 
