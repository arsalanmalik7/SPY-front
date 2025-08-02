import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/card';
import Button from '../components/common/button';
import Badge from '../components/common/badge';
import Modal from '../components/common/modal';
import Input from '../components/common/input';
import ProgressBar from '../components/common/progressBar';

const Lessons = () => {
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const lessons = [
    {
      id: '1',
      title: 'Food Safety Basics',
      description: 'Essential food safety practices for restaurant staff',
      category: 'Safety',
      difficulty: 'Beginner',
      duration: '30 minutes',
      status: 'active',
      completionRate: 85,
      assignedTo: 45,
    },
    {
      id: '2',
      title: 'Wine Pairing Guide',
      description: 'Learn how to pair wines with different dishes',
      category: 'Beverage',
      difficulty: 'Intermediate',
      duration: '45 minutes',
      status: 'active',
      completionRate: 65,
      assignedTo: 30,
    },
    {
      id: '3',
      title: 'Customer Service Excellence',
      description: 'Advanced customer service techniques',
      category: 'Service',
      difficulty: 'Advanced',
      duration: '60 minutes',
      status: 'draft',
      completionRate: 0,
      assignedTo: 0,
    },
  ];

  const handleDelete = (lesson) => {
    setSelectedLesson(lesson);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    // TODO: Implement delete logic
    setIsDeleteModalOpen(false);
  };

  const filteredLessons = lessons.filter((lesson) =>
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
  {/* Header */}
  <div className="flex flex-wrap justify-between items-center gap-4">
    <h1 className="text-2xl font-bold text-text-main">Team Training</h1>
    <div className="flex flex-wrap gap-2">
      <Button
        variant="secondary"
        onClick={() => navigate('/lessons/assign')}
      >
        Assign Lessons
      </Button>
      <Button onClick={() => navigate('/lessons/new')}>
        Create New Lesson
      </Button>
    </div>
  </div>

  {/* Search and Table */}
  <Card>
    <div className="mb-4">
      <Input
        id="search"
        name="search"
        placeholder="Search lessons..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full sm:w-auto"
      />
    </div>

    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
              Lesson
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
              Difficulty
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
              Duration
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
              Progress
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-text-light uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredLessons.map((lesson) => (
            <tr key={lesson.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div>
                  <div className="text-sm font-medium text-text-main">
                    {lesson.title}
                  </div>
                  <div className="text-sm text-text-light">
                    {lesson.description}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-text-main">
                {lesson.category}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-text-main">
                {lesson.difficulty}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-text-main">
                {lesson.duration}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge
                  variant={
                    lesson.status === 'active'
                      ? 'success'
                      : lesson.status === 'draft'
                      ? 'warning'
                      : 'default'
                  }
                >
                  {lesson.status}
                </Badge>
              </td>
              <td className="px-6 py-4">
                <div className="space-y-1">
                  <ProgressBar
                    value={lesson.completionRate}
                    showLabel
                    variant="success"
                  />
                  <p className="text-xs text-text-light">
                    {lesson.assignedTo} assigned
                  </p>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate(`/lessons/${lesson.id}`)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(lesson)}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Card>

  {/* Delete Modal */}
  <Modal
    isOpen={isDeleteModalOpen}
    onClose={() => setIsDeleteModalOpen(false)}
    title="Delete Lesson"
  >
    <div className="text-sm text-text-main">
      Are you sure you want to delete {selectedLesson?.title}? This action
      cannot be undone.
    </div>
    <div className="mt-4 flex justify-end space-x-3">
      <Button
        variant="secondary"
        onClick={() => setIsDeleteModalOpen(false)}
      >
        Cancel
      </Button>
      <Button variant="danger" onClick={confirmDelete}>
        Delete
      </Button>
    </div>
  </Modal>
</div>
  );
};

export default Lessons; 