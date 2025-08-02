import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../common/sidebar';
import Header from '../common/header';
import WelcomeTagline from '../common/WelcomeTagline';
import authService from '../../services/authService';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("userinfo"));
  

  // Always show the welcome message for manager/director on dashboard
  const showWelcome = location.pathname === '/dashboard' && (user.role === 'manager' || user.role === 'director') && user.assigned_restaurants.length < 1;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 overflow-auto">
        <div className="sticky top-0 z-20 bg-white">
          <Header setSidebarOpen={setSidebarOpen} />
          {showWelcome && (
            <WelcomeTagline 
              onClose={() => {}}
              userRole={user.role}
            />
          )}
        </div>
        <main className="p-6 bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;