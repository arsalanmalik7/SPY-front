import React from 'react';
import { Outlet } from 'react-router-dom';
import { Utensils } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-background">
    
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-lg mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AuthLayout; 