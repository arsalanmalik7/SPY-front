import React, { useState, useMemo } from 'react';
import WineDashboardStats from '../components/common/WineDashboardStats';
import Card from '../components/common/card';
import Dropdown from '../components/common/dropdown';
import Button from '../components/common/button';

const wineCategory = [
  { label: 'Red', value: 45 },
  { label: 'White', value: 30 },
  { label: 'Sparkling', value: 10 },
  { label: 'Rosé', value: 8 },
  { label: 'Orange', value: 3 },
];
const styleDistribution = [
  { label: 'Mild Red', value: 35 },
  { label: 'Powerful Red', value: 25 },
  { label: 'Fresh White', value: 20 },
  { label: 'Rich White', value: 10 },
];
const topVarietals = [
  { label: 'Cab. Sauv.', value: 40 },
  { label: 'Chardonnay', value: 35 },
  { label: 'Pinot Noir', value: 25 },
];
const regionalDistribution = [
  { label: 'France', value: 40 },
  { label: 'Italy', value: 35 },
  { label: 'USA', value: 25 },
];
const dietaryConsiderations = [
  { label: 'Organic', value: 12 },
  { label: 'Biodynamic', value: 8 },
  { label: 'Vegan', value: 15 },
];
const recentUpdates = [
  { text: 'Added Château Margaux 2015', type: 'update' },
  { text: 'Updated Dom Pérignon price', type: 'update' },
  { text: 'Removed Opus One 2019', type: 'removed' },
];

const wineList = [
  {
    name: 'Château Margaux – Grand Vin 2015',
    varietals: 'Cabernet Sauvignon, Merlot',
    region: 'Bordeaux, France',
    appellation: 'Margaux AOC',
    type: 'Red Wine',
    glassPrice: '$35',
    bottlePrice: '$180',
    tags: ['Organic', 'Biodynamic'],
    style: 'Bold',
    body: 'Full',
    texture: 'Smooth',
    intensity: 'High',
    image: '',
  },
  {
    name: 'Dom Pérignon Vintage',
    varietals: 'Chardonnay, Pinot Noir',
    region: 'Champagne, France',
    appellation: 'AOC Champagne',
    type: 'Sparkling Wine',
    glassPrice: '$65',
    bottlePrice: '$340',
    tags: ['Organic'],
    style: 'Crisp',
    body: 'Medium',
    texture: 'Creamy',
    intensity: 'Medium',
    image: '',
  },
];

const categoryOptions = [
  { label: 'All Categories', value: '' },
  { label: 'Red', value: 'red' },
  { label: 'White', value: 'white' },
  { label: 'Sparkling', value: 'sparkling' },
  { label: 'Rosé', value: 'rose' },
  { label: 'Orange', value: 'orange' },
];
const regionOptions = [
  { label: 'All Regions', value: '' },
  { label: 'France', value: 'france' },
  { label: 'Italy', value: 'italy' },
  { label: 'USA', value: 'usa' },
];

const WineList = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(categoryOptions[0]);
  const [region, setRegion] = useState(regionOptions[0]);

  // Filtering logic
  const filteredWines = useMemo(() => {
    return wineList.filter(wine => {
      // Search filter (case-insensitive, matches name, varietals, region, type)
      const searchText = search.toLowerCase();
      const matchesSearch =
        wine.name.toLowerCase().includes(searchText) ||
        wine.varietals.toLowerCase().includes(searchText) ||
        wine.region.toLowerCase().includes(searchText) ||
        wine.type.toLowerCase().includes(searchText);

      // Category filter
      const matchesCategory =
        !category.value ||
        wine.type.toLowerCase().includes(category.label.toLowerCase());

      // Region filter
      const matchesRegion =
        !region.value ||
        wine.region.toLowerCase().includes(region.label.toLowerCase());

      return matchesSearch && matchesCategory && matchesRegion;
    });
  }, [search, category, region]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Top 6 Cards */}
      <WineDashboardStats
        wineCategory={wineCategory}
        styleDistribution={styleDistribution}
        topVarietals={topVarietals}
        regionalDistribution={regionalDistribution}
        dietaryConsiderations={dietaryConsiderations}
        recentUpdates={recentUpdates}
      />

      {/* Search Bar */}
      <div className="flex flex-col md:flex-row border border-gray-200 rounded-md p-2 bg-white items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Search wines..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <Dropdown
          label="All Categories"
          options={categoryOptions}
          selectedOption={category.label}
          onSelect={setCategory}
          className="w-48"
          menuClassName="bg-background"
        />
        <Dropdown
          label="All Regions"
          options={regionOptions}
          selectedOption={region.label}
          onSelect={setRegion}
          className="w-48 "
          menuClassName="bg-background"
        />
        <Button
          variant="secondary"
          className="border border-red-400 text-red-600 px-4 py-2 rounded-md font-semibold text-sm bg-white hover:bg-red-50"
          onClick={() => {
            setSearch('');
            setCategory(categoryOptions[0]);
            setRegion(regionOptions[0]);
          }}
        >
          Clear Filters
        </Button>
      </div>

      {/* Wine Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredWines.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 py-12 text-lg">No wines found.</div>
        ) : (
          filteredWines.map((wine) => (
            <Card key={wine.name} className="flex flex-col md:flex-row p-0 overflow-hidden border border-gray-200 bg-white rounded-lg">
              <div className="flex flex-col md:flex-row justify-between gap-4 p-4 w-full">
                {/* Image Placeholder */}
                <div className="w-full md:w-28 md:min-w-[112px] md:max-w-[112px] h-[120px] flex items-center justify-center bg-gray-100 md:border-r border-b md:border-b-0 border-gray-200">
                  <span className="text-xs text-gray-400 text-center leading-tight">
                    Wine Image<br />{wine.name.split(' ')[0]}
                  </span>
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-1">
                    <div className="font-semibold text-[15px] text-textcolor leading-tight text-left">{wine.name}</div>
                    <div className="text-xs text-gray-500 text-right min-w-[70px]">
                      Glass: <span className="font-bold">{wine.glassPrice}</span><br />
                      Bottle: <span className="font-bold">{wine.bottlePrice}</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 mb-1 text-left">{wine.varietals}</div>
                  <div className="text-xs text-gray-600 mb-1 text-left">{wine.region}, {wine.appellation}</div>
                  <div className="text-xs text-gray-600 mb-2 text-left">{wine.type}</div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {wine.tags.map(tag => (
                      <span key={tag} className="bg-yellow-100 text-gray-800 rounded-full px-2 py-0.5 text-xs font-medium border border-yellow-200">{tag}</span>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    <div className="flex flex-col items-center bg-[#FFF8F3] rounded-md px-2 py-1">
                      <span className="text-[11px] text-gray-500">Style</span>
                      <span className="text-xs font-bold text-textcolor">{wine.style}</span>
                    </div>
                    <div className="flex flex-col items-center bg-[#FFF8F3] rounded-md px-2 py-1">
                      <span className="text-[11px] text-gray-500">Body</span>
                      <span className="text-xs font-bold text-textcolor">{wine.body}</span>
                    </div>
                    <div className="flex flex-col items-center bg-[#FFF8F3] rounded-md px-2 py-1">
                      <span className="text-[11px] text-gray-500">Texture</span>
                      <span className="text-xs font-bold text-textcolor">{wine.texture}</span>
                    </div>
                    <div className="flex flex-col items-center bg-[#FFF8F3] rounded-md px-2 py-1">
                      <span className="text-[11px] text-gray-500">Intensity</span>
                      <span className="text-xs font-bold text-textcolor">{wine.intensity}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default WineList;