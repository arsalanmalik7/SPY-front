import axios from 'axios';

const API_URL = process.env.REACT_APP_API_BASE_URL;

export const bulkUploadEmployees = async (formData) => {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await axios.post(`${API_URL}/bulk-upload/employees`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}; 