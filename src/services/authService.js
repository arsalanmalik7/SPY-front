import axiosInstance from './axiosConfig';

const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  DIRECTOR: 'director',
  MANAGER: 'manager',
  EMPLOYEE: 'employee'
};

const authService = {

  

  login: async (email, password) => {
    try {
      const response = await axiosInstance.post('/users/login', {
        email,
        password,
      });

      if (response.data.accessToken) {
        // Store tokens in localStorage
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('userinfo', JSON.stringify(response.data.user));
        localStorage.setItem('role', response.data?.user?.role);
        // Decode the JWT to get user role
        const tokenPayload = JSON.parse(atob(response.data.accessToken.split('.')[1]));
        localStorage.setItem('userRole', tokenPayload.role || 'user');
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred during login' };
    }
  },

  register: async (userData) => {
    try {
      const response = await axiosInstance.post('/users/register', {
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        password: userData.password,
        restaurant_uuid: userData.restaurant_uuid,
        role: userData.role,
        current_subscription: userData.current_subscription,
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred during registration' };
    }
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
  },

  getCurrentUser: () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return null;

    try {
      const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
      return {
        accessToken,
        refreshToken: localStorage.getItem('refreshToken'),
        role: tokenPayload.role,
        uuid: tokenPayload.uuid
      };
    } catch (error) {
      return null;
    }
  },

  getProfile: async () => {
    try {
      const response = await axiosInstance.get('/users/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user profile' };
    }
  },

  // Add method to check if token is expired
  isTokenExpired: () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return true;

    try {
      const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
      // Check if token is expired or will expire in the next 5 seconds
      return tokenPayload.exp * 1000 < (Date.now() + 5000);
    } catch (error) {
      return true;
    }
  },

  checkToken: () => {
    if (authService.isTokenExpired()) {
      authService.logout();
      window.location.href = '/login';
      return false;
    }
    return true;
  },

  // Password reset request
  requestPasswordReset: async (email) => {
    try {
      const response = await axiosInstance.post('/users/request-reset', {
        email
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to send reset instructions' };
    }
  },

  // Reset password with token
  resetPassword: async (token, newPassword) => {
    try {
      const response = await axiosInstance.post('/users/reset-password', {
        token,
        newPassword
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to reset password' };
    }
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await axiosInstance.put('/users/change-password', {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to change password' };
    }
  },

  // Change email
  changeEmail: async (newEmail, password) => {
    try {
      const response = await axiosInstance.put('/users/change-email', {
        newEmail,
        password
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to change email' };
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const response = await axiosInstance.put(`/users/update/${userId}`, {
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        assigned_restaurants: userData.assigned_restaurants,
        lesson_progress: [],
        role: userData.role,
        newPassword: userData.newPassword,
        active: userData.status === "Active" // true if Active, false if Inactive
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update user' };
    }
  },

  USER_ROLES
};

export default authService; 