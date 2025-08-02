import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UserTable from "../components/common/user-table";
import EditUserPanel from "../components/common/edit-user-panel";
import Button from "../components/common/button";
import Dropdown from "../components/common/dropdown";
import { ManageStaffUserService } from "../services/ManageStaffUsers";
import { RestaurantsService } from "../services/Restaurants";
import { Snackbar, Alert } from "@mui/material";

export default function StaffManagement() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState(["Active"]);
  const [showEditUserPanel, setShowEditUserPanel] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filters, setFilters] = useState({
    role: null,
    status: null,
    restaurant: null,
    lastLogin: null,
  });
  const location = useLocation();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersData, restaurantsData] = await Promise.all([
          ManageStaffUserService.getAllStaffUsers(),
          RestaurantsService.getAllRestaurants(),
        ]);
        setUsers(usersData);
        setRestaurants(restaurantsData);
      } catch (err) {
        setError("Failed to fetch data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const userData = location?.state?.user;
    if (userData) {
      setSnackbarOpen(true);
      setSnackbarMessage("User added successfully!");
      setSnackbarSeverity("success");
      setUsers((prev) => [...prev, userData]);
    }
    fetchData();
  }, []);

  useEffect(() => {
    users.forEach((u, i) => {
      if (!u.name || !u.email || !u.restaurant) {
        console.warn(`Missing fields in user[${i}]`, u);
      }
    });
  }, [users]);

  const filterOptions = {
    role: [
      { value: "all", label: "All Roles" },
      { value: "director", label: "Director" },
      { value: "employee", label: "Employee" },
      { value: "manager", label: "Manager" },
    ],
    status: [
      { value: "all", label: "All Statuses" },
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
    ],
    restaurant: [
      { value: "all", label: "All Restaurants" },
      ...restaurants.map((restaurant) => ({
        value: restaurant.name,
        label: restaurant.name,
      })),
    ],
    lastLogin: [
      { value: "all", label: "All Last Logins" },
      { value: "today", label: "Today" },
      { value: "week", label: "This Week" },
      { value: "month", label: "This Month" },
    ],
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filter) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter((f) => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const handleAddUser = () => {
    navigate("/add-user");
  };

  const handleEditUser = (user) => {
    const formattedUser = {
      uuid: user.uuid,
      name: `${user.first_name} ${user.last_name}`,
      first_name: `${user.first_name}`,
      last_name: `${user.last_name}`,
      email: user.email,
      role: user.role === "super_admin" ? "Admin" : user.role, // Adjust role if necessary
      assigned_restaurants: user.assigned_restaurants
        ? user.assigned_restaurants.map((r) => r.uuid)
        : [], // Pass array of uuids
      status: user.active ? "Active" : "Inactive",
      last_login: user.last_login,
      lesson_progress: user.lesson_progress || [],
      trainingProgress:
        user.lesson_progress.length > 0
          ? (user.lesson_progress.filter((l) => l.completed).length /
              user.lesson_progress.length) *
            100
          : 0,
      // Add any other fields you want to display
    };
    setSelectedUser(formattedUser);
    setShowEditUserPanel(true);
  };

  const handleDropdownSelect = (type, option) => {
    setFilters((prev) => ({
      ...prev,
      [type]: option.value === "all" ? null : option.value,
    }));
  };

  const filteredUsers = users.filter((user) => {
    const searchQueryLower = searchQuery.toLowerCase();
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    const email = user.email.toLowerCase();
    const matchesSearch =
      fullName.includes(searchQueryLower) || email.includes(searchQueryLower);

    const matchesRole = !filters.role || user.role === filters.role;
    const matchesStatus =
      !filters.status ||
      (filters.status === "active" ? user.active : !user.active);

    const matchesRestaurant =
      !filters.restaurant ||
      user.assigned_restaurants?.some(
        (restaurant) => restaurant.name === filters.restaurant
      );

    const matchesLastLogin =
      !filters.lastLogin ||
      (() => {
        if (!user.last_login) return filters.lastLogin === "never";

        const lastLogin = new Date(user.last_login);
        const now = new Date();
        const diffTime = Math.abs(now - lastLogin);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        switch (filters.lastLogin) {
          case "today":
            return diffDays === 0;
          case "week":
            return diffDays <= 7;
          case "month":
            return diffDays <= 30;
          case "never":
            return false;
          default:
            return true;
        }
      })();

    return (
      matchesSearch &&
      matchesRole &&
      matchesStatus &&
      matchesRestaurant &&
      matchesLastLogin
    );
  });

  return (
    <div className="flex min-h-screen ">
      <div className="flex-1 overflow-auto">
        <main className="p-3 sm:p-5 lg:p-7">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="text-left">
                  <h1 className="text-xl font-semibold text-textcolor">
                    User Management
                  </h1>
                  <p className="text-sm text-gray-500">
                    Manage your team members and their access
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleAddUser}
                    className="  flex items-center"
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
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Add User
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <div className="relative w-full md:w-auto">
                  <input
                    type="text"
                    placeholder="Search by name, email, or restaurant..."
                    className="w-full md:w-80 pl-10  pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
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
                  </svg>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <Dropdown
                  label="All Roles"
                  options={filterOptions.role}
                  selectedOption={filters.role}
                  onSelect={(option) => handleDropdownSelect("role", option)}
                />
                <Dropdown
                  label="All Statuses"
                  options={filterOptions.status}
                  selectedOption={filters.status}
                  onSelect={(option) => handleDropdownSelect("status", option)}
                />
                <Dropdown
                  label="All Restaurants"
                  options={filterOptions.restaurant}
                  selectedOption={filters.restaurant}
                  onSelect={(option) =>
                    handleDropdownSelect("restaurant", option)
                  }
                />

                {/* <Dropdown
                  label="All Last Logins"
                  options={filterOptions.lastLogin}
                  selectedOption={filters.lastLogin}
                  onSelect={(option) => handleDropdownSelect('lastLogin', option)}
                /> */}
              </div>

              {/* {activeFilters.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="text-sm text-gray-500">Active filters:</span>
                  {activeFilters.map((filter) => (
                    <span
                      key={filter}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-md flex items-center"
                    >
                      {filter}
                      <button
                        className="ml-1 text-gray-500 hover:text-gray-700"
                        onClick={() => handleFilterChange(filter)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )} */}

              {/* No Staff Message */}
              {!loading && filteredUsers.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <img
                    src="/staff-management.png"
                    alt="Staff Management"
                    className="w-12 h-12 mb-2"
                  />
                  {filters.status === "inactive" ? (
                    <span className="text-lg text-gray-700 font-medium">
                      No inactive staff found.
                    </span>
                  ) : (
                    <span className="text-lg text-gray-700 font-medium">
                      No staff added! Add your team to track progress and
                      training.
                    </span>
                  )}
                </div>
              )}

              <UserTable users={filteredUsers} onEditUser={handleEditUser} />
            </div>
          </div>
        </main>
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {showEditUserPanel && selectedUser && (
        <EditUserPanel
          user={selectedUser}
          setUsers={setUsers}
          onClose={() => setShowEditUserPanel(false)}
        />
      )}
    </div>
  );
}
