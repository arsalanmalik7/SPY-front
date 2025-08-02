import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-10">
      <h1 className="text-5xl font-bold text-gray-600 mb-4">Welcome to Speak Your Menu</h1>
      <p className="text-xl text-gray-700 mb-8">Your complete restaurant training solution</p>
      <Button 
        variant="contained" 
        color="primary" 
        size="large"
        onClick={handleLoginClick}
        sx={{
          padding: '12px 32px',
          fontSize: '1.1rem',
          textTransform: 'none',
          borderRadius: '8px',
          backgroundColor: 'black',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)',
          },
          transition: 'all 0.2s ease-in-out'
        }}
      >
        Login to Get Started
      </Button>
    </div>
  );
};

export default LandingPage;
