import React, { useState, useRef, useEffect } from 'react';

const Dropdown = ({ 
  label, 
  options, 
  selectedOption, 
  onSelect, 
  className = "" 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        className=" w-full px-4 py-2 bg-white  border border-gray-300 rounded-md flex items-center hover:bg-gray-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOption || label}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
          <div className="py-1 max-h-60 overflow-auto">
            {options?.map((option) => (
              <button
                key={option.value}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${
                  selectedOption === option.label ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                }`}
                onClick={() => {
                  onSelect(option);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown; 