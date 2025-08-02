import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../components/common/card';
import Button from '../components/common/button';
import Input from '../components/common/input';
import Select from '../components/common/select';
import ToggleSwitch from '../components/common/toggleSwitch';
import Avatar from '../components/common/avatar';

const UserDetails = () => {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Manager',
    restaurant: 'The Grand Hotel',
    status: true,
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

  const roleOptions = [
    { value: 'Super Admin', label: 'Super Admin' },
    { value: 'Director', label: 'Director' },
    { value: 'Manager', label: 'Manager' },
    { value: 'Employee', label: 'Employee' },
  ];

  const restaurantOptions = [
    { value: 'The Grand Hotel', label: 'The Grand Hotel' },
    { value: 'All Restaurants', label: 'All Restaurants' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text-main">User Details</h1>
        <Button
          variant={isEditing ? 'secondary' : 'primary'}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </Button>
      </div>

      <Card>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col items-center space-y-4">
            <Avatar
              alt={formData.name}
              size="xl"
              className="mb-4"
            />
            <h2 className="text-xl font-semibold text-text-main">
              {formData.name}
            </h2>
            <p className="text-text-light">{formData.email}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="name"
              name="name"
              label="Full Name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
            />

            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
            />

            <Select
              id="role"
              name="role"
              label="Role"
              value={formData.role}
              onChange={handleChange}
              options={roleOptions}
              disabled={!isEditing}
            />

            <Select
              id="restaurant"
              name="restaurant"
              label="Restaurant"
              value={formData.restaurant}
              onChange={handleChange}
              options={restaurantOptions}
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
        </div>
      </Card>
    </div>
  );
};

export default UserDetails; 