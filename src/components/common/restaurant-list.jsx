import Badge from "./badge"
import ProgressBar from "./progressBar"
import usaStates from "../../usaStates"

// Static data as fallback
const staticRestaurants = []

export default function RestaurantList({
  restaurants = [],
  activeTab,
  onViewEmployees,
  onManageMenu,
  onLessonProgress,
  onManageRestaurant,
  onEditRestaurant,
}) {
  // Map API data to match the static data structure
  const mappedRestaurants = restaurants.map(restaurant => ({
    ...restaurant,
    account_owner: restaurant.account_owner,
    status: restaurant.status,
    employees: restaurant.employees?.filter(emp => emp !== null) || [],
    managers: restaurant.managers,
    dishes: restaurant.current_dishes?.length || 0,
    wines: restaurant.current_wines?.length || 0,
    trainingComplete: 0, // Using static value since not in API
    missedTraining: 0, // Using static value since not in API
    lastMenuUpdate: new Date(restaurant.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }))

  // Use API data if available, otherwise use static data
  const displayRestaurants = mappedRestaurants.length > 0 ? mappedRestaurants : staticRestaurants

  const filteredRestaurants =
    activeTab === "all"
      ? displayRestaurants
      : displayRestaurants.filter(
        (restaurant) =>
          (activeTab === "active" && restaurant.status === "active") ||
          (activeTab === "inactive" && restaurant.status === "inactive"),
      )

  if (filteredRestaurants.length === 0) {
    return (
      <div className="text-center p-8 bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500">No {activeTab} restaurants found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {filteredRestaurants.map((restaurant) => (
        <div key={restaurant._id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="flex justify-between items-start">
              <div className="text-left">
                <h3 className="text-lg font-semibold text-textcolor">{restaurant.name}</h3>
                <p>
                  {restaurant.address
                    ? `${restaurant.address.street || ''}, ${restaurant.address.city || ''}, ${restaurant.address.state ? (usaStates[restaurant.address.state] || restaurant.address.state) : ''} ${restaurant.address.zip || ''}`
                    : ''}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEditRestaurant(restaurants.find(r => r._id === restaurant._id))}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    <path d="m15 5 4 4" />
                  </svg>
                </button>
                {restaurant.status === "active" ? (
                  <Badge className="bg-iconbackground text-gray-900 border-iconbackground">Active</Badge>
                ) : (
                  <Badge variant="default" className="bg-gray-50 text-gray-500 border-gray-200">
                    Deactivated
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 divide-x divide-gray-100">
            <div className="p-4 bg-background bg-opacity-40 m-2.5 text-left">
              <p className="text-sm text-textcolor mb-1">Employees</p>
              <p className="text-2xl font-semibold">{restaurant.employees.length}</p>
            </div>
            <div className="p-4 bg-background bg-opacity-40 m-2.5 text-left">
              <p className="text-sm text-textcolor mb-1">Total Dishes</p>
              <p className="text-2xl font-semibold">{restaurant.dishes}</p>
            </div>
            <div className="p-4 bg-background bg-opacity-40 m-2.5 text-left">
              <p className="text-sm text-textcolor mb-1">Total Wines</p>
              <p className="text-2xl font-semibold">{restaurant.wines}</p>
            </div>
            <div className="p-4 bg-background bg-opacity-40 m-2.5 text-left">
              <p className="text-sm text-textcolor mb-1">Training Complete</p>
              <p className="text-2xl font-semibold">{restaurant.trainingComplete}%</p>
            </div>
            <div className="p-4 bg-background bg-opacity-40 m-2.5 text-left">
              <p className="text-sm text-textcolor mb-1">Missed Training</p>
              <p className="text-2xl font-semibold">{restaurant.missedTraining}%</p>
            </div>
            <div className="p-4 bg-background bg-opacity-40 m-2.5 text-left">
              <p className="text-sm text-textcolor mb-1">Last Menu Update</p>
              <p className="text-2xl font-semibold">{restaurant.lastMenuUpdate}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 divide-x">
            <button
              onClick={() => onViewEmployees(restaurant)}
              className="p-4 text-center hover:bg-gray-50 transition-colors flex justify-center items-center gap-3 border border-gray-300 rounded-xl m-2.5"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span className="text-sm font-medium">View Employees</span>
            </button>
            <button
              onClick={() => onManageMenu(restaurant)}
              className="p-4 text-center hover:bg-gray-50 transition-colors flex justify-center items-center gap-3 border border-gray-300 rounded-xl m-2.5"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              <span className="text-sm font-medium">Manage Menu</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 divide-x ">
            <button
              onClick={() => onLessonProgress(restaurant)}
              className="p-4 text-center hover:bg-gray-50 transition-colors flex justify-center items-center gap-3 border border-gray-300 rounded-xl m-2.5"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="8" r="6" />
                <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
              </svg>
              <span className="text-sm font-medium">Lesson Progress</span>
            </button>
            <button
              onClick={() => onManageRestaurant(restaurant)}
              className="p-4 text-center hover:bg-gray-50 transition-colors flex justify-center items-center gap-3 border border-gray-300 rounded-xl m-2.5"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <line x1="2" x2="22" y1="10" y2="10" />
              </svg>
              <span className="text-sm font-medium">Manage Restaurant</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
