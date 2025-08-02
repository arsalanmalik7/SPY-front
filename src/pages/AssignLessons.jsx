import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/card';
import Button from '../components/common/button';
import Input from '../components/common/input';
import Select from '../components/common/select';
import Checkbox from '../components/common/checkbox';
import Badge from '../components/common/badge';
import Avatar from '../components/common/avatar';

const AssignLessons = () => {
  const navigate = useNavigate();
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedLessons, setSelectedLessons] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const restaurants = [
    { value: '1', label: 'The Grand Hotel' },
    { value: '2', label: 'Ocean View Restaurant' },
    { value: '3', label: 'Mountain Peak Bistro' },
  ];

  const employees = [
    {
      id: '1',
      name: 'John Smith',
      role: 'Server',
      restaurant: 'The Grand Hotel',
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      role: 'Chef',
      restaurant: 'The Grand Hotel',
    },
    {
      id: '3',
      name: 'Mike Brown',
      role: 'Manager',
      restaurant: 'Ocean View Restaurant',
    },
  ];

  const lessons = [
    {
      id: '1',
      title: 'Food Safety Basics',
      category: 'Safety',
      difficulty: 'Beginner',
      duration: '30 minutes',
    },
    {
      id: '2',
      title: 'Wine Pairing Guide',
      category: 'Beverage',
      difficulty: 'Intermediate',
      duration: '45 minutes',
    },
    {
      id: '3',
      title: 'Customer Service Excellence',
      category: 'Service',
      difficulty: 'Advanced',
      duration: '60 minutes',
    },
  ];

  const handleRestaurantChange = (e) => {
    setSelectedRestaurant(e.target.value);
    setSelectedEmployees([]);
  };

  const handleEmployeeSelect = (employeeId) => {
    setSelectedEmployees((prev) =>
      prev.includes(employeeId)
        ? prev.filter((id) => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleLessonSelect = (lessonId) => {
    setSelectedLessons((prev) =>
      prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement assignment logic
    navigate('/lessons');
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      (!selectedRestaurant ||
        employee.restaurant ===
          restaurants.find((r) => r.value === selectedRestaurant)?.label) &&
      employee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text-main">Assign Lessons</h1>
        <Button variant="secondary" onClick={() => navigate('/lessons')}>
          Back to Lessons
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <div className="space-y-4">
            <Select
              id="restaurant"
              name="restaurant"
              label="Select Restaurant"
              value={selectedRestaurant}
              onChange={handleRestaurantChange}
              options={restaurants}
              required
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-main">
                Search Employees
              </label>
              <Input
                id="search"
                name="search"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-main">
                Select Employees
              </label>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {filteredEmployees.map((employee) => (
                  <div
                    key={employee.id}
                    className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md"
                  >
                    <Checkbox
                      id={`employee-${employee.id}`}
                      checked={selectedEmployees.includes(employee.id)}
                      onChange={() => handleEmployeeSelect(employee.id)}
                    />
                    <Avatar
                      alt={employee.name}
                      size="sm"
                      className="flex-shrink-0"
                    />
                    <div>
                      <div className="text-sm font-medium text-text-main">
                        {employee.name}
                      </div>
                      <div className="text-xs text-text-light">
                        {employee.role}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-text-main">
              Select Lessons
            </h2>
            <div className="space-y-4">
              {lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex items-start space-x-3 p-4 border rounded-md"
                >
                  <Checkbox
                    id={`lesson-${lesson.id}`}
                    checked={selectedLessons.includes(lesson.id)}
                    onChange={() => handleLessonSelect(lesson.id)}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="text-sm font-medium text-text-main">
                        {lesson.title}
                      </h3>
                      <Badge variant="default">{lesson.difficulty}</Badge>
                    </div>
                    <p className="text-sm text-text-light mt-1">
                      {lesson.category} • {lesson.duration}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={!selectedEmployees.length || !selectedLessons.length}>
            Assign Lessons
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AssignLessons; 