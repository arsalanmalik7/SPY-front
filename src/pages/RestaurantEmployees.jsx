import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../components/common/card';
import Button from '../components/common/button';
import Badge from '../components/common/badge';
import Avatar from '../components/common/avatar';
import Modal from '../components/common/modal';
import Input from '../components/common/input';
import { ManageStaffUserService } from '../services/ManageStaffUsers';

const RestaurantEmployees = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await ManageStaffUserService.getEmployeesByRestaurant(uuid);
        setEmployees(data.employees || data); // adjust if API returns differently
      } catch (err) {
        setError('Failed to fetch employees');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, [uuid]);

  const handleDelete = (employee) => {
    setSelectedEmployee(employee);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    // TODO: Implement delete logic
    setIsDeleteModalOpen(false);
  };

  const filteredEmployees = employees.filter((employee) =>
    employee.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text-main">Restaurant Employees</h1>
        <Button onClick={() => navigate(`/restaurants/${uuid}/employees/new`)}>
          Add New Employee
        </Button>
      </div>

      <Card>
        <div className="mb-4">
          <Input
            id="search"
            name="search"
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {loading ? (
          <div className="text-center py-8">Loading employees...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                  Lessons Completed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-text-light uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Avatar
                        alt={employee.name}
                        size="sm"
                        className="flex-shrink-0"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-text-main">
                          {employee.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-main">
                    {employee.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      variant={employee.status === 'active' ? 'success' : 'warning'}
                    >
                      {employee.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-main">
                    {employee.lessonsCompleted}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-main">
                    {employee.lastActive}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="mr-2"
                      onClick={() =>
                        navigate(`/restaurants/${uuid}/employees/${employee.id}`)
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(employee)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </Card>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Remove Employee"
      >
        <div className="text-sm text-text-main">
          Are you sure you want to remove {selectedEmployee?.name} from this
          restaurant? This action cannot be undone.
        </div>
        <div className="mt-4 flex justify-end space-x-3">
          <Button
            variant="secondary"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Remove
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default RestaurantEmployees; 