import ProgressBar from "./progressBar"
import Toggle from "./toggle"
import Button from "./button"
import usaStates from "../../usaStates"
import { useEffect, useState, useRef } from "react"
import { RestaurantsService } from "../../services/Restaurants"

export default function ManageRestaurantPanel({ restaurant, onClose, fetchData }) {
  const [showManagersModal, setShowManagersModal] = useState(false);
  const [showEmployeesModal, setShowEmployeesModal] = useState(false);
  const [restaurantName, setRestaurantName] = useState(restaurant?.name || '');
  const [addressStreet, setAddressStreet] = useState(restaurant?.address?.street || '');
  const [addressCity, setAddressCity] = useState(restaurant?.address?.city || '');
  const [addressState, setAddressState] = useState(restaurant?.address?.state || '');
  const [addressZip, setAddressZip] = useState(restaurant?.address?.zip || '');
  const [restaurantStatus, setRestaurantStatus] = useState(restaurant.status === "active" ? true : false);
  // const [cuisineType, setCuisineType] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const cuisineRef = useRef("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);


  const handleSave = async () => {
    setIsSaving(true);

    try {
      await RestaurantsService.updateRestaurant(restaurant.uuid, {
        name: restaurantName,
        address: {
          street: addressStreet,
          city: addressCity,
          state: addressState,
          zip: addressZip
        },
        status: restaurantStatus ? 'active' : 'inactive',
        cuisine_type: cuisineRef.current.value,
      });
      onClose();
      fetchData();
    } catch (error) {
      console.error('Failed to update restaurant', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-1/2 lg:w-[50%] bg-white border-l border-gray-200 shadow-lg z-50 overflow-y-auto">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-textcolor">Manage Restaurant - {restaurant?.name}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-textcolor"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="p-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-textcolor mb-1 text-left">Restaurant Name</label>
            <input
              type="text"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              className="w-full bg-background p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-textcolor mb-1 text-left">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 inline mr-1"
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Address
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input
                type="text"
                value={addressStreet}
                onChange={e => setAddressStreet(e.target.value)}
                placeholder="Street"
                className="w-full p-2 bg-background border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <input
                type="text"
                value={addressCity}
                onChange={e => setAddressCity(e.target.value)}
                placeholder="City"
                className="w-full p-2 bg-background border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <select
                value={addressState}
                onChange={e => setAddressState(e.target.value)}
                className="w-full p-2 bg-background border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">Select State</option>
                {Object.entries(usaStates).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name} ({code})
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={addressZip}
                onChange={e => setAddressZip(e.target.value)}
                placeholder="Zip"
                className="w-full p-2 bg-background border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-textcolor mb-1 text-left">Cuisine Type</label>
          <div className="relative">
            <input
              type="text"
              defaultValue={restaurant?.cuisine_type || ''}
              ref={cuisineRef}
              placeholder="Cuisine Type"
              className="w-full p-2 bg-background border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary appearance-none"
            />

          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2.5 bg-background rounded-xl">
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Owner</label>
            <p className="text-sm">{restaurant?.account_owner?.first_name} {restaurant?.account_owner?.last_name}</p>
          </div>
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">Franchise Status</label>
            <p className="p-1 bg-textcolor rounded-xl text-white" style={{ fontSize: '13px' }}>Independent Restaurant</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-textcolor mb-1 text-left">Managers Assigned</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="w-[300px]">
              {/* Managers List (show up to 3) */}
              {restaurant?.managers?.slice(0, 3).map((manager, idx) => (
                <div key={manager?.uuid || idx} className={`flex items-center p-2.5 bg-background rounded-xl w-full${idx > 0 ? ' mt-2' : ''}`}>
                  {manager?.image_url
                    ? <img src={manager.image_url} alt={`${manager.first_name} ${manager.last_name}`} className="h-8 w-8 rounded-full mr-2 flex-shrink-0" />
                    :
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-700">
                      {manager?.first_name && manager?.last_name
                        ? `${manager?.first_name[0]}${manager?.last_name[0]}`
                        : 'MN'}
                    </div>
                  }
                  <p className="text-sm">{manager?.first_name} {manager?.last_name}</p>
                </div>
              ))}
              {restaurant?.managers?.length > 3 && (
                <button className="text-red-600 text-sm mt-2" onClick={() => setShowManagersModal(true)}>View All</button>
              )}
            </div>

            <div className=" gap-4 ">
              <div className="p-2.5 bg-background rounded-xl w-full">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">Restaurant Status</label>
                  <Toggle defaultChecked={restaurantStatus} setRestaurantStatus={setRestaurantStatus} />
                </div>
                <p className="text-xs text-gray-500 text-left">Restaurant is {restaurantStatus ? 'active' : 'inactive'}</p>
              </div>

            </div>
          </div>

        </div>



        <div>
          <div className="flex justify-between">
            <label className="block text-sm font-medium text-textcolor mb-1 text-left">Staff Overview</label>
            <button onClick={() => setShowEmployeesModal(true)} className="text-sm text-textcolor text-left">View Full List</button>
          </div>
          <div className="flex items-center">
            <div className="flex items-center space-x-2 mt-4">
              {restaurant?.employees?.slice(0, 5).map((employee, idx) => (
                <div key={employee?.uuid || idx} className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-700">
                  {employee?.first_name && employee?.last_name
                    ? `${employee?.first_name[0]}${employee?.last_name[0]}`
                    : 'EM'}
                </div>
              ))}

            </div>
          </div>
        </div>



        <div className="flex space-x-4 pt-4">
          <Button className="flex-1 hover:bg-gray-800" onClick={handleSave} disabled={isSaving}>Save Changes</Button>
          <Button variant="primary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>

      {/* Managers Modal */}
      {showManagersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">All Managers</h3>
              <button onClick={() => setShowManagersModal(false)} className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-2">
              {restaurant?.managers?.map((manager, idx) => (
                <div key={manager.uuid || idx} className="flex items-center p-2.5 bg-background rounded-xl w-full">
                  <div className="h-8 w-8 rounded-full bg-gray-200 mr-2 flex-shrink-0"></div>
                  <p className="text-sm">{manager.first_name} {manager.last_name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Employees Modal */}
      {showEmployeesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">All Employees</h3>
              <button onClick={() => setShowEmployeesModal(false)} className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-2">
              {restaurant?.employees?.map((employee, idx) => (
                <div key={employee.uuid || idx} className="flex items-center p-2.5 bg-background rounded-xl w-full">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-700 mr-2">
                    {employee.first_name && employee.last_name
                      ? `${employee.first_name[0]}${employee.last_name[0]}`
                      : 'EM'}
                  </div>
                  <p className="text-sm">{employee.first_name} {employee.last_name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}