import { useEffect, useState } from "react"
import { X, Wine, Utensils, Plus, DollarSign, Trash2 } from "lucide-react"
import { MenuService } from "../../services/MenuService"

export default function MenuAnalyticsModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("wine")
  const [dishAnalytics, setDishAnalytics] = useState([]);

  useEffect(() => {
    const getDishAnalytics = async () => {
      try {
        const res = await MenuService.getDishAnalytics();
        
        setDishAnalytics(res);
      } catch (error) {
        console.log(error, "error");
      }
    }
    getDishAnalytics();
  }, [])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Menu Analytics</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          {/* Tabs */}
          <div className="flex space-x-2 mb-4">
            <button
              className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center ${activeTab === "food" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              onClick={() => setActiveTab("food")}
            >
              <Utensils className="h-4 w-4 mr-2" />
              Food Menu
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center ${activeTab === "wine" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              onClick={() => setActiveTab("wine")}
            >
              <Wine className="h-4 w-4 mr-2" />
              Wine List
            </button>
          </div>

          {/* Wine List Analytics */}
          {activeTab === "wine" && (
            <div className="space-y-6">
              {/* Key Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-600 mb-1">Total Wines</p>
                  <p className="text-2xl font-bold">86</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-600 mb-1">New Wines (30 Days)</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-600 mb-1">Removed (30 Days)</p>
                  <p className="text-2xl font-bold">4</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-600 mb-1">Last Updated</p>
                  <p className="text-sm font-medium">2019 Bordeaux Grand Cru</p>
                </div>
              </div>

              {/* Wine Category Distribution */}
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Wine Category Distribution</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Red Wine</span>
                      <span className="text-sm font-medium">(45%)</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-gray-900 rounded-full" style={{ width: "45%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">White Wine</span>
                      <span className="text-sm font-medium">(30%)</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-gray-700 rounded-full" style={{ width: "30%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Sparkling</span>
                      <span className="text-sm font-medium">(15%)</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-gray-500 rounded-full" style={{ width: "15%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Rosé</span>
                      <span className="text-sm font-medium">(10%)</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-gray-400 rounded-full" style={{ width: "10%" }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Regional Distribution */}
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Regional Distribution</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">France</span>
                      <span className="text-sm font-medium">(35%)</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-gray-900 rounded-full" style={{ width: "35%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Italy</span>
                      <span className="text-sm font-medium">(25%)</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-gray-700 rounded-full" style={{ width: "25%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">USA</span>
                      <span className="text-sm font-medium">(20%)</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-gray-500 rounded-full" style={{ width: "20%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Others</span>
                      <span className="text-sm font-medium">(20%)</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-gray-400 rounded-full" style={{ width: "20%" }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Most Common Grape Varietals */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Most Common Grape Varietals</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">Cabernet Sauvignon</p>
                    <p className="text-sm text-gray-600">12 wines</p>
                  </div>
                  <div>
                    <p className="font-medium">Chardonnay</p>
                    <p className="text-sm text-gray-600">10 wines</p>
                  </div>
                  <div>
                    <p className="font-medium">Pinot Noir</p>
                    <p className="text-sm text-gray-600">8 wines</p>
                  </div>
                  <div>
                    <p className="font-medium">Sauvignon Blanc</p>
                    <p className="text-sm text-gray-600">7 wines</p>
                  </div>
                </div>
              </div>

              {/* Wine Characteristics */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Wine Characteristics</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-3 rounded-md text-center">
                    <p className="text-sm text-gray-600 mb-1">Organic</p>
                    <p className="text-xl font-bold">24</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md text-center">
                    <p className="text-sm text-gray-600 mb-1">Biodynamic</p>
                    <p className="text-xl font-bold">16</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md text-center">
                    <p className="text-sm text-gray-600 mb-1">Vegan</p>
                    <p className="text-xl font-bold">32</p>
                  </div>
                </div>
              </div>

              {/* Recent Wine Updates */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-medium text-gray-700">Recent Wine Updates</h3>
                  <button className="text-sm text-primary hover:underline">View All</button>
                </div>

                <div className="space-y-3">
                  <div className="border border-gray-200 rounded-md p-3">
                    <div className="flex items-start">
                      <div className="bg-gray-900 text-white p-1 rounded-full mr-3">
                        <Plus className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New Wine Added</p>
                        <p className="text-sm">2019 Bordeaux Grand Cru</p>
                        <div className="flex items-center mt-1">
                          <div className="h-5 w-5 rounded-full bg-gray-200 mr-1.5 flex-shrink-0"></div>
                          <span className="text-xs text-gray-500 mr-2">Sophie Martin</span>
                          <span className="text-xs text-gray-500">1h ago</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-md p-3">
                    <div className="flex items-start">
                      <div className="bg-amber-100 text-amber-800 p-1 rounded-full mr-3">
                        <DollarSign className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Price Update</p>
                        <p className="text-sm">Chianti Classico - $45 to $52</p>
                        <div className="flex items-center mt-1">
                          <div className="h-5 w-5 rounded-full bg-gray-200 mr-1.5 flex-shrink-0"></div>
                          <span className="text-xs text-gray-500 mr-2">Robert Chen</span>
                          <span className="text-xs text-gray-500">3h ago</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-md p-3">
                    <div className="flex items-start">
                      <div className="bg-red-100 text-red-800 p-1 rounded-full mr-3">
                        <Trash2 className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Wine Removed</p>
                        <p className="text-sm">2018 Napa Valley Merlot</p>
                        <div className="flex items-center mt-1">
                          <div className="h-5 w-5 rounded-full bg-gray-200 mr-1.5 flex-shrink-0"></div>
                          <span className="text-xs text-gray-500 mr-2">David Wilson</span>
                          <span className="text-xs text-gray-500">1d ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Food Menu Analytics (placeholder) */}
          {activeTab === "food" && (
            <div className="space-y-6">
              {/* Key Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-600 mb-1">Total Dishes</p>
                  <p className="text-2xl font-bold">{dishAnalytics?.totalDishes}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-600 mb-1">New Dishes (30 Days)</p>
                  <p className="text-2xl font-bold">{dishAnalytics?.newDishesInThirtyDays}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-600 mb-1">Removed (30 Days)</p>
                  <p className="text-2xl font-bold">{dishAnalytics?.removedDishesInThirtyDays}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-600 mb-1">Last Updated</p>
                  <p className="text-sm font-medium">{dishAnalytics?.lastUpdatedDish}</p>
                </div>
              </div>

              {/* Menu Category Distribution */}
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Menu Category Distribution</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Main Course</span>
                      <span className="text-sm font-medium">({dishAnalytics?.mainCourseDishPercentage}%)</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-gray-900 rounded-full" style={{ width: `${dishAnalytics?.mainCourseDishPercentage}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Appetizers</span>
                      <span className="text-sm font-medium">({dishAnalytics?.appetizerDishPercentage}%)</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-gray-700 rounded-full" style={{ width: `${dishAnalytics?.appetizerDishPercentage}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Desserts</span>
                      <span className="text-sm font-medium">({dishAnalytics?.dessertDishPercentage}%)</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-gray-500 rounded-full" style={{ width: `${dishAnalytics?.dessertDishPercentage}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Specials</span>
                      <span className="text-sm font-medium">({dishAnalytics?.specialDishPercentage}%)</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-gray-400 rounded-full" style={{ width: `${dishAnalytics?.specialDishPercentage}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dietary & Allergen Analysis */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Dietary & Allergen Analysis</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">Vegetarian</p>
                    <p className="text-sm text-gray-600">{dishAnalytics?.vegetarianDishes} dishes</p>
                  </div>
                  <div>
                    <p className="font-medium">Vegan</p>
                    <p className="text-sm text-gray-600">{dishAnalytics?.veganDishes} dishes</p>
                  </div>
                  <div>
                    <p className="font-medium">Glutten-Free</p>
                    <p className="text-sm text-gray-600">{dishAnalytics?.gluttenFreeDishes} dishes</p>
                  </div>
                  <div>
                    <p className="font-medium">Nut-Free</p>
                    <p className="text-sm text-gray-600">{dishAnalytics?.nuttFreeDishes} dishes</p>
                  </div>
                  <div>
                    <p className="font-medium">Most Common Allergen</p>
                    <p className="text-sm text-gray-600">Gluten ({dishAnalytics?.glutenCommonAllergenDishes})</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
