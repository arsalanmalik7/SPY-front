import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../components/common/card';
import Button from '../components/common/button';
import Input from '../components/common/input';
import Select from '../components/common/select';
import ToggleSwitch from '../components/common/toggleSwitch';
import Tabs from '../components/common/tabs';
import Badge from '../components/common/badge';
import ProgressBar from '../components/common/progressBar';

const LessonDetails = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: 'Food Safety Basics',
    description: 'Essential food safety practices for restaurant staff',
    category: 'Safety',
    difficulty: 'Beginner',
    duration: '30',
    status: true,
    content: [
      {
        id: '1',
        type: 'text',
        content: 'Introduction to food safety standards and regulations.',
      },
      {
        id: '2',
        type: 'video',
        content: 'https://example.com/video1',
        title: 'Hand Washing Techniques',
      },
      {
        id: '3',
        type: 'quiz',
        content: [
          {
            question: 'What is the minimum temperature for cooking chicken?',
            options: ['145°F', '165°F', '175°F', '185°F'],
            correctAnswer: 1,
          },
        ],
      },
    ],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStatusChange = (checked) => {
    setFormData((prev) => ({
      ...prev,
      status: checked,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement save logic
    setIsEditing(false);
  };

  const categoryOptions = [
    { value: 'Safety', label: 'Safety' },
    { value: 'Service', label: 'Service' },
    { value: 'Beverage', label: 'Beverage' },
    { value: 'Cooking', label: 'Cooking' },
  ];

  const difficultyOptions = [
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advanced', label: 'Advanced' },
  ];

  const tabs = [
    {
      id: 'details',
      label: 'Details',
      content: (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="title"
            name="title"
            label="Lesson Title"
            value={formData.title}
            onChange={handleChange}
            disabled={!isEditing}
          />

          <Input
            id="description"
            name="description"
            label="Description"
            value={formData.description}
            onChange={handleChange}
            disabled={!isEditing}
            multiline
          />

          <Select
            id="category"
            name="category"
            label="Category"
            value={formData.category}
            onChange={handleChange}
            options={categoryOptions}
            disabled={!isEditing}
          />

          <Select
            id="difficulty"
            name="difficulty"
            label="Difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            options={difficultyOptions}
            disabled={!isEditing}
          />

          <Input
            id="duration"
            name="duration"
            label="Duration (minutes)"
            type="number"
            value={formData.duration}
            onChange={handleChange}
            disabled={!isEditing}
          />

          <ToggleSwitch
            id="status"
            label="Active Status"
            checked={formData.status}
            onChange={handleStatusChange}
            disabled={!isEditing}
          />

          {isEditing && (
            <div className="flex justify-end">
              <Button type="submit">Save Changes</Button>
            </div>
          )}
        </form>
      ),
    },
    {
      id: 'content',
      label: 'Content',
      content: (
        <div className="space-y-4">
    <div className="flex flex-wrap justify-end gap-2">
      <Button onClick={() => navigate(`/lessons/${uuid}/content/new`)}>
        Add Content
      </Button>
    </div>
    <div className="space-y-4">
      {formData.content.map((item) => (
        <Card key={item.id} className="p-4">
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div>
              <Badge variant="default" className="mb-2">
                {item.type}
              </Badge>
              {item.type === 'text' && (
                <p className="text-text-main">{item.content}</p>
              )}
              {item.type === 'video' && (
                <div>
                  <h3 className="font-medium text-text-main">{item.title}</h3>
                  <p className="text-sm text-text-light">{item.content}</p>
                </div>
              )}
              {item.type === 'quiz' && (
                <div>
                  <h3 className="font-medium text-text-main">
                    Quiz: {item.content[0].question}
                  </h3>
                  <ul className="mt-2 space-y-1">
                    {item.content[0].options.map((option, index) => (
                      <li key={index} className="text-sm text-text-light">
                        {option}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  navigate(`/lessons/${uuid}/content/${item.id}`)
                }
              >
                Edit
              </Button>
              <Button variant="danger" size="sm">
                Delete
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>
      ),
    },
    {
      id: 'progress',
      label: 'Progress',
      content: (
        <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <h3 className="text-lg font-medium text-text-main mb-4">
          Overall Progress
        </h3>
        <ProgressBar value={75} showLabel variant="success" />
      </Card>
      <Card>
        <h3 className="text-lg font-medium text-text-main mb-4">
          Completion Rate
        </h3>
        <div className="text-3xl font-bold text-text-main">85%</div>
        <p className="text-sm text-text-light">45 out of 53 employees</p>
      </Card>
    </div>

    <Card>
      <h3 className="text-lg font-medium text-text-main mb-4">
        Recent Completions
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                Employee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                Date Completed
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                Score
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[1, 2, 3].map((i) => (
              <tr key={i}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-main">
                  Employee {i}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-main">
                  2024-03-{10 + i}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-main">
                  {90 + i}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
   <div className="flex flex-wrap justify-between items-center gap-4">
    <h1 className="text-2xl font-bold text-text-main">Lesson Details</h1>
    <Button
      variant={isEditing ? 'secondary' : 'primary'}
      onClick={() => setIsEditing(!isEditing)}
    >
      {isEditing ? 'Cancel' : 'Edit'}
    </Button>
  </div>

  {/* Tabs */}
  <Card>
    <Tabs tabs={tabs} />
  </Card>
    </div>
  );
};

export default LessonDetails; 