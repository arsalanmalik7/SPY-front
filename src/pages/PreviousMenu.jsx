import { useState, useEffect } from "react"
import MenuItemsTable from "../components/common/menu-items-table"
import Dropdown from "../components/common/dropdown"
import { MenuService } from "../services/MenuService"


export default function MenuManagement() {
  const [activeTab, setActiveTab] = useState("food")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedLocation, setSelectedLocation] = useState("All Locations")
  const [selectedDateFilter, setSelectedDateFilter] = useState("Date Added")
  const [dishes, setDishes] = useState([])
  const [wines, setWines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCountry, setSelectedCountry] = useState("All Countries")
  const [selectedRegion, setSelectedRegion] = useState("All Regions")
  const [foodCategoriesOptions, setFoodCategoriesOptions] = useState([]);
  const [wineCategoriesOptions, setWineCategoriesOptions] = useState([]);

  const foodCategoryOptions = [
    { value: "All Categories", label: "All Categories" },
    { value: "Entrée", label: "Entrée" },
    { value: "Pizza", label: "Pizza" },
    { value: "Dessert", label: "Dessert" },
    { value: "Red", label: "Red" },
    { value: "White", label: "White" },
  ]

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [dishesData, winesData] = await Promise.all([
        MenuService.getAllDeletedDishes(),
        MenuService.getAllDeletedWines()
      ])
      setDishes(dishesData?.dishesWithRestaurant);
      setFoodCategoriesOptions(dishesData?.validDishTypes?.map((type) => ({
        value: type,
        label: type,
      })));
      setFoodCategoriesOptions((prev) => [
        ...prev,
        { value: "All Categories", label: "All Categories" },
      ]);

      setWines(winesData?.winesWithRestaurant);
      setWineCategoriesOptions(winesData?.wineCategories?.map((type) => ({
        value: type,
        label: type,
      })));
      setWineCategoriesOptions((prev) => [
        ...prev,
        { value: "All Categories", label: "All Categories" },
      ]);
      setError(null)
    } catch (err) {
      setError('Failed to fetch menu data')
      console.error('Error fetching menu data:', err)
    } finally {
      setLoading(false)
    }
  }



  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const handleTabChange = (tab) => {
    setSelectedCategory("All Categories");
    setActiveTab(tab)
  }



  // Sort function for date filter
  const sortByDate = (a, b) => {
    if (selectedDateFilter === "Date Added") {
      return new Date(b.created_at) - new Date(a.created_at)
    } else if (selectedDateFilter === "Last Updated") {
      return new Date(b.updated_at) - new Date(a.updated_at)
    } else if (selectedDateFilter === "Price") {
      return (b.price || 0) - (a.price || 0)
    }
    return 0
  }

  // Update the filteredItems to use the API data
  const filteredItems = (activeTab === "food" ? dishes : wines).filter((item) => {
    // Filter by search query
    const matchesSearch = searchQuery === "" || (
      activeTab === "food"
        ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type?.join(', ').toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
        : item.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.producer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.region?.country?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Filter by category
    const matchesCategory = selectedCategory === "All Categories" ||
      (activeTab === "food"
        ? item.type?.includes(selectedCategory)
        : item.category === selectedCategory)

    // Filter by location
    const matchesLocation = selectedLocation === "All Locations" ||
      (activeTab === "food"
        ? item.restaurant === selectedLocation
        : item.region?.major_region === selectedLocation)

    // Filter by country (wine only)
    const matchesCountry = activeTab === "food" || selectedCountry === "All Countries" ||
      item.region?.country === selectedCountry

    // Filter by region (wine only)
    const matchesRegion = activeTab === "food" || selectedRegion === "All Regions" ||
      item.region?.appellation === selectedRegion

    return matchesSearch && matchesCategory && matchesLocation && matchesCountry && matchesRegion
  }).sort(sortByDate)

  // Format region data for display
  const formatRegion = (region) => {
    if (!region) return '';
    const parts = [
      region.country,
      region.appellation,
      region.state,
    ].filter(Boolean);
    return parts.join(', ');
  };

  // Format style data for display
  const formatStyle = (style) => {
    if (!style) return '';
    const parts = [
      style.body,
      style.sweetness,
      style.acidity,
      style.tannin,
    ].filter(Boolean);
    return parts.join(', ');
  };

  // Format dish details for display
  const formatDishDetails = (dish) => {
    // Flatten dietary_restrictions if it's an object
    let dietaryDisplay = '';
    if (dish.dietary_restrictions) {
      if (Array.isArray(dish.dietary_restrictions)) {
        dietaryDisplay = dish.dietary_restrictions.join(', ');
      } else if (typeof dish.dietary_restrictions === 'object') {
        dietaryDisplay = [
          ...(dish.dietary_restrictions.health || []),
          ...(dish.dietary_restrictions.belief || []),
          ...(dish.dietary_restrictions.lifestyle || [])
        ].join(', ');
      }
    }

    let restaurantUUID = null;
    if (dish.restaurant_uuid && typeof dish.restaurant_uuid === 'object') {
      restaurantUUID = dish.restaurant_uuid.uuid;
    } else {
      restaurantUUID = dish.restaurant_uuid;
    }

    return {
      ...dish,
      restaurant_uuid: restaurantUUID,
      typeDisplay: dish.type?.join(', ') || '',
      dietaryDisplay,
      temperatureDisplay: dish.temperature || '',
      updatedAt: dish?.updatedAt,
      categoryDisplay: dish.category?.join(', ') || '',
      restaurantNameDisplay: dish.restaurantname || ''
    };
  };

  // Format wine details for display
  const formatWineDetails = (wine) => {
    let restaurantUUID = null;
    if (wine.restaurant_uuid && typeof wine.restaurant_uuid === 'object') {
      restaurantUUID = wine.restaurant_uuid.uuid;
    } else {
      restaurantUUID = wine.restaurant_uuid;
    }
    return {
      ...wine,
      restaurant_uuid: restaurantUUID,
      restaurantname: wine.restaurantname || '',
      styleDisplay: formatStyle(wine.style),
      producerDisplay: wine.producer_name || '',
      vintageDisplay: wine.vintage || '',
      updatedAt: wine.updatedAt || "2025-04-11T16:51:03.849Z"
    };
  };

  // Format items based on type
  const formattedItems = filteredItems.map(item =>
    activeTab === "food" ? formatDishDetails(item) : formatWineDetails(item)
  );

  if (loading) {
    return <div className="text-center py-4">Loading...</div>
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>
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
                  className={`px-4 py-2 rounded-md ${activeTab === "food" ? "bg-primary text-white" : "bg-white text-gray-700"
                    }`}
                >
                  Food
                </button>
                <button
                  onClick={() => handleTabChange("wine")}
                  className={`px-4 py-2 rounded-md ${activeTab === "wine" ? "bg-primary text-white" : "bg-white text-gray-700"
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
                  placeholder={activeTab === "food" ? "Search by name..." : "Search wines..."}
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
                  options={activeTab === "food" ? foodCategoriesOptions : wineCategoriesOptions}
                  selectedOption={selectedCategory}
                  onSelect={(option) => setSelectedCategory(option.value)}
                  className="w-[319px]"
                />
              </div>


            </div>
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
                onEditItem={"handleEditItem"}
                activeTab={activeTab}
                previousTable={true}
                loading={loading}
                error={error}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

