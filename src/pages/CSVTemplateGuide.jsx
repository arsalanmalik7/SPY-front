import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function CSVTemplateGuide() {
  const navigate = useNavigate();

  const templateData = [
    { field: 'First Name', required: 'Optional', description: 'User\'s first name', example: 'jane.doe@example.com' },
    { field: 'Last Name', required: 'Optional', description: 'User\'s last name', example: 'Jane' },
    { field: 'Email', required: 'Required', description: 'User\'s email address (must be unique)', example: 'Doe' },
    { field: 'Role', required: 'Required', description: 'User\'s role (Manager, Employee, Director, Server)', example: 'manager' },
    { field: 'Restaurant', required: 'Required', description: 'Assigned restaurant name', example: 'Restaurant A, Restaurant B' },
  ];

  const exampleData = `First Name,Last Name,Email,Role
John,Doe,john@example.com,Manager
Jane,Smith,jane@example.com,Employee`;

  const handleDownloadTemplate = () => {
    const blob = new Blob([exampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'user_template.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen py-6">
      <h3 className="text-md text-gray-600 mb-5 text-left">Please ensure your CSV file contains the following columns with the correct formatting. Download our template or format your file according to these specifications.</h3>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <h1 className="text-2xl font-semibold text-gray-900">CSV Template Guide</h1>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleDownloadTemplate}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download Template
                </button>
                <button
                  onClick={() => navigate('/bulk-upload-users')}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="mb-6">
              <div className="bg-gray-50 rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr className="bg-trbackground">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Column Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Required</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Example</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {templateData.map((row, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-left">{row.field}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-left">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${row.required === 'Required' ? 'bg-primary text-gray-100' : 'bg-iconbackground text-gray-800'}`}>{row.required}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 text-left">{row.description}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 text-left">{row.example}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mb-6 text-left">
              <h3 className="text-lg font-medium mb-2">Notes</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
                  <li>manage_restaurants</li>
                  <li>manage_lessons</li>
                  <li>manage_wine</li>
                </ul>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
                  <li>manage_dishes</li>
                  <li>manage_employees</li>
                  <li>manage_subscriptions</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => navigate('/bulk-upload-users')}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-gray-400"
              >
                Back to Upload
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}