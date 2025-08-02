import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../components/common/card';
import Button from '../components/common/button';
import Input from '../components/common/input';
import Select from '../components/common/select';
import ToggleSwitch from '../components/common/toggleSwitch';
import Tabs from '../components/common/tabs';
import Badge from '../components/common/badge';
import Avatar from '../components/common/avatar';

const RestaurantDetails = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: 'The Grand Hotel',
    location: 'New York, NY',
    status: true,
    type: 'Hotel',
    description: 'A luxury hotel with fine dining experience',
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

  const typeOptions = [
    { value: 'Hotel', label: 'Hotel' },
    { value: 'Restaurant', label: 'Restaurant' },
    { value: 'Cafe', label: 'Cafe' },
    { value: 'Bar', label: 'Bar' },
  ];

  const tabs = [
    {
      id: 'details',
      label: 'Details',
      content: (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="name"
            name="name"
            label="Restaurant Name"
            value={formData.name}
            onChange={handleChange}
            disabled={!isEditing}
          />

          <Input
            id="location"
            name="location"
            label="Location"
            value={formData.location}
            onChange={handleChange}
            disabled={!isEditing}
          />

          <Select
            id="type"
            name="type"
            label="Type"
            value={formData.type}
            onChange={handleChange}
            options={typeOptions}
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
      id: 'employees',
      label: 'Employees',
      content: (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => navigate(`/restaurants/${uuid}/employees`)}>
              Manage Employees
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Sample employee cards */}
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-4">
                <div className="flex items-center space-x-4">
                  <Avatar size="md" />
                  <div>
                    <h3 className="font-medium text-text-main">Employee {i}</h3>
                    <p className="text-sm text-text-light">Role: Server</p>
                    <Badge variant="success" className="mt-1">
                      Active
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'menu',
      label: 'Menu',
      content: (
        <div className="space-y-4">
          <div className="flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={() => navigate(`/restaurants/${uuid}/menu`)}
            >
              Manage Menu
            </Button>
            <Button onClick={() => navigate(`/restaurants/${uuid}/menu/upload`)}>
              Bulk Upload
            </Button>
          </div>
          <Card>
            <div className="text-center text-text-light py-8">
              Menu management interface will be here
            </div>
          </Card>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text-main">Restaurant Details</h1>
        <Button
          variant={isEditing ? 'secondary' : 'primary'}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </Button>
      </div>

      <Card>
        <Tabs tabs={tabs} />
      </Card>
    </div>
  );
};

export default RestaurantDetails; 