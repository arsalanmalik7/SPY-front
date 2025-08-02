import axiosInstance from './axiosConfig';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const getAuthToken = () => {
    return localStorage.getItem('accessToken');
};

const getAuthHeader = () => {
    const token = getAuthToken();
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const ManageStaffUserService = {
    getAllStaffUsers: async () => {
        try {
            const response = await axiosInstance.get('/users/users');
            return response.data;
        } catch (error) {
            console.error('Error fetching staff users:', error);
            throw error;
        }
    },
    getEmployeesByRestaurant: async (restaurantUuid) => {
        try {
            const response = await axiosInstance.get(`/users/view-employees/${restaurantUuid}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching employees for restaurant:', error);
            throw error;
        }
    }
};
