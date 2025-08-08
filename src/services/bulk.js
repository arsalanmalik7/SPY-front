import axios from 'axios';
import axiosInstance from './axiosConfig';

const API_URL = process.env.REACT_APP_API_BASE_URL;

export const bulkUploadEmployees = async (formData) => {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await axiosInstance.post(`/bulk-upload/employees`, formData, {
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