import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const messages = {
  '/dashboard': 'Welcome to Speak your Menu! Start by adding your restaurant to get things rolling.',
  '/staff-management': 'No staff added! Add your team to track progress and training.'
};

const WelcomeTagline = ({ onClose, showStaffMsg, userRole }) => {
  const location = useLocation();
  const [visible, setVisible] = useState(true);
  let message = messages[location.pathname];

  // Always show dashboard message for manager or director
  if (location.pathname === '/dashboard' && !(userRole === 'manager' || userRole === 'director')) {
    message = null;
  }
  // Only show staff-management message if showStaffMsg is true
  if (location.pathname === '/staff-management' && showStaffMsg) {
    message = 'No staff added! Add your team to track progress and training.';
  }
  if (!message || !visible) return null;
  return (
    <div className="w-full bg-green-100 border border-green-300 text-green-800 px-6 py-3 text-center font-semibold text-base flex items-center justify-center relative ">
      <span className="flex-1 text-center">{message}</span>
      {onClose && (
        <button
          onClick={() => { setVisible(false); onClose(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-green-900 hover:text-green-700 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-green-400 rounded-full px-2 transition"
          aria-label="Close"
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default WelcomeTagline;
