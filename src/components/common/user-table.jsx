import { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosConfig";
export default function UserTable({ users, onEditUser }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });


  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getRestaurantNames = (restaurants) => {
    if (!restaurants || restaurants.length === 0) return "-";
    return restaurants.map(r => r.name).join(", ");
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedUsers = () => {
    if (!sortConfig.key) return users;

    return [...users].sort((a, b) => {
      let aValue, bValue;

      switch (sortConfig.key) {
        case 'user':
          aValue = `${a.first_name} ${a.last_name}`.toLowerCase();
          bValue = `${b.first_name} ${b.last_name}`.toLowerCase();
          break;
        case 'role':
          aValue = (a.role === "super_admin" ? "Admin" : a.role || "").toLowerCase();
          bValue = (b.role === "super_admin" ? "Admin" : b.role || "").toLowerCase();
          break;
        case 'restaurant':
          aValue = (getRestaurantNames(a.assigned_restaurants) || "").toLowerCase();
          bValue = (getRestaurantNames(b.assigned_restaurants) || "").toLowerCase();
          break;
        case 'lastLogin':
          aValue = a.last_login || "";
          bValue = b.last_login || "";
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) {
      return (
        <svg className="w-4 h-4 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }

    if (sortConfig.direction === 'asc') {
      return (
        <svg className="w-4 h-4 ml-1 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4l9 16 9-16H3z" />
        </svg>
      );
    } else {
      return (
        <svg className="w-4 h-4 ml-1 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 20L12 4 3 20h18z" />
        </svg>
      );
    }
  };

  const sortedUsers = getSortedUsers();


  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-trbackground">
            <th className="w-10 px-4 py-3 text-center">
              <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
            </th>
            <th
              className="px-4 py-3 text-center text-xs font-medium text-gray-800 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
              onClick={() => handleSort('user')}
            >
              <div className="flex items-center justify-center">
                User
                <SortIcon column="user" />
              </div>
            </th>
            <th
              className="px-4 py-3 text-center text-xs font-medium text-gray-800 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
              onClick={() => handleSort('role')}
            >
              <div className="flex items-center justify-center">
                Role & Permissions
                <SortIcon column="role" />
              </div>
            </th>
            <th
              className="px-4 py-3 text-center text-xs font-medium text-gray-800 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
              onClick={() => handleSort('restaurant')}
            >
              <div className="flex items-center justify-center">
                Restaurant
                <SortIcon column="restaurant" />
              </div>
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-800 uppercase tracking-wider">
              Status
            </th>
            <th
              className="px-4 py-3 text-center text-xs font-medium text-gray-800 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
              onClick={() => handleSort('lastLogin')}
            >
              <div className="flex items-center justify-center">
                Last Login
                <SortIcon column="lastLogin" />
              </div>
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-800 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users?.length > 0 ?
            sortedUsers.map((user) => (
              <tr key={user.uuid} className="hover:bg-hover">
                <td className="px-4 py-4">
                  <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center">
                    {user?.image_url ? (
                      <img
                        src={process.env.REACT_APP_IMAGE_BASE_URL + user?.image_url}
                        alt={`${user.first_name} ${user.last_name}`}
                        className="h-10 w-10 rounded-full object-cover mr-3"
                      />
                    ) : (
                      <div className="p-3 rounded-full bg-gray-200 flex-shrink-0 mr-3">

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
                    )}
                    <div className="text-left">
                      <div className="text-sm font-medium text-gray-900">{`${user.first_name} ${user.last_name}` || "-"}</div>
                      <div className="text-sm text-gray-500">{user.email || "-"}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-center">
                  <div className="text-sm font-medium text-gray-900">{(user.role === "super_admin" ? "Admin" : user.role) || "-"}</div>
                  <div className="text-sm text-gray-500">{user.permissions || "-"}</div>
                </td>
                <td className="px-4 py-4 text-center">
                  <div className="text-sm text-gray-900">{getRestaurantNames(user.assigned_restaurants)}</div>
                </td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${!user?.last_login && 'bg-yellow-100 text-yellow-800' || (user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')
                    }`}>
                    {!user?.last_login && 'Pending' || (user.active ? 'Active' : 'Inactive')}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  {user.last_login ? formatDate(user.last_login) : 'Never'}
                </td>
                <td className="px-4 py-4 text-right text-sm font-medium">
                  <button
                    onClick={() => onEditUser(user)}
                    className="text-primary hover:text-primary-dark"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))
            :
            <tr>
              <td colSpan="7" className="px-4 py-4 text-center text-gray-500">
                No users found
              </td>
            </tr>
          }
        </tbody>
      </table>

      <div className="px-4 py-3 flex flex-wrap items-center justify-between border-t border-gray-200">
        <div className="text-sm text-gray-700">Showing 1 to {sortedUsers.length} of {sortedUsers.length} entries</div>
        <div className="flex flex-wrap items-center space-x-2">
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white text-gray-700">
            Previous
          </button>
          <button className="px-3 py-1 rounded-md text-sm bg-textcolor text-white">1</button>
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white text-gray-700">Next</button>
        </div>
      </div>
    </div>
  );
}
