import React, { useState } from 'react';
import { X, Search, MapPin, Building2 } from 'lucide-react';
import Button from './button';

const RestaurantSelectModal = ({ isOpen, onClose, restaurants, selectedRestaurant, onSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Header */}
          <div className="px-6 pt-6 pb-4 bg-white border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Select Restaurant
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Choose a restaurant to view its lessons
                </p>
              </div>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500 focus:outline-none p-2 rounded-full hover:bg-gray-100 transition-colors"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Search input */}
          <div className="px-6 py-4 bg-white">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-colors"
                placeholder="Search restaurants by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Restaurant list */}
          <div className="px-6 pb-6 max-h-[60vh] overflow-y-auto">
            {filteredRestaurants.length === 0 ? (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No restaurants found</p>
                <p className="text-sm text-gray-400 mt-1">Try adjusting your search</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredRestaurants.map((restaurant) => (
                  <button
                    key={restaurant.uuid}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                      selectedRestaurant === restaurant.uuid
                        ? 'bg-primary/10 border-2 border-primary'
                        : 'border-2 border-transparent hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      onSelect(restaurant.uuid);
                      onClose();
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        selectedRestaurant === restaurant.uuid
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium ${
                          selectedRestaurant === restaurant.uuid
                            ? 'text-primary'
                            : 'text-gray-900'
                        }`}>
                          {restaurant.name}
                        </div>
                        {restaurant.address && (
                          <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                            <MapPin className="h-4 w-4" />
                            <span className="truncate">
                              {restaurant.address.street}, {restaurant.address.city}
                            </span>
                          </div>
                        )}
                      </div>
                      {selectedRestaurant === restaurant.uuid && (
                        <div className="flex-shrink-0">
                          <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <Button
              variant="danger"
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantSelectModal; 