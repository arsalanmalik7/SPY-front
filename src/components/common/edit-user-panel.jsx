import { useState, useEffect } from "react";
import { RestaurantsService } from "../../services/Restaurants";
import authService from "../../services/authService";
import { Eye, EyeOff } from "lucide-react";
import { ManageStaffUserService } from "../../services/ManageStaffUsers";

export default function EditUserPanel({ user, setUsers, onClose }) {
  const userRole = localStorage.getItem("userRole");

  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    role: user?.role || "",
    assigned_restaurants: user?.assigned_restaurants || [],
    lesson_progress: user?.lesson_progress || {},
    newPassword: "",
    status: user?.status || "active",
  });

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await RestaurantsService.getAllRestaurants();
        setRestaurants(data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        setError("Failed to load restaurants");
      }
    };

    fetchRestaurants();
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setCurrentUserRole(role);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRestaurantChange = (e) => {
    const selectedRestaurant = restaurants.find(
      (r) => r.uuid === e.target.value
    );
    setFormData((prev) => ({
      ...prev,
      assigned_restaurants: selectedRestaurant ? [selectedRestaurant.uuid] : [],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // Validation: must select a restaurant
    if (
      !formData.assigned_restaurants ||
      formData.assigned_restaurants.length === 0 ||
      !formData.assigned_restaurants[0]
    ) {
      setError("Please select a restaurant.");
      setLoading(false);
      return;
    }
    try {
      await authService.updateUser(user.uuid, formData);
      const data = await ManageStaffUserService.getAllStaffUsers();
      setUsers(data);
      onClose(); // Close immediately after update
    } catch (error) {
      setError(error.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  const checkPermission = () => {
    if (currentUserRole === "super_admin") {
      return true;
    } else if (currentUserRole === "director") {
      return userRole === "employee" || userRole === "manager";
    } else if (currentUserRole === "manager") {
      return userRole === "employee";
    } else {
      return false;
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-1/2 lg:w-[50%] bg-white border-l border-gray-200 shadow-lg z-50 overflow-y-auto">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Edit User</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-4">
        {/* Loading indicator */}
        {loading && (
          <div className="mb-4 text-center text-primary">Saving changes...</div>
        )}
        <div className="flex items-center mb-6">
          <div className="p-4 rounded-full bg-gray-200 mr-3 flex-shrink-0">
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
          </div>
          <div className="text-left">
            <h3 className="text-lg font-medium">{`${formData.first_name} ${formData.last_name}`}</h3>
            <p className="text-sm text-gray-500">{formData.role}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-baseline gap-4">
            <div className="text-left w-[400px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                disabled={!checkPermission()}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div className="text-left w-[400px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                disabled={!checkPermission()}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <div className="flex justify-between items-baseline gap-4">
            <div className="text-left w-[400px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!checkPermission()}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            {userRole === formData?.role ||
              (userRole === "super_admin" && (
                <>
                  <div className="text-left w-[400px] relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password (optional)
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    />

                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-3 top-5 flex items-center z-10"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-icon" />
                      ) : (
                        <Eye className="h-5 w-5 text-icon" />
                      )}
                    </button>
                  </div>
                </>
              ))}
          </div>

          <div className="flex justify-between items-baseline gap-4">
            <div className="text-left w-[400px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                {currentUserRole !== "manager" && (
                  <option value="manager">Manager</option>
                )}
                <option value="employee">Employee</option>
                {currentUserRole !== "director" && (
                  <option value="director">Director</option>
                )}
              </select>
            </div>

            <div className="text-left w-[400px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assigned Restaurant
              </label>
              <select
                name="assigned_restaurants"
                value={formData.assigned_restaurants[0] || ""}
                onChange={handleRestaurantChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">Select a restaurant</option>
                {restaurants.map((restaurant) => (
                  <option key={restaurant.uuid} value={restaurant.uuid}>
                    {restaurant.name}
                  </option>
                ))}
              </select>
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
                  checked={formData.status === "Active"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: e.target.checked ? "Active" : "Inactive",
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
                      formData.status === "Active"
                        ? "translate-x-4"
                        : "translate-x-0"
                    }`}
                  ></span>
                </label>
              </div>
              <span className="text-sm">{formData.status}</span>
            </div>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-primary text-white rounded-md disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full mt-2 py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
