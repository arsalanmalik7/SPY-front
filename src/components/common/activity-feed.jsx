import React, { useState } from 'react';

const getActionIcon = (action) => {
  switch (action) {
    case 'user_registered':
      return 'user-plus';
    case 'login':
      return 'log-in';
    case 'login_failed':
      return 'alert-circle';
    case 'create_restaurant_success':
      return 'building';
    case 'update_lesson_progress':
      return 'graduation-cap';
    case 'create_lesson':
      return 'book';
    case 'auto_assign_lesson':
      return 'user-check';
    default:
      return 'activity';
  }
};

const formatTimeAgo = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
};

export default function ActivityFeed({ logs = [], loading }) {
  const [showAll, setShowAll] = useState(false);
  
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Ensure logs is an array
  const activityLogs = Array.isArray(logs) ? logs : [];
  const displayedLogs = showAll ? activityLogs : activityLogs.slice(0, 4);

  if (activityLogs.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-left text-textcolor mb-4">Recent Activity</h3>
        <p className="text-gray-500 text-center">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl">
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-left text-textcolor">Recent Activity</h3>
      </div>
      <div className="p-2">
        <ul className="divide-y divide-gray-100">
          {displayedLogs.map((log) => (
            <li key={log._id} className="p-3 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
                <div className="p-2 rounded-full bg-textcolor text-gray-100 flex-shrink-0">
                  {getActionIcon(log.action) === 'user-plus' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <line x1="19" x2="19" y1="8" y2="14"></line>
                      <line x1="22" x2="16" y1="11" y2="11"></line>
                    </svg>
                  )}
                  {getActionIcon(log.action) === 'log-in' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                      <polyline points="10 17 15 12 10 7"></polyline>
                      <line x1="15" x2="3" y1="12" y2="12"></line>
                    </svg>
                  )}
                  {getActionIcon(log.action) === 'alert-circle' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" x2="12" y1="8" y2="12"></line>
                      <line x1="12" x2="12.01" y1="16" y2="16"></line>
                    </svg>
                  )}
                  {getActionIcon(log.action) === 'building' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="16" height="20" x="4" y="2" rx="2" ry="2"></rect>
                      <path d="M9 22V16h6v6"></path>
                      <path d="M8 6h.01"></path>
                      <path d="M16 6h.01"></path>
                      <path d="M8 10h.01"></path>
                      <path d="M16 10h.01"></path>
                      <path d="M8 14h.01"></path>
                      <path d="M16 14h.01"></path>
                    </svg>
                  )}
                  {getActionIcon(log.action) === 'graduation-cap' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                      <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                    </svg>
                  )}
                  {getActionIcon(log.action) === 'book' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                    </svg>
                  )}
                  {getActionIcon(log.action) === 'user-check' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <polyline points="16 11 18 13 22 9"></polyline>
                    </svg>
                  )}
                  {getActionIcon(log.action) === 'activity' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row justify-between">
                    <p className="text-sm font-medium text-gray-800">{log.details?.name || log.details?.email || 'Unknown User'}</p>
                    <span className="text-xs text-gray-500">{formatTimeAgo(log.timestamp)}</span>
                  </div>
                  <p className="text-sm text-gray-600 text-left">
                    {log.action === 'user_registered' && `Registered as ${log.details?.role}`}
                    {log.action === 'login' && 'Logged in'}
                    {log.action === 'login_failed' && 'Failed to login'}
                    {log.action === 'create_restaurant_success' && `Created restaurant: ${log.details?.name}`}
                    {log.action === 'update_lesson_progress' && `Updated lesson progress: ${log.details?.score}%`}
                    {log.action === 'create_lesson' && 'Created new lesson'}
                    {log.action === 'auto_assign_lesson' && `Assigned lesson to ${log.details?.user_role}`}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {activityLogs.length > 4 && (
          <div className="p-3 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-sm text-primary hover:text-primary-dark font-medium"
            >
              {showAll ? 'See Less...' : 'See More...'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
  