import axios from 'axios';
import axiosInstance from './axiosConfig';

const API_URL = process.env.REACT_APP_API_BASE_URL || '';

const headers = {
  "ngrok-skip-browser-warning": "true"
};

const getAuthToken = () => {
    return localStorage.getItem('accessToken');
};

// API Functions
export const getLessonProgress = async () => {
  const token = getAuthToken();
  try {
    const response = await axios.get(`${API_URL}/lessons/progress`, {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching lesson progress:', error);
    throw error;
  }
};

export const getLessonUsers = async () => {
  const token = getAuthToken();
  try {
    const response = await axios.get(`${API_URL}/lessons/lessonUsers`, {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching lesson users:', error);
    throw error;
  }
};

export const resetTrainingProgress = async (resetUsers, category) => {
  const token = getAuthToken();
  try {
    const response = await axios.post(`${API_URL}/lessons/resetProgress`, {
      resetUsers,
      category
    }, {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error resetting training progress:', error);
    throw error;
  }
};

export const createLesson = async (lessonData) => {
  const token = getAuthToken();
  try {
    const response = await axios.post(`${API_URL}/lessons/create`, lessonData, {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating lesson:', error);
    throw error;
  }
};

export const getAllRestaurants = async () => {
  const token = getAuthToken();
  try {
    const response = await axios.get(`${API_URL}/restaurants`, {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    throw error;
  }
};

export const getMenus = async () => {
  const token = getAuthToken();
  try {
    const response = await axios.get(`${API_URL}/menus`, {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching menus:', error);
    throw error;
  }
};

export const getEmployeeLessons = async (restaurantUuid) => {
  const token = getAuthToken();
  try {
    const response = await axios.get(`${API_URL}/lessons/employee/lessons/${restaurantUuid}`, { 
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRestaurants = async () => {
  const token = getAuthToken();
  try {
    const response = await axios.get(`${API_URL}/restaurants`, { 
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const submitLessonProgress = async (lessonUuid, progressData) => {
  const token = getAuthToken();
  try {
    const response = await axios.put(`${API_URL}/lessons/${lessonUuid}/progress`, progressData, {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting lesson progress:', error);
    throw error;
  }
};

export const bulkUploadLessons = async (formData, bulkUploadType) => {
  const token = getAuthToken();
  try {
    const response = await axios.post(`${API_URL}/bulk-upload/create/${bulkUploadType}`, formData, {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error bulk uploading lessons:', error);
    throw error;
  }
}; 

export const getLessonProgressByRestaurant = async (restaurantUuid) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/lessons/progress/${restaurantUuid}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching lesson progress:', error);
    throw error;
  }
}; 