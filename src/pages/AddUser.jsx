import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import { RestaurantsService } from "../services/Restaurants";
import { Snackbar, Alert } from '@mui/material';

export default function AddUser() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    restaurants: [],
    permissions: [],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [userProfile, setUserProfile] = useState();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");

  const roles = [
    { value: "manager", label: "Manager" },
    { value: "employee", label: "Employee" },
    { value: "director", label: "Director" },
  ];


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleRestaurantChange = (restaurantId) => {
    setFormData((prev) => ({
      ...prev,
      restaurants: [restaurantId],
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }


    if (!formData.role) newErrors.role = "Role is required";

    if (formData.restaurants.length === 0) newErrors.restaurants = "At least one restaurant must be selected";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const fetchedRestaurants = await RestaurantsService.getAllRestaurants();
        setRestaurants(fetchedRestaurants);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };

    const fetchProfile = async () => {
      try {
        const profile = await authService.getProfile();
        setUserProfile(profile);
      } catch (error) {
        console.log(error, "error");
      }
    };

    fetchProfile();
    fetchRestaurants();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const resp = await authService.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        restaurant_uuid: formData.restaurants[0], // Assuming single restaurant selection
        role: formData.role,
        current_subscription: { ...userProfile?.current_subscription, sub_employee: true },
      });

      // If "Save & Add Another" was clicked, reset the form
      if (e.target.name === "saveAndAdd") {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          role: "",
          restaurants: [],
          permissions: [],
        });
        setErrors({});
        setSnackbarMessage("User created successfully, you can add another user");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } else {
        navigate("/staff-management", { state: resp });
      }
    } catch (error) {
      console.error("Error creating user:", error);
      setErrors((prev) => ({
        ...prev,
        submit: error.message || "Failed to create user. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get current user role from localStorage
  let currentUserRole = "";
  try {
    let userData = localStorage.getItem("userRole");
    let parsed;
    try {
      parsed = JSON.parse(userData);
      currentUserRole = parsed?.toLowerCase() || "";
    } catch {
      currentUserRole = userData?.toLowerCase() || "";
    }
  } catch (e) {
    currentUserRole = "";
  }
  

  // Only show correct roles in dropdown
  let filteredRoles = [];
  if (currentUserRole === "manager") {
    // Manager can only add Employee
    filteredRoles = roles.filter((r) => r.value === "employee");
  } else if (currentUserRole === "director") {
    // Director can add Manager and Employee
    filteredRoles = roles.filter(
      (r) => r.value === "manager" || r.value === "employee"
    );
  } else {
    // For now, all other roles see all options
    filteredRoles = roles;
  }

  return (
    <div className="min-h-screen py-6">
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <h1 className="text-2xl font-semibold text-gray-900">
                Add New User
              </h1>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => navigate("/bulk-upload-users")}
                  className="flex items-center text-sm text-primary hover:text-primary-dark"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                    />
                  </svg>
                  Bulk Upload Users
                </button>
                <button
                  onClick={() => navigate("/staff-management")}
                  className="text-gray-400 hover:text-gray-500"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Section Header */}
            <div className="text-left">
              <h3 className="text-lg font-medium mb-2">New User Information</h3>
              <p className="text-sm text-gray-500">
                Fill in the details below to add a new user
              </p>
            </div>

            {/* Grid for Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${errors.firstName ? "border-red-300" : "border-gray-300"
                    }`}
                  required
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${errors.lastName ? "border-red-300" : "border-gray-300"
                    }`}
                  required
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${errors.email ? "border-red-300" : "border-gray-300"
                  }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>



            {/* Role Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                Role
              </label>
              <div className="relative">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary appearance-none ${errors.role ? "border-red-300" : "border-gray-300"
                    }`}
                  required
                >
                  <option value="">Select a role</option>
                  {filteredRoles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role}</p>
              )}
              <p className="text-xs text-gray-500 mt-1 text-left">
                This form is specifically for creating manager-level users
              </p>
            </div>

            {/* Assigned Restaurants */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                Assigned Restaurants
              </label>
              <div className="mt-2 border border-gray-200 rounded-md p-2 max-h-40 overflow-y-auto">
                {restaurants.map((restaurant) => (
                  <div
                    key={restaurant.uuid}
                    className="flex items-center p-2 hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      id={`restaurant-${restaurant.uuid}`}
                      name="restaurant"
                      checked={formData.restaurants.includes(restaurant.uuid)}
                      onChange={() => handleRestaurantChange(restaurant.uuid)}
                      className="mr-2"
                      required
                    />
                    <label htmlFor={`restaurant-${restaurant.uuid}`}>
                      {restaurant.name}
                    </label>
                  </div>
                ))}
              </div>
              {errors.restaurants && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.restaurants}
                </p>
              )}
            </div>

            {/* Permissions */}
            {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
              Permissions
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {permissions.map((permission) => (
                <div key={permission.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={permission.id}
                    checked={formData.permissions.includes(permission.id)}
                    onChange={() => handlePermissionChange(permission.id)}
                    className="mr-2"
                  />
                  <label htmlFor={permission.id}>{permission.label}</label>
                </div>
              ))}
            </div>
            {errors.permissions && (
              <p className="mt-1 text-sm text-red-600">{errors.permissions}</p>
            )}
          </div> */}

            {/* Buttons */}
            <div className="flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => navigate("/staff-management")}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Saving..." : "Save User"}
              </button>
              <button
                type="submit"
                name="saveAndAdd"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save & Add Another
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
