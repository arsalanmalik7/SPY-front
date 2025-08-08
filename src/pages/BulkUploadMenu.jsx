import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../components/common/card';
import Button from '../components/common/button';
import ProgressBar from '../components/common/progressBar';

const BulkUploadMenu = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const allowedMimeTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ];
      const allowedExtensions = ['.xls', '.xlsx'];
      const fileExtension = '.' + selectedFile.name.split('.').pop().toLowerCase();

      if (allowedMimeTypes.includes(selectedFile.type) || allowedExtensions.includes(fileExtension)) {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('Please upload an Excel file (.xls, .xlsx)');
        setFile(null);
      }
    }
  };

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

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        setUploadProgress(i);
      }

      // TODO: Implement actual file upload logic
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navigate back to menu page after successful upload
      navigate(`/restaurants/${uuid}/menu`);
    } catch (error) {
      setError('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text-main">Bulk Upload Menu</h1>
        <Button
          variant="secondary"
          onClick={() => navigate(`/restaurants/${uuid}/menu`)}
        >
          Back to Menu
        </Button>
      </div>

      <Card>
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium text-text-main mb-2">
              Upload Excel File
            </h2>
            <p className="text-sm text-text-light mb-4">
              Upload an Excel file containing your menu items. The file should include
              columns for name, description, price, and category.
            </p>
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
                    <span>{file ? file.name : 'Upload a file'}</span>
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
                <p className="text-xs text-gray-500">(XLSX, XLS & CSV) up to 10MB</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 text-sm text-white bg-danger rounded-md">
              {error}
            </div>
          )}

          {isUploading && (
            <div className="space-y-2">
              <ProgressBar value={uploadProgress} showLabel />
              <p className="text-sm text-text-light">
                Uploading file... Please wait.
              </p>
            </div>
          )}

          <div className="flex justify-end">
            <Button
              onClick={handleUpload}
              disabled={!file || isUploading}
              loading={isUploading}
            >
              Upload File
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-text-main">
            Excel File Format
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                    Column
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                    Required
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-main">
                    name
                  </td>
                  <td className="px-6 py-4 text-sm text-text-main">
                    Name of the menu item
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-main">
                    Yes
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-main">
                    description
                  </td>
                  <td className="px-6 py-4 text-sm text-text-main">
                    Description of the menu item
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-main">
                    No
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-main">
                    price
                  </td>
                  <td className="px-6 py-4 text-sm text-text-main">
                    Price of the menu item (numeric)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-main">
                    Yes
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-main">
                    category
                  </td>
                  <td className="px-6 py-4 text-sm text-text-main">
                    Category of the menu item
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-main">
                    Yes
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BulkUploadMenu; 