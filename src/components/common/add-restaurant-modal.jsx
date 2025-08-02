import { useState, useEffect } from "react";
import { RestaurantsService } from "../../services/Restaurants";
import { Autocomplete, TextField } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import usaStates from "../../usaStates";

export default function AddRestaurantPanel({
  onSave,
  onClose,
  restaurant = null,
}) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
    },
    phone: "",
    directors: [],
    managers: [],
    employees: [],
    status: "active",
    subscription_plan: "Multiple",
    allow_manager_modifications: true,
    cuisine_type: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchData, setSearchData] = useState({
    managers: [],
    directors: [],
    employees: [],
  });
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = "Name is required.";
    if (!formData.address.street.trim()) errors.street = "Street is required.";
    if (!formData.address.city.trim()) errors.city = "City is required.";
    if (!formData.address.state.trim()) errors.state = "State is required.";

    if (!formData.address.zip || !/^\d{5}$/.test(formData.address.zip)) {
      errors.zip = "ZIP code must be 5 digits.";
    }

    if (!formData.phone) {
      errors.phone = "Phone number is required.";
    } else {
      const digitsOnly = formData.phone.replace(/\D/g, "");
      const formatRegex =
        /^(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;

      if (digitsOnly.length < 10 || !formatRegex.test(formData.phone)) {
        errors.phone =
          "Phone number format is incorrect or must have at least 10 digits.";
      }
    }

    // Directors, managers, and employees are now fully optional; no validation for them

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Fetch search data
  useEffect(() => {
    const fetchSearchData = async () => {
      setLoadingSearch(true);
      try {
        const data = await RestaurantsService.searchData();
        setSearchData(data);
      } catch (err) {
        console.error("Error fetching search data:", err);
      } finally {
        setLoadingSearch(false);
      }
    };
    fetchSearchData();
  }, []);

  // Initialize form data when restaurant prop changes
  useEffect(() => {
    if (restaurant) {
      setFormData({
        name: restaurant.name || "",
        cuisine_type: restaurant.cuisine_type || "",
        address: {
          street: restaurant.address?.street || "",
          city: restaurant.address?.city || "",
          state: restaurant.address?.state || "",
          zip: restaurant.address?.zip || "",
        },
        phone: restaurant.phone || "",
        directors:
          restaurant?.directors.map((director) => director?.uuid) || [],
        managers: restaurant?.managers.map((manager) => manager?.uuid) || [],
        employees:
          restaurant?.employees.map((employee) => employee?.uuid) || [],
        status: restaurant?.status || "active",
        subscription_plan: restaurant?.subscription_plan || "Multiple",
        allow_manager_modifications:
          restaurant?.allow_manager_modifications ?? true,
      });
    }
  }, [restaurant]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "phone") {
      const digits = value.replace(/\D/g, "").slice(0, 10); // Only digits, max 10
      let formatted = digits;

      if (digits.length > 6) {
        formatted = `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
      } else if (digits.length > 3) {
        formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`;
      }

      setFormData((prev) => ({
        ...prev,
        phone: formatted,
      }));
      return;
    }

    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validateForm()) return;
    setLoading(true);
    setError(null);
    setIsSubmitting(true);
    try {
      if (restaurant == null) {
        await RestaurantsService.createRestaurant(formData);

        onSave(formData);
      } else {
        await RestaurantsService.updateRestaurant(restaurant.uuid, formData);

        onSave(formData);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        `Failed to ${restaurant ? "update" : "create"} restaurant`;
      setError(errorMessage);
      onSave(formData, errorMessage);
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  // Filter directors to exclude current logged-in director (for all roles, not just director)
  const filteredDirectors = user
    ? searchData.directors.filter((director) => director.uuid !== user.uuid)
    : searchData.directors;

  // Get user role from localStorage if not present in user object
  let userRole = user?.role;
  if (!userRole) {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsed = JSON.parse(userData);
        userRole = parsed.role;
      }
    } catch (e) {
      userRole = undefined;
    }
  }
  // Only show Directors field if user is not a director
  const showDirectorsField =
    userRole && userRole.toLowerCase() === "super_admin";
  const showManagersField =
    (userRole && userRole.toLowerCase() === "super_admin") ||
    (userRole && userRole.toLowerCase() === "director");

  // Clear validation errors for dropdowns as soon as user selects at least one
  useEffect(() => {
    if (userRole && userRole.toLowerCase() === "super_admin") {
      setFormErrors((prev) => ({
        ...prev,
        directors:
          formData.directors && formData.directors.length > 0
            ? undefined
            : prev.directors,
        managers:
          formData.managers && formData.managers.length > 0
            ? undefined
            : prev.managers,
        employees:
          formData.employees && formData.employees.length > 0
            ? undefined
            : prev.employees,
      }));
    }
  }, [formData.directors, formData.managers, formData.employees, userRole]);

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-1/2 lg:w-[50%] bg-white border-l border-gray-200 shadow-lg z-50 overflow-y-auto">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-textcolor">
          {restaurant ? "Edit Restaurant" : "Add New Restaurant"}
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-textcolor"
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

      <div className="p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
              Restaurant Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter restaurant name"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              required
            />

            {formErrors.phone && (
              <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                Street Address
              </label>
              <input
                type="text"
                name="address.street"
                value={formData.address.street}
                onChange={handleInputChange}
                placeholder="Enter street address"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                City
              </label>
              <input
                type="text"
                name="address.city"
                value={formData.address.city}
                onChange={handleInputChange}
                placeholder="Enter city"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                required
              />

              {formErrors.phone && (
                <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                State
              </label>
              <select
                name="address.state"
                value={formData.address.state}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                required
              >
                <option value="">Select a state</option>
                {Object.entries(usaStates).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name} ({code})
                  </option>
                ))}
              </select>
              {formErrors.phone && (
                <p className="text-red-500 text-xs mt-1">{formErrors.state}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                ZIP Code
              </label>
              <input
                type="text"
                name="address.zip"
                value={formData.address.zip}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 5);
                  handleInputChange({
                    target: {
                      name: "address.zip",
                      value,
                      type: "text",
                      checked: undefined,
                    },
                  });
                }}
                placeholder="Enter ZIP code"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                required
                maxLength={5}
                pattern="\d{5}"
                inputMode="numeric"
              />

              {formErrors.zip && (
                <p className="text-red-500 text-xs mt-1">{formErrors.zip}</p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium  mb-1 text-left">
              Cuisine Type
            </label>
            <div className="relative">
              <input
                type="text"
                name="cuisine_type"
                value={formData.cuisine_type}
                onChange={handleInputChange}
                placeholder="Cuisine Type"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter phone number"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              required
            />
            {formErrors.phone && (
              <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
            )}
          </div>

          <div className="space-y-4">
            {/* Only show Directors field if user is not a director */}
            {showDirectorsField && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                  Directors
                </label>
                <Autocomplete
                  multiple
                  options={filteredDirectors}
                  getOptionLabel={(option) =>
                    `${option.first_name} ${option.last_name}`
                  }
                  value={filteredDirectors.filter(
                    (director) =>
                      Array.isArray(formData.directors) &&
                      formData.directors.includes(director.uuid)
                  )}
                  onChange={(_, newValue) => {
                    setFormData((prev) => ({
                      ...prev,
                      directors: newValue.map((item) => item.uuid),
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Search directors"
                      className="w-full"
                      size="small"
                      error={!!formErrors.directors}
                      helperText={formErrors.directors}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          // Try to add the first matching option if not already selected
                          const inputValue = params.inputProps.value
                            ?.trim()
                            .toLowerCase();
                          if (inputValue) {
                            const match = filteredDirectors.find(
                              (d) =>
                                `${d.first_name} ${d.last_name}`.toLowerCase() ===
                                inputValue
                            );
                            if (
                              match &&
                              !formData.directors.includes(match.uuid)
                            ) {
                              setFormData((prev) => ({
                                ...prev,
                                directors: [...prev.directors, match.uuid],
                              }));
                            }
                          }
                        }
                      }}
                    />
                  )}
                  loading={loadingSearch}
                />
              </div>
            )}

            {showManagersField && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                  Managers
                </label>
                <Autocomplete
                  multiple
                  options={searchData.managers}
                  getOptionLabel={(option) =>
                    `${option.first_name} ${option.last_name}`
                  }
                  value={searchData.managers.filter(
                    (manager) =>
                      Array.isArray(formData.managers) &&
                      formData.managers.includes(manager.uuid)
                  )}
                  onChange={(_, newValue) => {
                    setFormData((prev) => ({
                      ...prev,
                      managers: newValue.map((item) => item.uuid),
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Search managers"
                      className="w-full"
                      size="small"
                      error={!!formErrors.managers}
                      helperText={formErrors.managers}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          // Try to add the first matching option if not already selected
                          const inputValue = params.inputProps.value
                            ?.trim()
                            .toLowerCase();
                          if (inputValue) {
                            const match = searchData.managers.find(
                              (m) =>
                                `${m.first_name} ${m.last_name}`.toLowerCase() ===
                                inputValue
                            );
                            if (
                              match &&
                              !formData.managers.includes(match.uuid)
                            ) {
                              setFormData((prev) => ({
                                ...prev,
                                managers: [...prev.managers, match.uuid],
                              }));
                            }
                          }
                        }
                      }}
                    />
                  )}
                  loading={loadingSearch}
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                Employees
              </label>
              <Autocomplete
                multiple
                options={searchData.employees}
                getOptionLabel={(option) =>
                  `${option.first_name} ${option.last_name}`
                }
                value={searchData.employees.filter(
                  (employee) =>
                    Array.isArray(formData.employees) &&
                    formData.employees.includes(employee.uuid)
                )}
                onChange={(_, newValue) => {
                  setFormData((prev) => ({
                    ...prev,
                    employees: newValue.map((item) => item.uuid),
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Search employees"
                    className="w-full"
                    size="small"
                    error={!!formErrors.employees}
                    helperText={formErrors.employees}
                  />
                )}
                loading={loadingSearch}
              />
            </div>
          </div>

          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <div className="flex items-center">
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  name="status"
                  id="toggle-status"
                  checked={formData.status === "active"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: e.target.checked ? "active" : "inactive",
                    }))
                  }
                  className="sr-only"
                />
                <label
                  htmlFor="toggle-status"
                  className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-textcolor transform transition-transform ${
                      formData.status === "active"
                        ? "translate-x-4"
                        : "translate-x-0"
                    }`}
                  ></span>
                </label>
              </div>
              <span className="text-sm">
                {formData.status === "active" ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-textcolor text-white rounded-md hover:bg-gray-800 disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : restaurant
                  ? "Update Restaurant"
                  : "Add Restaurant"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
