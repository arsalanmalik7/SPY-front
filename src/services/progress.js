import axiosInstance from './axiosConfig';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

export const getUserProgress = async () => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/lessons/userProgress`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user progress:', error);
    throw error;
  }
}; 