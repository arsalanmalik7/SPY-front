import React, { useState, useMemo } from 'react';
import Button from './button';
import Dropdown from './dropdown';
import Card from './card';
import { Wheat, Milk, Nut, Fish } from 'lucide-react';

// ProgressBar component (inline, Tailwind only)
function ProgressBar({ percent, color = 'bg-primary' }) {
  return (
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className={`h-2 ${color} rounded-full transition-all`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

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
    course: 'Appetizer',
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

const courseStats = [
  { label: 'Appetizers', count: 12, percent: 35, color: 'bg-yellow-400', bar: 'bg-yellow-400', active: false },
  { label: 'Main Course', count: 15, percent: 45, color: 'bg-primary', bar: 'bg-primary', active: true },
  { label: 'Desserts', count: 8, percent: 20, color: 'bg-pink-300', bar: 'bg-pink-300', active: false },
];
const allergenStats = [
  { label: 'Gluten', count: 15 },
  { label: 'Dairy', count: 12 },
  { label: 'Nuts', count: 8 },
  { label: 'Fish', count: 6 },
];
const dietaryStats = [
  { label: 'Vegetarian', count: 9 },
  { label: 'Vegan', count: 5 },
  { label: 'Gluten-Free', count: 7 },
  { label: 'Dairy-Free', count: 7 },
];

export default function FoodListCards() {
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
    <>
      {/* Dashboard Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-6 text-left ">
        {/* Card 1: Course Distribution with Progress Bars */}
        <Card className="py-3 px-4 bg-white border border-gray-200 rounded-lg h-full flex flex-col justify-between md:max-w-[300px] w-full">
          <div className="font-semibold text-sm mb-2">Course Distribution</div>
          <div className="space-y-3">
            {courseStats.map(stat => (
              <div key={stat.label}>
                <div className={`flex items-center justify-between mb-1 ${stat.active ? 'font-semibold text-primary' : ''}`}>
                  <span className="text-[15px]">{stat.label}</span>
                  <span className={`text-xs ${stat.active ? 'text-primary font-semibold' : 'text-gray-500'}`}>{stat.count} items ({stat.percent}%)</span>
                </div>
                <ProgressBar percent={stat.percent} color={stat.bar} />
              </div>
            ))}
          </div>
        </Card>
        {/* Card 2: Allergen Breakdown with Lucide icons */}
        <Card className="py-3 px-4 bg-white border border-gray-200 rounded-lg h-full flex flex-col justify-between md:max-w-[300px] w-full">
          <div className="font-semibold text-sm mb-2">Allergen Breakdown</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[15px]"><Wheat size={18} className="text-textcolor" />Gluten</span>
              <span className="text-xs text-gray-500">15</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[15px]"><Milk size={18} className="text-textcolor" />Dairy</span>
              <span className="text-xs text-gray-500">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[15px]"><Nut size={18} className="text-textcolor" />Nuts</span>
              <span className="text-xs text-gray-500">8</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[15px]"><Fish size={18} className="text-textcolor" />Fish</span>
              <span className="text-xs text-gray-500">6</span>
            </div>
          </div>
        </Card>
        {/* Card 3: Dietary Restrictions */}
        <Card className="py-3 px-4 bg-white border border-gray-200 rounded-lg h-full flex flex-col justify-between md:max-w-[300px] w-full">
          <div className="font-semibold text-sm mb-2">Dietary Restrictions</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[15px]">Vegetarian</span>
              <span className="text-xs text-gray-500">8 items</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[15px]">Vegan</span>
              <span className="text-xs text-gray-500">5 items</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[15px]">Gluten-Free</span>
              <span className="text-xs text-gray-500">10 items</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[15px]">Dairy-Free</span>
              <span className="text-xs text-gray-500">7 items</span>
            </div>
          </div>
        </Card>
        {/* Card 4: Substitutions */}
        <Card className="py-3 px-4 bg-white border border-gray-200 rounded-lg h-full flex flex-col items-center justify-center md:max-w-[300px] w-full">
          <div className="font-semibold text-center text-sm mb-2">Substitutions</div>
          <div className="text-2xl font-bold text-center text-primary mb-1">18</div>
          <div className="text-xs text-gray-500 text-center">items with substitutions<br />out of 35 total dishes</div>
        </Card>
      </div>
      <div/>
    </>
  );
} 