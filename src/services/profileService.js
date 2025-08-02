import axios from 'axios';

const API_URL = process.env.REACT_APP_API_BASE_URL;

export const profileService = {
  editProfile: async (userId, formData) => {
    try {
      const token = localStorage.getItem('accessToken');
      
      const response = await axios.put(`${API_URL}/users/edit-profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};