import { useState, useEffect } from "react"
import RestaurantList from "../components/common/restaurant-list"
import ViewEmployeesPanel from "../components/common/view-employees-panel"
import LessonProgressPanel from "../components/common/lesson-progress-panel"
import ManageRestaurantPanel from "../components/common/manage-restaurant-panel"
import AddRestaurantPanel from "../components/common/add-restaurant-modal"
import ManageMenuPanel from "../components/common/manage-menu-panel"
import { RestaurantsService } from "../services/Restaurants"
import { bulkUploadLessons } from "../services/lessonProgress"
import authService from "../services/authService"
import { MenuService } from "../services/MenuService"
import { Upload } from "lucide-react"
import { Snackbar, Alert } from '@mui/material';

export default function RestaurantManagement() {
  const userRole = localStorage.getItem("userRole")
  const user = authService.getCurrentUser();

  const [activeTab, setActiveTab] = useState("all")
  const [activeSidePanel, setActiveSidePanel] = useState(null)
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadError, setUploadError] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [jsonPreview, setJsonPreview] = useState(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [dishAnalyticsData, setDishAnalyticsData] = useState([]);
  const [wineAnalyticsData, setWineAnalyticsData] = useState([]);
  const [userProfile, setUserProfile] = useState();

  const fetchRestaurants = async () => {
    try {
      const data = await RestaurantsService.getAllRestaurants()

      setRestaurants(data)
    } catch (error) {
      console.error('Error fetching restaurants:', error)
    } finally {
      setLoading(false)
    }
  };
  useEffect(() => {

    const fetchProfile = async () => {
      try {
        const profile = await authService.getProfile();

        setUserProfile(profile);
      } catch (error) {
        console.log(error, "error");
      }
    };
    fetchProfile();

    fetchRestaurants()
  }, [])

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFile = (file) => {
    if (file.type === "application/json" || file.name.endsWith(".json")) {
      setSelectedFile(file)
      setUploadError("")

      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result)
          setJsonPreview(json)
        } catch (error) {
          setUploadError("Error parsing JSON file.")
          setJsonPreview(null)
        }
      }
      reader.readAsText(file)
    } else {
      setUploadError("Please select a JSON file (.json)")
      setSelectedFile(null)
      setJsonPreview(null)
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  const handleOpenSidePanel = async (panel, restaurant = null) => {
    try {

      setActiveSidePanel(panel);
      setSelectedRestaurant(restaurant);
      const [dishAnalytics, wineAnalytics] = await Promise.all([
        MenuService.getDishAnalytics(restaurant?.uuid),
        MenuService.getWineAnalytics(restaurant?.uuid)
      ]);

      setDishAnalyticsData(dishAnalytics);
      setWineAnalyticsData(wineAnalytics);

    } catch (error) {
      console.log(error, "error");
    }
  };

  const handleCloseSidePanel = (e) => {
    if (e) e.stopPropagation();
    setActiveSidePanel(null)
    setSelectedRestaurant(null)
  }

  const handleAddRestaurant = () => {
    handleOpenSidePanel("addRestaurant")
  }

  const handleEditRestaurant = (restaurant) => {
    handleOpenSidePanel("editRestaurant", restaurant)
  }

  const handleSaveRestaurant = async (activeSidePanel, formData, error) => {
    console.log("and error:", error);
    try {
      // Uncomment and use the correct API call
      // if (activeSidePanel === "editRestaurant" && selectedRestaurant) {
      //   await RestaurantsService.updateRestaurant(selectedRestaurant.uuid, restaurantData)
      // } else {
      //   await RestaurantsService.createRestaurant(restaurantData)
      // }
      handleCloseSidePanel();
      if (restaurants?.length === 0) {
        setSnackbarMessage("Restaurant added! Now, add your staff and create your menu to unlock full features.");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } else if (activeSidePanel === "addRestaurant") {
        if (typeof error === "string") {
          setSnackbarMessage(error);
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }else {
        setSnackbarMessage("Restaurant added!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        }
      } else if (activeSidePanel === "editRestaurant") {
        setSnackbarMessage("Restaurant updated!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      }
      // Refresh the restaurants list
      const data = await RestaurantsService.getAllRestaurants();
      setRestaurants(data);
      // if (callback) callback();
    } catch (error) {
      console.error('Error saving restaurant:', error);
      setSnackbarMessage(error.response?.data?.message || 'Error saving restaurant');
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  }



  const handleBulkUpload = async () => {
    if (!selectedFile) {
      setUploadError('Please select a file');
      return;
    }

    if (selectedFile.type !== "application/json" && !selectedFile.name.endsWith(".json")) {
      setUploadError("Please select a JSON file (.json)")
      return
    }

    setIsUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      await bulkUploadLessons(formData, 'restaurant');
      setShowBulkUploadModal(false);
      setSelectedFile(null);
      setJsonPreview(null)
      // Refresh the restaurants list
      const data = await RestaurantsService.getAllRestaurants()
      setRestaurants(data)
    } catch (error) {
      setUploadError(error.response?.data?.message || 'Error uploading restaurants');
    } finally {
      setIsUploading(false);
    }
  };

  const managerAddedRestaurant = restaurants.filter(restaurant => restaurant?.account_owner?.uuid === user?.uuid);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background">
      <div className="flex-1 overflow-auto">
        <main className="p-3 sm:p-5 lg:p-7">
          <div className="mb-6 bg-white p-4 sm:p-5 lg:p-6 border border-gray-200 rounded-lg">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 text-left text-textcolor">
              Your Restaurants
            </h2>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleTabChange("active")}
                  className={`px-3 sm:px-4 py-2 rounded-md ${activeTab === "active"
                    ? "bg-textcolor text-white"
                    : "bg-white text-gray-700 border border-gray-300"
                    }`}
                >
                  Active
                </button>
                <button
                  onClick={() => handleTabChange("inactive")}
                  className={`px-3 sm:px-4 py-2 rounded-md ${activeTab === "inactive"
                    ? "bg-textcolor text-white"
                    : "bg-white text-gray-700 border border-gray-300"
                    }`}
                >
                  Inactive
                </button>
                <button
                  onClick={() => handleTabChange("all")}
                  className={`px-3 sm:px-4 py-2 rounded-md ${activeTab === "all"
                    ? "bg-textcolor text-white"
                    : "bg-white text-gray-700 border border-gray-300"
                    }`}
                >
                  All
                </button>
              </div>
              <div className="flex gap-2">
                {userRole === "super_admin" && (
                  <>
                    <button
                      onClick={() => setShowBulkUploadModal(true)}
                      className="px-3 sm:px-4 py-2 bg-textcolor text-white rounded-md flex items-center"
                    >
                      <Upload size={20} className="mr-1" />
                      Bulk Upload
                    </button>
                  </>
                )}
                {(managerAddedRestaurant?.length > 0 && userRole === "manager" && userProfile?.current_subscription?.sub_employee) || restaurants.length === userProfile?.current_subscription?.locations ? null : <button
                  onClick={handleAddRestaurant}
                  className="px-3 sm:px-4 py-2 bg-textcolor text-white rounded-md flex items-center"
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
                  Add Restaurant
                </button>}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-screen items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-200 border-t-red-500"></div>
            </div>
          ) : (
            <RestaurantList
              restaurants={restaurants}
              activeTab={activeTab}
              onViewEmployees={(restaurant) =>
                handleOpenSidePanel("viewEmployees", restaurant)
              }
              onManageMenu={(restaurant) =>
                handleOpenSidePanel("manageMenu", restaurant)
              }
              onLessonProgress={(restaurant) =>
                handleOpenSidePanel("lessonProgress", restaurant)
              }
              onManageRestaurant={(restaurant) =>
                handleOpenSidePanel("manageRestaurant", restaurant)
              }
              onEditRestaurant={handleEditRestaurant}
            />
          )}
        </main>
      </div>

      {/* Side Panels */}
      {activeSidePanel === "viewEmployees" && (
        <ViewEmployeesPanel
          restaurant={selectedRestaurant}
          onClose={handleCloseSidePanel}
        />
      )}

      {activeSidePanel === "lessonProgress" && (
        <LessonProgressPanel
          restaurant={selectedRestaurant}
          onClose={handleCloseSidePanel}
        />
      )}

      {activeSidePanel === "manageRestaurant" && (
        <ManageRestaurantPanel
          restaurant={selectedRestaurant}
          onClose={handleCloseSidePanel}
          fetchData={fetchRestaurants}
        />
      )}

      {activeSidePanel === "manageMenu" && (
        <ManageMenuPanel
          restaurant={selectedRestaurant}
          onClose={handleCloseSidePanel}
          dishAnalyticsData={dishAnalyticsData}
          wineAnalyticsData={wineAnalyticsData}
        />
      )}

      {(activeSidePanel === "addRestaurant" || activeSidePanel === "editRestaurant") && (
        <AddRestaurantPanel
          restaurant={activeSidePanel === "editRestaurant" ? selectedRestaurant : null}
          onSave={(formData, error) => handleSaveRestaurant(activeSidePanel, formData, error)}
          onClose={handleCloseSidePanel}
        />
      )}

      {/* Snackbar for success/error messages */}
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

      {/* Bulk Upload Modal */}
      {showBulkUploadModal && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black opacity-30" onClick={() => setShowBulkUploadModal(false)}></div>
          <div className="fixed inset-y-0 right-0 w-full md:w-1/2 lg:w-[50%] bg-white border-l border-gray-200 shadow-lg z-50 overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-textcolor">Bulk Upload Restaurants</h2>
              <button onClick={() => setShowBulkUploadModal(false)} className="text-gray-500 hover:text-gray-700">
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
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Upload JSON File</h3>
                  <p className="text-sm text-gray-500">
                    Upload a JSON file containing restaurant information. Make sure to follow the correct format.
                  </p>
                </div>

                <div
                  className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md ${dragActive ? 'bg-gray-100' : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                      >
                        <span>{selectedFile ? selectedFile.name : 'Upload a file'}</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          accept=".json"
                          className="sr-only"
                          onChange={(e) => handleFile(e.target.files[0])}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">JSON up to 10MB</p>
                  </div>
                </div>

                {jsonPreview && (
                  <div>
                    <h4 className="text-md font-medium mb-2">File Preview</h4>
                    <pre className="bg-gray-100 p-4 rounded-md text-xs overflow-auto max-h-60">
                      <code>{JSON.stringify(jsonPreview, null, 2)}</code>
                    </pre>
                  </div>
                )}

                {uploadError && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
                    {uploadError}
                  </div>
                )}

                <div className="flex justify-between items-center space-x-2 pt-4 border-t border-gray-200">
                  <a
                    href="./restaurants.json"
                    download
                    className="inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-textcolor text-white hover:bg-gray-400 px-4 py-2 text-base"
                    style={{ textDecoration: "none" }}
                  >
                    Download Template
                  </a>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowBulkUploadModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleBulkUpload}
                      disabled={!selectedFile || isUploading}
                    >
                      {isUploading ? 'Uploading...' : 'Upload Restaurants'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

