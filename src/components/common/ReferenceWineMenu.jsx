import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import Card from './card';
import Badge from './badge';

const ReferenceMenuPanel = ({
  isOpen,
  onClose,
  menuData
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState("None");


  // Transform wine data
  const wineData = Array.isArray(menuData)
    ? menuData.map(wine => {
      return {
        name: wine?.product_name,
        producer: wine?.producer_name,
        year: wine?.vintage.toString(),
        varietals: wine?.varietals.join(', '),
        region: `${wine?.region.country} → ${wine?.region?.region || 'N/A'} → ${wine?.region?.commune_appellation || 'N/A'}`,
        category: wine?.category,
        style: wine?.sub_category,
        body: wine?.style?.body || 'N/A',
        image_url: wine?.image_url || 'N/A',
        texture: wine?.style?.texture || 'N/A',
        flavorIntensity: wine?.style?.flavor_intensity || 'N/A',
        price: { glass: wine?.offering?.glass_price, bottle: wine?.offering?.bottle_price }, // Add price if available in your data
        tags: [
          ...(wine?.is_organic ? ['Organic'] : []),
          ...(wine?.is_biodynamic ? ['Biodynamic'] : []),
          ...(wine?.is_vegan ? ['Vegan'] : []),
          ...(wine?.is_filtered ? ['Filtered'] : []),
          ...(wine?.has_residual_sugar ? ['Residual Sugar'] : [])
        ],
      };
    })
    : [];
  const wineCategories = ["white", "red", "rose", "orange", "sparkling", "dessert"];





  const handleOptionChange = async (e) => {
    const { value } = e.target;
    setFilterType(value);
  }

  // Update your filteredWineData to include the filter logic
  const filteredWineData = wineData.filter(wine => {
    // First apply search filter
    const matchesSearch = wine?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wine?.producer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wine?.varietals?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wine?.region?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wine?.style?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wine?.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    // Then apply price filter
    let matchesFilter = true;
    if (filterType === "by_the_glass") {
      matchesFilter = wine?.price?.glass && wine.price.glass > 0;
    } else if (filterType === "by_the_bottle") {
      matchesFilter = wine?.price?.bottle && wine.price.bottle > 0;
    }
    // If filterType is "None", matchesFilter remains true

    return matchesSearch && matchesFilter;
  })

  const winesByCategory = wineCategories.reduce((acc, category) => {
    acc[category] = filteredWineData.filter(
      wine => wine.category && wine.category.toLowerCase() === category
    );
    return acc;
  }, {});

  return (
    <div className={`fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-lg z-[102] transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h2 className="text-lg font-bold text-black">Reference Menu</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-red-500 p-1 rounded-full">
          <X size={22} />
        </button>
      </div>
      <div className="p-4 overflow-y-auto h-[calc(100%-64px)]">
        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search menu items..."
              className="w-full pl-10 pr-4 py-2 rounded-md bg-background border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#e11d48] text-black text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className='mb-4'>
          <label
            htmlFor="by_the_filter"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Filter Options
          </label>
          <div className="relative">
            <select
              id="by_the_filter"
              name="by_the_filter"
              className="w-full pl-4 pr-10 py-2 rounded-md bg-background border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#e11d48] text-black text-base appearance-none cursor-pointer"
              onChange={handleOptionChange}
            >
              <option value="None">None</option>
              <option value="by_the_glass">By The Glass</option>
              <option value="by_the_bottle">By The Bottle</option>
            </select>
            {/* Custom dropdown arrow */}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Render each wine category section dynamically */}
        {wineCategories.map(category => (
          winesByCategory[category].length > 0 && (
            <div className="mb-6" key={category}>
              <h3 className="text-md text-left font-semibold text-black mb-3">
                {category.charAt(0).toUpperCase() + category.slice(1)} Wines
              </h3>
              <div className="space-y-4">
                {winesByCategory[category].map(wine => (
                  <Card key={wine.name} className="p-4 bg-background border border-gray-300 rounded-lg">
                    <div className="text-base text-black text-left">
                      {wine.image_url && (
                        <img
                          src={
                            wine.image_url.startsWith("/")
                              ? process.env.REACT_APP_IMAGE_BASE_URL + `${wine.image_url}`
                              : wine.image_url
                          }
                          alt={wine.name}
                          className="w-full h-40 object-cover rounded-md"
                        />
                      )}
                      <div className="font-semibold text-base">{wine.name}</div>


                      <div className="text-gray-700 mt-0.5 text-sm">{wine.year}</div>
                      
                      <div className="mt-2"><span className="font-medium">Varietals:</span> {wine.varietals}</div>
                      <div><span className="font-medium">Producer:</span> {wine.producer}</div>
                      <div><span className="font-medium">Region:</span> {wine.region}</div>
                      <div><span className="font-medium">Category:</span> {wine.category}</div>
                      <div><span className="font-medium">Style:</span> {wine.style}</div>
                      <div><span className="font-medium">Body:</span> {wine.body}</div>
                      <div><span className="font-medium">Texture:</span> {wine.texture}</div>
                      <div><span className="font-medium">Flavor Intensity:</span> {wine.flavorIntensity}</div>
                      <div className="mt-2"><span className="font-medium">Price:</span></div>
                      <div className="ml-2 text-sm">
                        {wine?.price?.glass && <div><span className="font-medium">By Glass:</span> ${wine?.price?.glass?.toFixed(2)}</div>}
                        {wine?.price?.bottle && <div><span className="font-medium">By Bottle:</span>{wine?.price?.bottle && ` $${wine?.price?.bottle?.toFixed(2)}`}</div>}
                      </div>
                      {wine.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {wine.tags.map(tag => <Badge key={tag} className="bg-gray-200 text-black text-xs px-2 py-0.5 font-medium rounded">{tag}</Badge>)}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )
        ))}

        {filteredWineData.length === 0 && (
          <div className="text-center text-gray-600 mt-8">
            {searchTerm ? `No results found for "${searchTerm}"` : 'No wine items available'}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferenceMenuPanel; 