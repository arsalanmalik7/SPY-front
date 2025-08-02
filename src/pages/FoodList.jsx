import React, { useState, useMemo } from 'react';
import Button from '../components/common/button';
import Dropdown from '../components/common/dropdown';
import Card from '../components/common/card';
import FoodListCards from '../components/common/FoodListCards';
import Badge from '../components/common/badge';

const courseOptions = [
  { label: 'All Courses', value: '' },
  { label: 'Appetizers', value: 'appetizer' },
  { label: 'Main Course', value: 'main course' },
  { label: 'Desserts', value: 'dessert' },
];
const allergenOptions = [
  { label: 'All Allergens', value: '' },
  { label: 'Gluten', value: 'gluten' },
  { label: 'Dairy', value: 'dairy' },
  { label: 'Nuts', value: 'nuts' },
  { label: 'Fish', value: 'fish' },
];
const dietaryOptions = [
  { label: 'All Dietary Restrictions', value: '' },
  { label: 'Vegetarian', value: 'vegetarian' },
  { label: 'Vegan', value: 'vegan' },
  { label: 'Gluten-Free', value: 'gluten-free' },
  { label: 'Dairy-Free', value: 'dairy-free' },
];

const foodList = [
  {
    title: 'Bruschetta',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=facearea&w=256&q=80',
    description: 'Fresh tomatoes and basil on toasted bread, drizzled with extra virgin olive oil and balsamic glaze.',
    ingredients: 'Bread, Tomatoes, Basil, Olive Oil, Garlic, Balsamic Glaze',
    course: 'Appetizers',
    allergens: ['Gluten'],
    dietary: ['Vegetarian'],
    tags: ['Vegetarian', 'Contains Gluten'],
    substitutions: 'Gluten-free bread option (+$2)',
    note: 'Served at room temperature. Can be made without garlic upon request.',
  },
  {
    title: 'Grilled Salmon',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=facearea&w=256&q=80',
    description: 'Fresh Atlantic salmon grilled to perfection, served with lemon butter sauce and seasonal vegetables.',
    ingredients: 'Salmon, Butter, Lemon, Herbs, Seasonal Vegetables',
    course: 'Main Course',
    allergens: ['Fish', 'Dairy'],
    dietary: ['Gluten-Free'],
    tags: ['Gluten-Free', 'Contains Fish', 'Contains Dairy'],
    substitutions: 'Dairy-free sauce option available',
    note: 'Cooked to order. Please specify preferred doneness.',
  },
];

export default function FoodList() {
  const [search, setSearch] = useState('');
  const [allergen, setAllergen] = useState(allergenOptions[0]);
  const [dietary, setDietary] = useState(dietaryOptions[0]);
  const [course, setCourse] = useState(courseOptions[0]);

  const filteredFoods = useMemo(() => {
    return foodList.filter(food => {
      const searchText = search.toLowerCase();
      const matchesSearch =
        food.title.toLowerCase().includes(searchText) ||
        food.description.toLowerCase().includes(searchText) ||
        food.ingredients.toLowerCase().includes(searchText);
      const matchesAllergen = !allergen.value || food.allergens.map(a => a.toLowerCase()).includes(allergen.label.toLowerCase());
      const matchesDietary = !dietary.value || food.dietary.map(d => d.toLowerCase()).includes(dietary.label.toLowerCase());
      const matchesCourse = !course.value || food.course.toLowerCase() === course.label.toLowerCase();
      return matchesSearch && matchesAllergen && matchesDietary && matchesCourse;
    });
  }, [search, allergen, dietary, course]);

  return (
    <div className="max-w-8xl mx-auto px-2 py-4">
      {/* Dashboard Stat Cards */}
      <FoodListCards />
      {/* Pixel-perfect Search Bar */}
      <div className="w-full mb-6 rounded-md p-2 ">
        {/* Search input full width on top */}
        <div className="relative w-full mb-3">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search dishes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary border border-gray-300"
          />
        </div>
        {/* Dropdowns + Button in a row */}
        <div className="flex flex-col md:flex-row gap-3 w-full">
          <Dropdown
            label="All Allergens"
            options={allergenOptions}
            selectedOption={allergen.label}
            onSelect={setAllergen}
            className="flex-1 bg-[#FFF8F3] border-1 border-gray-300 rounded-md text-sm"
          />
          <Dropdown
            label="All Dietary Restrictions"
            options={dietaryOptions}
            selectedOption={dietary.label}
            onSelect={setDietary}
            className="flex-1 bg-[#FFF8F3] border-1 border-gray-300 rounded-md text-sm"
          />
          <Dropdown
            label="All Courses"
            options={courseOptions}
            selectedOption={course.label}
            onSelect={setCourse}
            className="flex-1 bg-[#FFF8F3] border-1 border-gray-300 rounded-md text-sm"
          />
          <Button
            variant="secondary"
            className="flex-1 border border-red-400 text-red-600 px-4 py-2 rounded-md font-semibold text-sm bg-[#FFF8F3] hover:bg-red-50"
            onClick={() => {
              setSearch('');
              setAllergen(allergenOptions[0]);
              setDietary(dietaryOptions[0]);
              setCourse(courseOptions[0]);
            }}
          >
            Reset Filters
          </Button>
        </div>
      </div>
      {/* Food Cards */}
      <div className="space-y-6">
        {filteredFoods.length === 0 ? (
          <div className="text-center text-gray-400 py-12 text-lg">No dishes found.</div>
        ) : (
          filteredFoods.map((food, idx) => (
            <Card key={food.title} className=" overflow-hidden border border-gray-200 bg-white rounded-lg">
              {/* Top-left course label */}
              <div className="text-xl font-semibold text-textcolor mb-1 text-left px-4 ">{food.course}</div>
              {/* Content */}
              <div className="flex flex-col md:flex-row justify-start gap-4 px-3 py-6 pt-2 bg-background text-left ">
                {/* Image */}
                <div className="flex-shrink-0 flex items-center justify-center w-full h-full md:w-[122px] md:h-[122px] ">
                  <img
                    src={food.image}
                    alt={food.title}
                    className="object-cover w-full sm:w-[80px] sm:h-[80px] rounded-md"
                  />
                </div>
                <div>
                  <div className="flex items-start justify-between mb-1">
                    <div className="font-semibold text-[17px] text-textcolor leading-tight text-left">{food.title}</div>
                    <div className="text-[17px] text-red-600 font-semibold text-right min-w-[70px]">${food.price.toFixed(2)}</div>
                  </div>
                  <div className="text-xs text-gray-700 mb-2 text-left">{food.description}</div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {food.tags.map(tag => (
                      <Badge key={tag} className="bg-[#FFD60A] text-gray-800 rounded-full px-2 py-0.5 text-xs font-medium border border-yellow-200">{tag}</Badge>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-2 mb-2">
                    <div>
                      <div className="text-xs text-gray-500 font-semibold">Ingredients</div>
                      <div className="text-xs text-gray-700">{food.ingredients}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-semibold">Type</div>
                      <div className="text-xs text-gray-700">{food.course}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 font-semibold mb-1">Substitutions Available</div>
                  <div className="text-xs text-gray-700 mb-1">{food.substitutions}</div>
                  <div className="text-xs text-gray-500">{food.note}</div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 