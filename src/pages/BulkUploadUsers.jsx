import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bulkUploadEmployees } from '../services/bulk';
import { RestaurantsService } from '../services/Restaurants';

export default function BulkUploadUsers() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [fileName, setFileName] = useState('');
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await RestaurantsService.getAllRestaurants();
        setRestaurants(data);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        setErrors({ restaurants: 'Failed to load restaurants' });
      }
    };
    fetchRestaurants();
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange({ target: { files: e.dataTransfer.files } });
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const allowedMimeTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ];
      const allowedExtensions = ['.xls', '.xlsx'];
      const fileExtension = '.' + selectedFile.name.split('.').pop().toLowerCase();

      if (!allowedMimeTypes.includes(selectedFile.type) && !allowedExtensions.includes(fileExtension)) {
        setErrors({ file: 'Please upload an Excel file (.xls, .xlsx)' });
        return;
      }
      setFile(selectedFile);
      setErrors({});
      setFileName(selectedFile.name);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        setPreview(text);

        // Parse CSV data
        const rows = text.split('\n').map(row => row.split(','));
        setCsvData(rows);
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleDownloadTemplate = () => {
    const template = `
        First Name,Last Name,Email,Role,Restaurant UUID
        John,Doe,john@example.com,Manager,${selectedRestaurant}
        Jane,Smith,jane@example.com,Employee,${selectedRestaurant}`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'user_template.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setErrors({ submit: 'Please select a file to upload' });
      return;
    }
    if (!selectedRestaurant) {
      setErrors({ submit: 'Please select a restaurant' });
      return;
    }

    try {
      setIsUploading(true);
      setErrors({});
      const formData = new FormData();
      formData.append('file', file);
      formData.append('restaurant_uuid', selectedRestaurant);
      await bulkUploadEmployees(formData);
      setUploadSuccess(true);
      // Optionally navigate after successful upload
      setTimeout(() => {
        navigate('/staff-management');
      }, 2000);
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to upload file. Please try again.' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <h1 className="text-2xl font-semibold text-gray-900">Bulk Upload Users</h1>
              <button
                onClick={() => navigate('/staff-management')}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Upload Section */}
            <div>
              <h3 className="text-lg font-medium mb-2">Upload User Excel</h3>
              <p className="text-sm text-gray-500">
                Upload a Excel file containing user information. Make sure to follow the template format.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                <select
                  value={selectedRestaurant}
                  onChange={(e) => setSelectedRestaurant(e.target.value)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary w-[300px]"
                >
                  <option value="">Select Restaurant</option>
                  {restaurants.map((restaurant) => (
                    <option key={restaurant.uuid} value={restaurant.uuid}>
                      {restaurant.name}
                    </option>
                  ))}
                </select>
                <a
                  type="button"
                  href="./user_template.xlsx"
                  download
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
                </a>
                <button
                  type="button"
                  onClick={() => navigate('/csv-template-guide')}
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
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  View Template Guide
                </button>
              </div>
            </div>

            {/* File Upload */}
            <div
              className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md ${dragActive ? 'bg-gray-100' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                  >
                    <span>{fileName || 'Upload a file'}</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      accept=".xlsx, .xls"
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">CSV up to 10MB</p>
              </div>
            </div>
            {errors.file && (
              <p className="mt-2 text-sm text-red-600">{errors.file}</p>
            )}

            {/* Preview Section */}
            {/* {csvData.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">File Preview</h4>
            <div className="bg-gray-50 rounded-md p-4 overflow-auto max-h-60">
              <table className="min-w-full">
                <thead>
                  <tr>
                    {csvData[0].map((header, index) => (
                      <th key={index} className="border-b">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {csvData.slice(1).map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="border-b">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )} */}

            {/* Success Message */}
            {uploadSuccess && (
              <div className="p-3 bg-green-50 text-green-600 rounded-md text-sm">
                File uploaded successfully! Redirecting...
              </div>
            )}

            {/* Errors */}
            {errors.submit && (
              <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
                {errors.submit}
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => navigate('/staff-management')}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isUploading || !file}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? 'Uploading...' : 'Upload Users'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 