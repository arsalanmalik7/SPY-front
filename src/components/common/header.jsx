import React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import UserProfileDropdown from "./user-profile-dropdown"
import authService from "../../services/authService"

const getHeaderInfo = (pathname) => {
  // Define header information for different routes
  const headerInfo = {
    "/dashboard": {
      title: "Dashboard",
      subtitle: "Welcome to your dashboard",
    },
    "/restaurant-management": {
      title: "Restaurant Management",
      subtitle: "",
    },
    "/staff-management": {
      title: "User Management",
      subtitle: "Manage your team members and their access",
    },
    "/profile": {
      title: "Profile",
      subtitle: "View and manage your profile",
    },
    "/profile/edit": {
      title: "Edit Account Info",
      subtitle: "Update your profile details",
    },
    "/profile/security": {
      title: "Manage Email & Password",
      subtitle: "Update your email and password",
    },
    "/lesson-progress": {
      title: "Lesson Progress",
      subtitle: "Track training progress",
    },
    "/food-list": {
      title: "Food List",
      subtitle: "View and manage food items",
    },
    "/wine-list": {
      title: "Wine List",
      subtitle: "View and manage wine items",
    },
    "/progress": {
      title: "Progress",
      subtitle: "Track progress",
    },
    "/subscription": {
      title: "Subscription",
      subtitle: "Manage subscription",
    },
  }

  // For nested routes (e.g., /restaurants/:id)
  if (pathname.startsWith("/restaurants/")) {
    return {
      title: "Restaurant Details",
      subtitle: "View and manage restaurant information",
    }
  }
  if (pathname.startsWith("/users/")) {
    return {
      title: "User Details",
      subtitle: "View and manage user information",
    }
  }
  if (pathname.startsWith("/lessons/")) {
    return {
      title: "Lesson Details",
      subtitle: "View and manage lesson information",
    }
  }

  // Default header info if route not found
  return (
    headerInfo[pathname] || {
      title: "Speak Your Menu",
      subtitle: "Restaurant Management System",
    }
  )
}

export default function Header({ setSidebarOpen }) {
  const location = useLocation()
  const { title, subtitle } = getHeaderInfo(location.pathname)
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = React.useState(false)
  const dropdownRef = React.useRef(null)
  const avatarRef = React.useRef(null);

  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem('userinfo') || "{}");

  const handleAvatarClick = () => {
    setDropdownOpen((prev) => !prev)
  }

  const handleLogout = () => {
    authService.logout()
    setDropdownOpen(false)
    navigate("/login")
  }

  const closeDropdown = () => {
    setDropdownOpen(false)
  }

  const handleAvatarMouseDown = (e) => {
    // Prevent outside click handler from firing
    e.stopPropagation();
    setDropdownOpen((prev) => !prev);
  };

  // Add this effect for outside click
  React.useEffect(() => {
    if (!dropdownOpen) return;
    function handleClickOutside(event) {
      // If click is on avatar, do nothing (avatar toggles itself)
      if (
        avatarRef.current &&
        avatarRef.current.contains(event.target)
      ) {
        return;
      }
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <button
            className="lg:hidden text-gray-700 hover:bg-gray-100 p-2 rounded-md"
            onClick={() => setSidebarOpen(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div className="text-left">
            <h1 className="text-2xl font-bold text-textcolor">{title}</h1>
            <p className="text-gray-500">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative w-full sm:w-auto">
            {/* <input
              type="text"
              placeholder="Search..."
              className="w-full sm:w-64 pl-10 pr-4 py-2 border border-textcolor rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary w-64"
            /> */}
            {/* <div className="w-full sm:w-64 pl-10 pr-4 py-2 w-64"></div> */}
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-textcolor"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg> */}
          </div>
          {/* <button className="p-2 text-textcolor  rounded-full hover:bg-gray-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-textcolor"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <button className="p-2 text-textcolor hover:text-gray-700 rounded-full hover:bg-gray-100 relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              2
            </span>
          </button> */}
          <div className="relative">
            <div
              ref={avatarRef}
              className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 cursor-pointer"
              onMouseDown={handleAvatarMouseDown}
              tabIndex={0}
            >
              {userData?.image_url ? (
                <img 
                  src={`${process.env.REACT_APP_IMAGE_BASE_URL}${userData.image_url}`} 
                  alt="User avatar" 
                  className="h-8 w-8 rounded-full object-cover" 
                />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
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

            {dropdownOpen && (
              <div ref={dropdownRef}>
                <UserProfileDropdown user={userData} onClose={closeDropdown} handleLogout={handleLogout} />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
