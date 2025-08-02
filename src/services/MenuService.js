import axiosInstance from './axiosConfig';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const MenuService = {
    // Dish endpoints
    createDish: async (dishData, imageFile) => {
        try {
            const formData = new FormData();

            // Append all dish data
            Object.keys(dishData).forEach(key => {
                if (Array.isArray(dishData[key])) {
                    formData.append(key, JSON.stringify(dishData[key]));
                } else if (typeof dishData[key] === 'object' && dishData[key] !== null) {
                    formData.append(key, JSON.stringify(dishData[key]));
                } else {
                    formData.append(key, dishData[key]);
                }
            });

            // Append image if provided
            if (imageFile) {
                formData.append('dish_Image', imageFile);
            }

            const response = await axiosInstance.post(`${API_BASE_URL}/dishes/create`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateDish: async (dishId, dishData, imageFile) => {
        console.log(imageFile)
        try {
            const formData = new FormData();

            // Append all dish data
            Object.keys(dishData).forEach(key => {
                if (Array.isArray(dishData[key])) {
                    formData.append(key, JSON.stringify(dishData[key]));
                } else if (typeof dishData[key] === 'object' && dishData[key] !== null) {
                    formData.append(key, JSON.stringify(dishData[key]));
                } else {
                    formData.append(key, dishData[key]);
                }
            });

            // Append image if provided
            if (imageFile) {
                formData.append('dish_Image', imageFile);
            }


            const response = await axiosInstance.put(`${API_BASE_URL}/dishes/${dishId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteDish: async (dishId) => {
        try {
            const response = await axiosInstance.delete(`${API_BASE_URL}/dishes/${dishId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Wine endpoints
    createWine: async (wineData, imageFile) => {
        try {
            const formData = new FormData();
            console.log(wineData)

            // Append all wine data
            Object.keys(wineData).forEach(key => {
                if (Array.isArray(wineData[key])) {
                    formData.append(key, JSON.stringify(wineData[key]));
                } else if (typeof wineData[key] === 'object' && wineData[key] !== null) {
                    formData.append(key, JSON.stringify(wineData[key]));
                } else {
                    formData.append(key, wineData[key]);
                }
            });

            // Append image if provided
            if (imageFile) {
                formData.append('wine_Image', imageFile);
            }

            const response = await axiosInstance.post(`${API_BASE_URL}/wines/create`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateWine: async (wineId, wineData, imageFile) => {
        try {
            const formData = new FormData();

            // Append all wine data
            Object.keys(wineData).forEach(key => {
                if (Array.isArray(wineData[key])) {
                    formData.append(key, JSON.stringify(wineData[key]));
                } else if (typeof wineData[key] === 'object' && wineData[key] !== null) {
                    formData.append(key, JSON.stringify(wineData[key]));
                } else {
                    formData.append(key, wineData[key]);
                }
            });

            // Append image if provided
            if (imageFile) {
                formData.append('wine_Image', imageFile);
            }

            const response = await axiosInstance.put(`${API_BASE_URL}/wines/${wineId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteWine: async (wineId) => {
        try {
            const response = await axiosInstance.delete(`${API_BASE_URL}/wines/${wineId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get all dishes and wines
    getAllDishes: async () => {
        try {
            const response = await axiosInstance.get(`${API_BASE_URL}/dishes`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getAllWines: async () => {
        try {
            const response = await axiosInstance.get(`${API_BASE_URL}/wines`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getAllDeletedWines: async () => {
        try {
            const response = await axiosInstance.get(`${API_BASE_URL}/wines/deleted`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getAllDeletedDishes: async () => {
        try {
            const response = await axiosInstance.get(`${API_BASE_URL}/dishes/deleted`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    restoreDish: async (uuid) => {
        try {
            const response = await axiosInstance.put(`${API_BASE_URL}/dishes/restore/${uuid}`);
            return response.data;
        } catch (error) {
            throw error
        }
    },

    restoreWine: async (uuid) => {
        try {
            const response = await axiosInstance.put(`${API_BASE_URL}/wines/restore/${uuid}`);
            return response.data;
        } catch (error) {
            throw error
        }
    },

    // Bulk upload function for dishes and wines
    bulkUploadMenu: async (formData, bulkUploadType) => {
        try {
            const response = await axiosInstance.post(`${API_BASE_URL}/bulk-upload/create/${bulkUploadType}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error bulk uploading menu items:', error);
            throw error;
        }
    },

    getDishAnalytics: async (restaurant_uuid) => {
        try {
            const response = await axiosInstance.get(`${API_BASE_URL}/dishes/analytics/${restaurant_uuid}`);
            return response.data;
        } catch (error) {
            throw error
        }
    },

    getWineAnalytics: async (restaurant_uuid) => {
        try {
            const response = await axiosInstance.get(`${API_BASE_URL}/wines/analytics/${restaurant_uuid}`);
            return response.data;
        } catch (error) {
            throw error

        }
    },
}; 