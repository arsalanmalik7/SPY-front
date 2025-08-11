import { useState, useEffect } from "react";
import MenuItemsTable from "../components/common/menu-items-table";
import MenuItemEditPanel from "../components/common/menu-item-edit-panel";
import MenuAnalyticsModal from "../components/common/menu-analytics-modal";
import Button from "../components/common/button";
import WineItemEditPanel from "../components/common/wine-item-edit-panel";
import Dropdown from "../components/common/dropdown";
import { MenuService } from "../services/MenuService";
import { Upload } from "lucide-react";
import { BarChart2 } from "lucide-react";
import * as XLSX from "xlsx";
import { RestaurantsService } from "../services/Restaurants";

export default function MenuManagement() {
  const [activeTab, setActiveTab] = useState("food");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedDateFilter, setSelectedDateFilter] = useState("Date Added");
  const [currentMenu, setCurrentMenu] = useState("Current Menu");
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [showEditPanel, setShowEditPanel] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [wines, setWines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("All Countries");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [excelPreviewData, setExcelPreviewData] = useState(null);
  const [excelPreviewHeaders, setExcelPreviewHeaders] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [validDishTypes, setValidDishTypes] = useState([]);
  const [validWineTypes, setValidWineTypes] = useState([]);
  const [foodCategoriesOptions, setFoodCategoriesOptions] = useState([]);
  const [wineCategoriesOptions, setWineCategoriesOptions] = useState([]);
  const [isFileValid, setIsFileValid] = useState(false);
  const allowedHeaders = [
    "name",
    "description",
    "type",
    "price",
    "ingredients",
    "accommodations",
    "allergens",
    "temperature",
    "dietary_restrictions.health",
    "dietary_restrictions.belief",
    "dietary_restrictions.lifestyle",
    "can_substitute",
    "substitutions",
    "substitution_notes",
    "notes",
  ];

  const allowedWineHeaders = [
    "producer_name",
    "product_name",
    "varietals",
    "country",
    "region",
    "sub_region",
    "commune_appellation",
    "vineyard",
    "vintage",
    "category",
    "sub_category",
    "is_filtered",
    "has_residual_sugar",
    "is_organic",
    "is_biodynamic",
    "is_vegan",
    "by_the_glass",
    "by_the_bottle",
    "glass_price",
    "bottle_price",
    "style_name",
    "body",
    "texture",
    "flavor_intensity",
    "type",
    "body_rank",
    "notes",
  ];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (showBulkUploadModal) {
      RestaurantsService.getAllRestaurants()
        .then((data) => setRestaurants(data.restaurants || data))
        .catch(() => setRestaurants([]));
    }
  }, [showBulkUploadModal]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [dishesData, winesData] = await Promise.all([
        MenuService.getAllDishes(),
        MenuService.getAllWines(),
      ]);
      setDishes(dishesData?.dishesWithRestaurant);
      setValidDishTypes(dishesData?.validDishTypes);
      setFoodCategoriesOptions(
        dishesData?.validDishTypes?.map((type) => ({
          value: type,
          label: type,
        }))
      );
      setFoodCategoriesOptions((prev) => [
        ...prev,
        { value: "All Categories", label: "All Categories" },
      ]);

      setWines(winesData?.winesWithRestaurant);
      setValidWineTypes(winesData?.wineCategories);
      setWineCategoriesOptions(
        winesData?.wineCategories?.map((type) => ({
          value: type,
          label: type,
        }))
      );
      setWineCategoriesOptions((prev) => [
        ...prev,
        { value: "All Categories", label: "All Categories" },
      ]);
      setError(null);
    } catch (err) {
      setError("Failed to fetch menu data");
      console.error("Error fetching menu data:", err);
    } finally {
      setLoading(false);
    }
  };

  const locationOptions = [
    { value: "All Locations", label: "All Locations" },
    { value: "Downtown", label: "Downtown" },
    { value: "Uptown", label: "Uptown" },
  ];

  const dateFilterOptions = [
    { value: "Date Added", label: "Date Added" },
    { value: "Last Updated", label: "Last Updated" },
    { value: "Price", label: "Price" },
  ];

  const menuOptions = [
    { value: "Current Menu", label: "Current Menu" },
    { value: "Previous Menu", label: "Previous Menu" },
    { value: "Future Menu", label: "Future Menu" },
  ];

  const countryOptions = [
    { value: "All Countries", label: "All Countries" },
    { value: "France", label: "France" },
    { value: "Italy", label: "Italy" },
    { value: "USA", label: "USA" },
  ];

  const regionOptions = [
    { value: "All Regions", label: "All Regions" },
    { value: "Bordeaux", label: "Bordeaux" },
    { value: "Piedmont", label: "Piedmont" },
    { value: "California", label: "California" },
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleTabChange = (tab) => {
    setSelectedCategory("All Categories");
    setActiveTab(tab);
  };

  const handleAddItem = () => {
    setSelectedMenuItem(null);
    setShowEditPanel(true);
  };

  const handleEditItem = (item) => {
    setSelectedMenuItem(item);
    setShowEditPanel(true);
  };

  const handleCloseEditPanel = () => {
    setShowEditPanel(false);
    setSelectedMenuItem(null);
  };

  const handleSaveItem = async (item, imageFile) => {
    setIsSaving(true);
    try {
      if (activeTab === "food") {
        if (item && item.uuid) {
          await MenuService.updateDish(item.uuid, item, imageFile);
        } else {
          await MenuService.createDish(item, imageFile);
        }
      } else {
        if (item && item.uuid) {
          await MenuService.updateWine(item.uuid, item, imageFile);
        } else {
          await MenuService.createWine(item, imageFile);
        }
      }
      setShowEditPanel(false);
      setSelectedMenuItem(null);
      fetchData();
    } catch (error) {
      setSaveError(
        error?.response?.data?.message || "An error occurred while saving."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleBulkUpload = async () => {
    if (!selectedFile) {
      setUploadError("Please select a file");
      return;
    }
    if (!selectedRestaurant) {
      setUploadError("Please select a restaurant");
      return;
    }

    const allowedMimeTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    const allowedExtensions = [".xls", ".xlsx", ".csv"];
    const fileExtension =
      "." + selectedFile.name.split(".").pop().toLowerCase();

    if (
      !allowedMimeTypes.includes(selectedFile.type) &&
      !allowedExtensions.includes(fileExtension)
    ) {
      setUploadError("Please select an Excel file (.xls, .xlsx, .csv)");
      return;
    }

    setIsUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const bulkUploadType = activeTab === "food" ? "dish" : "wine";
      formData.append("restaurant_uuid", selectedRestaurant);
      await MenuService.bulkUploadMenu(formData, bulkUploadType);

      setShowBulkUploadModal(false);
      setSelectedFile(null);
      setExcelPreviewData(null);
      setExcelPreviewHeaders([]);
      setUploadError("");
      setDragActive(false);
      fetchData();
    } catch (error) {
      setUploadError("Error uploading file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      handleFile(file);
    }
  };

  const handleFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (json.length > 0) {
          const uploadedHeaders = json[0].map((h) => h?.toString().trim());

          const expectedHeaders =
            activeTab === "food" ? allowedHeaders : allowedWineHeaders;

          const unexpectedHeaders = uploadedHeaders.filter(
            (header) => !expectedHeaders.includes(header)
          );
          const missingHeaders = expectedHeaders.filter(
            (header) => !uploadedHeaders.includes(header)
          );

          if (unexpectedHeaders.length > 0 || missingHeaders.length > 0) {
            let errorMsg = "";
            if (unexpectedHeaders.length > 0) {
              errorMsg += `Unexpected column(s): ${unexpectedHeaders.join(", ")}. `;
            }
            if (missingHeaders.length > 0) {
              errorMsg += `Missing required column(s): ${missingHeaders.join(", ")}.`;
            }

            setUploadError(errorMsg.trim());
            setExcelPreviewData(null);
            setExcelPreviewHeaders([]);
            setIsFileValid(false);
            return;
          }

          setExcelPreviewHeaders(uploadedHeaders);
          setExcelPreviewData(json.slice(1));
          setUploadError("");
          setIsFileValid(true);
        } else {
          setUploadError("The Excel file is empty.");
          setExcelPreviewData(null);
          setExcelPreviewHeaders([]);
          setIsFileValid(false);
        }
      } catch (error) {
        setUploadError("Error reading or parsing the Excel file.");
        setExcelPreviewData(null);
        setExcelPreviewHeaders([]);
        setIsFileValid(false);
      }
    };

    reader.onerror = () => {
      setUploadError("Error reading the file.");
      setExcelPreviewData(null);
      setExcelPreviewHeaders([]);
      setIsFileValid(false);
    };

    reader.readAsArrayBuffer(file);
  };

  // Sort function for date filter
  const sortByDate = (a, b) => {
    if (selectedDateFilter === "Date Added") {
      return new Date(b.created_at) - new Date(a.created_at);
    } else if (selectedDateFilter === "Last Updated") {
      return new Date(b.updated_at) - new Date(a.updated_at);
    } else if (selectedDateFilter === "Price") {
      return (b.price || 0) - (a.price || 0);
    }
    return 0;
  };

  // Update the filteredItems to use the API data
  const filteredItems = (activeTab === "food" ? dishes : wines)
    .filter((item) => {
      // Filter by search query
      const matchesSearch =
        searchQuery === "" ||
        (activeTab === "food"
          ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.type
              ?.join(", ")
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchQuery.toLowerCase())
          : item.product_name
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            item.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.producer_name
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            item.region?.country
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()));

      // Filter by category
      const matchesCategory =
        selectedCategory === "All Categories" ||
        (activeTab === "food"
          ? item.type?.includes(selectedCategory)
          : item.category === selectedCategory);

      // Filter by location
      const matchesLocation =
        selectedLocation === "All Locations" ||
        (activeTab === "food"
          ? item.restaurant === selectedLocation
          : item.region?.major_region === selectedLocation);

      // Filter by country (wine only)
      const matchesCountry =
        activeTab === "food" ||
        selectedCountry === "All Countries" ||
        item.region?.country === selectedCountry;

      // Filter by region (wine only)
      const matchesRegion =
        activeTab === "food" ||
        selectedRegion === "All Regions" ||
        item.region?.appellation === selectedRegion;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesLocation &&
        matchesCountry &&
        matchesRegion
      );
    })
    .sort(sortByDate);

  // Format region data for display
  const formatRegion = (region) => {
    if (!region) return "";
    const parts = [region.country, region.appellation, region.state].filter(
      Boolean
    );
    return parts.join(", ");
  };

  // Format style data for display
  const formatStyle = (style) => {
    if (!style) return "";
    const parts = [
      style.body,
      style.sweetness,
      style.acidity,
      style.tannin,
    ].filter(Boolean);
    return parts.join(", ");
  };

  // Format dish details for display
  const formatDishDetails = (dish) => {
    // Flatten dietary_restrictions if it's an object
    let dietaryDisplay = "";
    if (dish.dietary_restrictions) {
      if (Array.isArray(dish.dietary_restrictions)) {
        dietaryDisplay = dish.dietary_restrictions.join(", ");
      } else if (typeof dish.dietary_restrictions === "object") {
        dietaryDisplay = [
          ...(dish.dietary_restrictions.health || []),
          ...(dish.dietary_restrictions.belief || []),
          ...(dish.dietary_restrictions.lifestyle || []),
        ].join(", ");
      }
    }

    let restaurantUUID = null;
    if (dish.restaurant_uuid && typeof dish.restaurant_uuid === "object") {
      restaurantUUID = dish.restaurant_uuid.uuid;
    } else {
      restaurantUUID = dish.restaurant_uuid;
    }

    return {
      ...dish,
      restaurant_uuid: restaurantUUID,
      typeDisplay: dish.type?.join(", ") || "",
      // dietaryDisplay,
      temperatureDisplay: dish.temperature || "",
      updatedAt: dish?.updatedAt,
      categoryDisplay: dish.category?.join(", ") || "",
      restaurantNameDisplay: dish.restaurantname || "",
    };
  };

  // Format wine details for display
  const formatWineDetails = (wine) => {
    let restaurantUUID = null;
    if (wine.restaurant_uuid && typeof wine.restaurant_uuid === "object") {
      restaurantUUID = wine.restaurant_uuid.uuid;
    } else {
      restaurantUUID = wine.restaurant_uuid;
    }
    return {
      ...wine,
      restaurant_uuid: restaurantUUID,
      restaurantname: wine.restaurantname || "",
      styleDisplay: formatStyle(wine.style),
      producerDisplay: wine.producer_name || "",
      vintageDisplay: wine.vintage || "",
      updatedAt: wine.updatedAt || "2025-04-11T16:51:03.849Z",
    };
  };

  // Format items based on type
  const formattedItems = filteredItems.map((item) =>
    activeTab === "food" ? formatDishDetails(item) : formatWineDetails(item)
  );

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  const userRole = localStorage.getItem("userRole");

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 overflow-auto">
        <main className="p-3">
          <div className="bg-white border-b border-gray-200 p-4 rounded-lg">
            <div className="px-6 py-4 flex flex-wrap items-center gap-4">
              {/* Tab Navigation */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => handleTabChange("food")}
                  className={`px-4 py-2 rounded-md ${
                    activeTab === "food"
                      ? "bg-primary text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  Food
                </button>
                <button
                  onClick={() => handleTabChange("wine")}
                  className={`px-4 py-2 rounded-md ${
                    activeTab === "wine"
                      ? "bg-primary text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  Wine
                </button>
              </div>

              {/* Menu Selector */}
              {/* <div className="relative">
                <Dropdown
                  label="Menu"
                  options={menuOptions}
                  selectedOption={currentMenu}
                  onSelect={(option) => setCurrentMenu(option.value)}
                />
              </div> */}
            </div>

            <div className="flex flex-wrap justify-between mt-5 gap-4">
              {/* Search */}
              <div className="relative   sm:w-auto">
                <input
                  type="text"
                  placeholder={
                    activeTab === "food"
                      ? "Search by name..."
                      : "Search wines..."
                  }
                  className=" sm:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
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

              {/* Filters */}
              <div className="relative sm:w-auto">
                <Dropdown
                  label="Category"
                  options={
                    activeTab === "food"
                      ? foodCategoriesOptions
                      : wineCategoriesOptions
                  }
                  selectedOption={selectedCategory}
                  onSelect={(option) => setSelectedCategory(option.value)}
                  className="w-[319px]"
                />
              </div>

              {/* <div className="relative  sm:w-auto">
                <Dropdown
                  label="Location"
                  options={locationOptions}
                  selectedOption={selectedLocation}
                  onSelect={(option) => setSelectedLocation(option.value)}
                         className="w-[319px]"
                />
              </div> */}

              {/* <div className="relative w-full sm:w-auto">
                <Dropdown
                  label="Date Filter"
                  options={dateFilterOptions}
                  selectedOption={selectedDateFilter}
                  onSelect={(option) => setSelectedDateFilter(option.value)}
                         className="w-[319px]"
                />
              </div> */}

              {/* {activeTab === "wine" && (
                <div className="relative w-full sm:w-auto">
                  <Dropdown
                    label="Country"
                    options={countryOptions}
                    selectedOption={selectedCountry}
                    onSelect={(option) => setSelectedCountry(option.value)}
                    className="w-[319px]"
                  />
                </div>
              )}

              {activeTab === "wine" && (
                <div className="relative w-full sm:w-auto">
                  <Dropdown
                    label="Region"
                    options={regionOptions}
                    selectedOption={selectedRegion}
                    onSelect={(option) => setSelectedRegion(option.value)}
                    className="w-[319px]"
                  />
                </div>
              )} */}
            </div>

            {/* Add Food Button and Bulk Upload */}
            {userRole !== "employee" && (
              <div className="ml-auto text-right mt-5 flex gap-2 justify-end">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => {
                      setShowBulkUploadModal(true);
                      setSelectedFile(null);
                      setExcelPreviewData(null);
                      setExcelPreviewHeaders([]);
                      setUploadError("");
                      setDragActive(false);
                    }}
                    className="bg-primary hover:bg-gray-400 flex items-center gap-2"
                  >
                    <Upload size={20} />
                    Bulk Upload {activeTab === "food" ? "Dishes" : "Wines"}
                  </Button>
                  <Button
                    onClick={handleAddItem}
                    className="bg-primary hover:bg-gray-400"
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
                    {activeTab === "food" ? "Add Food" : "Add Wine"}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Menu Items Table */}
          <div className="overflow-x-auto">
            {formattedItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {activeTab === "food" ? "No dishes found" : "No wines found"}
              </div>
            ) : (
              <MenuItemsTable
                items={formattedItems}
                onEditItem={handleEditItem}
                activeTab={activeTab}
                loading={loading}
                error={error}
              />
            )}
          </div>
        </main>
      </div>

      {/* Edit Panel */}
      {showEditPanel &&
        (activeTab === "food" ? (
          <MenuItemEditPanel
            item={selectedMenuItem}
            onClose={handleCloseEditPanel}
            onSave={handleSaveItem}
            isSaving={isSaving}
            validDishTypes={validDishTypes}
          />
        ) : (
          <WineItemEditPanel
            item={selectedMenuItem}
            onClose={handleCloseEditPanel}
            onSave={handleSaveItem}
            isSaving={isSaving}
            validWineTypes={validWineTypes}
          />
        ))}

      {/* Analytics Modal */}
      <MenuAnalyticsModal
        isOpen={showAnalyticsModal}
        onClose={() => setShowAnalyticsModal(false)}
      />

      {/* Bulk Upload Modal */}
      {showBulkUploadModal && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black opacity-30"
            onClick={() => {
              setShowBulkUploadModal(false);
              setExcelPreviewData(null);
              setExcelPreviewHeaders([]);
              setSelectedFile(null);
              setUploadError("");
              setSelectedRestaurant("");
            }}
          ></div>
          <div className="fixed inset-y-0 right-0 w-full md:w-1/2 lg:w-[50%] bg-white border-l border-gray-200 shadow-lg z-50 overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-textcolor">
                Bulk Upload {activeTab === "food" ? "Dishes" : "Wines"}
              </h2>
              <button
                onClick={() => {
                  setShowBulkUploadModal(false);
                  setExcelPreviewData(null);
                  setExcelPreviewHeaders([]);
                  setSelectedFile(null);
                  setUploadError("");
                  setSelectedRestaurant("");
                }}
                className="text-gray-500 hover:text-gray-700"
              >
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
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Restaurant
                  </label>
                  <select
                    value={selectedRestaurant}
                    onChange={(e) => setSelectedRestaurant(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md mb-4"
                    required
                  >
                    <option value="">Select Restaurant</option>
                    {restaurants.map((r) => (
                      <option key={r.uuid || r.id} value={r.uuid || r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Upload Excel File
                  </h3>
                  <p className="text-sm text-gray-500">
                    Upload an Excel file containing your{" "}
                    {activeTab === "food" ? "dishes" : "wines"}. Make sure to
                    follow the correct format.
                  </p>
                </div>

                <div
                  className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md ${
                    dragActive ? "bg-gray-100" : ""
                  }`}
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
                        <span>
                          {selectedFile ? selectedFile.name : "Upload a file"}
                        </span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          accept=".xlsx, .xls"
                          className="sr-only"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">(XLSX, XLS & CSV) up to 10MB</p>
                  </div>
                </div>
              </div>
              {excelPreviewData && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">
                    Excel Data Preview
                  </h3>
                  <div className="overflow-x-auto max-h-96">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {excelPreviewHeaders.map((header, index) => (
                            <th
                              key={index}
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {excelPreviewData.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                              <td
                                key={cellIndex}
                                className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {uploadError && (
                <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
                  {uploadError}
                </div>
              )}

              <div className="flex justify-between items-center space-x-2 pt-4 border-t border-gray-200">
                <a
                  href={activeTab === "food" ? "./food.xlsx" : "./wine.xlsx"}
                  download
                  className="inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-textcolor text-white hover:bg-gray-400 px-4 py-2 text-base"
                  style={{ textDecoration: "none" }}
                >
                  Download Template
                </a>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                    onClick={() => {
                      setShowBulkUploadModal(false);
                      setExcelPreviewData(null);
                      setExcelPreviewHeaders([]);
                      setSelectedFile(null);
                      setSelectedRestaurant("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleBulkUpload}
                    disabled={
                      !selectedFile ||
                      isUploading ||
                      !selectedRestaurant ||
                      !isFileValid
                    }
                  >
                    {isUploading
                      ? "Uploading..."
                      : `Upload ${activeTab === "food" ? "Dishes" : "Wines"}`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {saveError && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Error</h2>
            <p className="mb-6">{saveError}</p>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => setSaveError("")}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
