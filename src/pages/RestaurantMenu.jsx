import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../components/common/card';
import Button from '../components/common/button';
import Input from '../components/common/input';
import Select from '../components/common/select';
import Modal from '../components/common/modal';
import Badge from '../components/common/badge';

const RestaurantMenu = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    status: true,
  });

  const menuItems = [
    {
      id: '1',
      name: 'Classic Burger',
      description: 'Beef patty with lettuce, tomato, and special sauce',
      price: 12.99,
      category: 'Main Course',
      status: 'active',
    },
    {
      id: '2',
      name: 'Caesar Salad',
      description: 'Fresh romaine lettuce with Caesar dressing',
      price: 8.99,
      category: 'Appetizer',
      status: 'active',
    },
    {
      id: '3',
      name: 'Chocolate Cake',
      description: 'Rich chocolate cake with vanilla ice cream',
      price: 6.99,
      category: 'Dessert',
      status: 'inactive',
    },
  ];

  const categories = [
    { value: 'Appetizer', label: 'Appetizer' },
    { value: 'Main Course', label: 'Main Course' },
    { value: 'Dessert', label: 'Dessert' },
    { value: 'Beverage', label: 'Beverage' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement add menu item logic
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      status: true,
    });
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    // TODO: Implement delete logic
    setIsDeleteModalOpen(false);
  };

  const filteredItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text-main">Menu Management</h1>
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            onClick={() => navigate(`/restaurants/${uuid}/menu/upload`)}
          >
            Bulk Upload
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)}>Add Menu Item</Button>
        </div>
      </div>

      <Card>
        <div className="mb-4">
          <Input
            id="search"
            name="search"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-text-light uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-text-main">
                        {item.name}
                      </div>
                      <div className="text-sm text-text-light">
                        {item.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-main">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-main">
                    ${item.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      variant={item.status === 'active' ? 'success' : 'warning'}
                    >
                      {item.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="mr-2"
                      onClick={() =>
                        navigate(`/restaurants/${uuid}/menu/${item.id}`)
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(item)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Menu Item"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="name"
            name="name"
            label="Item Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <Input
            id="description"
            name="description"
            label="Description"
            value={formData.description}
            onChange={handleChange}
            multiline
          />

          <Input
            id="price"
            name="price"
            label="Price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            required
          />

          <Select
            id="category"
            name="category"
            label="Category"
            value={formData.category}
            onChange={handleChange}
            options={categories}
            required
          />

          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Item</Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Menu Item"
      >
        <div className="text-sm text-text-main">
          Are you sure you want to delete {selectedItem?.name}? This action cannot
          be undone.
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

export default RestaurantMenu; 