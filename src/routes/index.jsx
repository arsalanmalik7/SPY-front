import React, { useEffect, useState } from "react";
import { Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import MainLayout from "../components/layout/MainLayout";
import LoginPage from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import UserDetails from "../pages/UserDetails";
import Restaurants from "../pages/Restaurants";
import RestaurantDetails from "../pages/RestaurantDetails";
import RestaurantEmployees from "../pages/RestaurantEmployees";
import RestaurantMenu from "../pages/RestaurantMenu";
import BulkUploadMenu from "../pages/BulkUploadMenu";
import Lessons from "../pages/Lessons";
import LessonDetails from "../pages/LessonDetails";
import AssignLessons from "../pages/AssignLessons";
import AcceptInvite from "../pages/AcceptInvite";
import ForgotPassword from "../pages/ForgotPassword";
import LandingPage from "../pages/LandingPage";
import RestaurantManagement from "../pages/RestaurantManagement";
import StaffManagement from "../pages/StaffManagement";
import AddUser from "../pages/AddUser";
import BulkUploadUsers from "../pages/BulkUploadUsers";
import CSVTemplateGuide from "../pages/CSVTemplateGuide";
import MenuManagement from "../pages/MenuManagement";
import LessonProgress from "../pages/LessonProgress";
import ProfilePage from "../pages/Profile";
import EditProfilePage from "../pages/ProfileEdit";
import SecurityPage from "../pages/ProfileSecurity";
import authService from "../services/authService";
import ManageSubscription from "../pages/ManageSubscription";
import WineList from "../pages/WineList";
import MyLessons from "../pages/MyLessons";
import Progress from "../pages/TrainingProgressPage";
import FoodList from "../pages/FoodList";
import PreviousMenu from "../pages/PreviousMenu";
import ResetPassword from "../pages/ResetPassword";

const roleRouteMap = {
  super_admin: [
    "/dashboard",
    "/restaurant-management",
    "/staff-management",
    "/menu-management",
    "/lesson-progress",
    "/my-lessons",
    "/subscription",
    "/progress",
    "/add-user",
    "/bulk-upload-users",
    "/csv-template-guide",
    "/users",
    "/restaurants",
    "/restaurants/:id",
    "/restaurants/:id/employees",
    "/restaurants/:id/menu",
    "/restaurants/:id/bulk-upload",
    "/lessons",
    "/lessons/:id",
    "/assign-lessons",
    "/profile-page",
    "/edit-profile",
    "/profile-security",
    "/wine-list",
    "/food-list",
    "/previous-menu",
  ],
  manager: [
    "/dashboard",
    "/staff-management",
    "/my-lessons",
    "/progress",
    "/menu-management",
    "/restaurant-management",
    "/add-user",
    "/profile-page",
    "/edit-profile",
    "/lesson-progress",
    "/previous-menu",
    "/subscription",
  ],
  director: [
    "/dashboard",
    "/staff-management",
    "/restaurant-management",
    "/menu-management",
    "/my-lessons",
    "/progress",
    "/add-user",
    "/profile-page",
    "/edit-profile",
    "/lesson-progress",
    "/previous-menu",
    "/subscription",
  ],
  employee: [
    "/my-lessons",
    "/menu-management",
    "/progress",
    "/profile-page",
    "/edit-profile",
    "/previous-menu",
  ],
};

const userRole = localStorage.getItem("userRole");
export const checkRoutePermission = (route) => {
  const userRole = authService.getCurrentUser()?.role;
  console.log("Checking userRole", userRole);
  if (!userRole) return false;
  if (!roleRouteMap[userRole]) return false;
  return roleRouteMap[userRole].includes(route);
};

export const ProtectedRoute = ({ route, component: Component, children }) => {
  const location = useLocation();
  const [checked, setChecked] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    // Synchronous check, but this pattern prevents flicker
    const result = checkRoutePermission(route);
    setAllowed(result);
    setChecked(true);
    
  }, [route]);

  if (!checked) {
    // Show a white screen while checking
    return (
      <div style={{ background: "#fff", width: "100vw", height: "100vh" }} />
    );
  }

  if (allowed) {
    return Component ? <Component /> : children;
  } else {
    return (
      <Navigate
        to={userRole === "employee" ? "/my-lessons" : "/dashboard"}
        replace
      />
    );
  }
};

// Public Route Component (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = authService.getCurrentUser()?.accessToken;
  const userRole = authService.getCurrentUser()?.role;

  useEffect(() => {
    if (isAuthenticated) {
      navigate(userRole === "employee" ? "/my-lessons" : "/dashboard", {
        replace: true,
      });
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return (
      <Navigate
        to={userRole === "employee" ? "/my-lessons" : "/dashboard"}
        replace
      />
    );
  }

  return children;
};

export const routes = [
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/",
        element: (
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        ),
      },
      {
        path: "/login",
        element: (
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        ),
      },
      {
        path: "/signup",
        element: (
          <PublicRoute>
            <Signup />
          </PublicRoute>
        ),
      },
      {
        path: "/accept-invite",
        element: (
          <PublicRoute>
            <AcceptInvite />
          </PublicRoute>
        ),
      },
      {
        path: "/forgot-password",
        element: (
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        ),
      },
      {
        path: "/reset-password",
        element: (
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        ),
      },
    ],
  },
  {
    element: <MainLayout />,
    children: [
      {
        path: "/dashboard",
        element: <ProtectedRoute route="/dashboard" component={Dashboard} />,
      },
      {
        path: "/users",
        element: <ProtectedRoute route="/users" component={Users} />,
      },
      {
        path: "/users/:id",
        element: <ProtectedRoute route="/users/:id" component={UserDetails} />,
      },
      {
        path: "/restaurants",
        element: (
          <ProtectedRoute route="/restaurants" component={Restaurants} />
        ),
      },
      {
        path: "/restaurants/:id",
        element: (
          <ProtectedRoute
            route="/restaurants/:id"
            component={RestaurantDetails}
          />
        ),
      },
      {
        path: "/restaurants/:id/employees",
        element: (
          <ProtectedRoute
            route="/restaurants/:id/employees"
            component={RestaurantEmployees}
          />
        ),
      },
      {
        path: "/restaurants/:id/menu",
        element: (
          <ProtectedRoute
            route="/restaurants/:id/menu"
            component={RestaurantMenu}
          />
        ),
      },
      {
        path: "/restaurants/:id/bulk-upload",
        element: (
          <ProtectedRoute
            route="/restaurants/:id/bulk-upload"
            component={BulkUploadMenu}
          />
        ),
      },
      {
        path: "/lessons",
        element: <ProtectedRoute route="/lessons" component={Lessons} />,
      },
      {
        path: "/lessons/:id",
        element: (
          <ProtectedRoute route="/lessons/:id" component={LessonDetails} />
        ),
      },
      {
        path: "/assign-lessons",
        element: (
          <ProtectedRoute route="/assign-lessons" component={AssignLessons} />
        ),
      },
      {
        path: "/restaurant-management",
        element: (
          <ProtectedRoute
            route="/restaurant-management"
            component={RestaurantManagement}
          />
        ),
      },
      {
        path: "/staff-management",
        element: (
          <ProtectedRoute
            route="/staff-management"
            component={StaffManagement}
          />
        ),
      },
      {
        path: "/add-user",
        element: <ProtectedRoute route="/add-user" component={AddUser} />,
      },
      {
        path: "/bulk-upload-users",
        element: (
          <ProtectedRoute
            route="/bulk-upload-users"
            component={BulkUploadUsers}
          />
        ),
      },
      {
        path: "/csv-template-guide",
        element: (
          <ProtectedRoute
            route="/csv-template-guide"
            component={CSVTemplateGuide}
          />
        ),
      },
      {
        path: "/menu-management",
        element: (
          <ProtectedRoute route="/menu-management" component={MenuManagement} />
        ),
      },
      {
        path: "/lesson-progress",
        element: (
          <ProtectedRoute route="/lesson-progress" component={LessonProgress} />
        ),
      },
      {
        path: "/profile-page",
        element: (
          <ProtectedRoute route="/profile-page" component={ProfilePage} />
        ),
      },
      {
        path: "/edit-profile",
        element: (
          <ProtectedRoute route="/edit-profile" component={EditProfilePage} />
        ),
      },
      {
        path: "/profile-security",
        element: (
          <ProtectedRoute route="/profile-security" component={SecurityPage} />
        ),
      },
      {
        path: "/my-lessons",
        element: <ProtectedRoute route="/my-lessons" component={MyLessons} />,
      },
      {
        path: "/wine-list",
        element: <ProtectedRoute route="/wine-list" component={WineList} />,
      },
      {
        path: "/food-list",
        element: <ProtectedRoute route="/food-list" component={FoodList} />,
      },
      {
        path: "/progress",
        element: <ProtectedRoute route="/progress" component={Progress} />,
      },
      {
        path: "/subscription",
        element: (
          <ProtectedRoute
            route="/subscription"
            component={ManageSubscription}
          />
        ),
      },
      {
        path: "/previous-menu",
        element: (
          <ProtectedRoute route="/previous-menu" component={PreviousMenu} />
        ),
      },
      {
        path: "*",
        element: (
          <Navigate
            to={userRole === "employee" ? "/my-lessons" : "/dashboard"}
            replace
          />
        ),
      },
    ],
  },
];
