import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import authService from "../services/authService";
import { use } from "react";

// Helper function to format date
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};





export default function ProfilePage() {
  const [showAllRestaurants, setShowAllRestaurants] = useState(true);
  // In a real app, you would fetch this data from your API
  const [userData, setUserData] = useState({});


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = await authService.getProfile();
        if (currentUser) {
          setUserData(currentUser);
        } else {
          // Handle case where user is not logged in
          console.error("No user data found");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    fetchUserData();

  }, []);

  const displayedRestaurants = showAllRestaurants
    ? userData?.assigned_restaurants
    : userData?.assigned_restaurants?.slice(0, 4);


  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 sm:px-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Profile Header */}
            <div className="flex items-center mb-6">
              <Link to="/dashboard" className="text-gray-500 hover:text-gray-700 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <h1 className="text-xl font-medium text-gray-900">Profile</h1>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                    {userData?.image_url ? (
                      <img
                        src={`${process.env.REACT_APP_IMAGE_BASE_URL}${userData?.image_url}`}
                        alt="Profile"
                        className="w-16 h-16 rounded-full"
                      />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="text-left">
                    <h2 className="text-xl font-bold text-gray-900">{userData.first_name + " " + userData.last_name}</h2>
                    <p className="text-gray-600">{userData.role === "super_admin" ? "Super Admin" : userData.role}</p>
                    <p className="text-gray-500 text-sm">{userData.email}</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Link
                    to="/edit-profile"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Edit Profile
                  </Link>
                  <Link
                    to="/profile-security"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Change Password
                  </Link>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 text-left">
                <h3 className="text-lg font-medium text-gray-900">Account Information</h3>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-left bg-background p-5">
                  <p className="text-sm font-medium text-gray-500">Account Created</p>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(userData?.createdAt)}</p>
                </div>
                <div className="text-left bg-background p-5">
                  <p className="text-sm font-medium text-gray-500">Last Login</p>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(userData?.last_login)}</p>
                </div>
              </div>
            </div>

            {/* Restaurant Information */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 text-left">
                <h3 className="text-lg font-medium text-gray-900">Restaurant Information</h3>
              </div>
              <div className="p-6">
                <div className="mb-6 text-left bg-background p-5">
                  <p className="text-sm font-medium text-gray-500">Restaurants</p>
                  {userData?.assigned_restaurants && userData.assigned_restaurants.length > 0 ? (
                    <>
                      {displayedRestaurants.map((restaurant, index) => (
                        <p key={index} className="mt-1 text-sm text-gray-900">
                          {typeof restaurant === 'object' ? restaurant.name : restaurant}
                        </p>
                      ))}
                      {userData.assigned_restaurants.length > 4 && (
                        <button
                          onClick={() => setShowAllRestaurants(!showAllRestaurants)}
                          className="mt-2 text-sm text-primary hover:text-primary-dark focus:outline-none"
                        >
                          {showAllRestaurants ? 'Show Less' : 'See More...'}
                        </button>
                      )}
                    </>
                  ) : (
                    <p className="mt-1 text-sm text-gray-500 text-center">No restaurants assigned.</p>
                  )}
                </div>

                <div className="bg-background p-5">
                  <p className="text-sm font-medium text-gray-500 mb-2 text-left">Assigned Locations</p>
                  {/* {userData?.assignedLessons && userData.assignedLessons.length > 0 ? (
                userData.assignedLessons.map((lesson, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="text-sm text-gray-900">
                      {typeof lesson === 'object' ? `${lesson.unit_name} - ${lesson.chapter_name}` : lesson}
                    </span>
                  </div>
                ))
              ) : (
                <p className="mt-1 text-sm text-gray-500">No locations assigned.</p>
              )} */}
                  <p className="mt-1 text-sm text-gray-500">No locations assigned.</p>
                </div>
              </div>
            </div>

            {/* Badges Section */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 text-left">
                <h3 className="text-lg font-medium text-gray-900">Achievement Badges</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {userData?.badges?.map((badge) => (
                    <div key={badge._id} className="bg-background p-4 rounded-lg text-center">
                      <div className="w-24 h-24 mx-auto mb-3">
                        <img
                          src={`${process.env.REACT_APP_IMAGE_BASE_URL}${badge.badge_image}`}
                          alt={badge.badge_name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      {/* Display actual chapter/unit names instead of generic badge_name */}
                      <h4 className="text-sm font-medium text-gray-900 mb-1">
                        {badge.chapter_name || badge.unit_name || badge.badge_name}
                      </h4>
                      {/* Show additional context */}
                      <p className="text-xs text-gray-600 mb-1">
                        {badge.category} {badge.chapter_name ? 'Chapter' : 'Unit'} Expert
                      </p>
                      <p className="text-xs text-gray-500">Score: {badge.score}</p>
                      <p className="text-xs text-gray-500">Earned: {formatDate(badge.earned_at)}</p>
                    </div>
                  ))}
                </div>
                {(!userData?.badges || userData.badges.length === 0) && (
                  <p className="text-sm text-gray-500 text-center">No badges earned yet.</p>
                )}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}
