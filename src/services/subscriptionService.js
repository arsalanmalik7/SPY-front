import axiosInstance from './axiosConfig';


export const SubscriptionService = {
    getPlans: async () => {
        const response = await axiosInstance.get('/stripe/plans');
        return response.data;
    },

    createCheckoutSession: async (planId, quantity, amountDollars, isFreeTrial) => {
        const response = await axiosInstance.post('/stripe/create-checkout-session', {
            planId,
            successUrl: "http://localhost:3000/subscription",
            cancelUrl: "http://localhost:3000/subscription",
            amountDollars,
            isFreeTrial

        });
        return response.data;
    },

    getAllTransactions: async () => {
        try {
            const response = await axiosInstance.get('/stripe/transactions');
            return response.data;
        } catch (error) {
            console.error('Error fetching transactions:', error);
            throw error;            
        }
    },

    getSubscription: async () => {
        try {
            const response = await axiosInstance.get('/stripe/subscription');
            return response.data;
        } catch (error) {
            console.error('Error fetching subscription:', error);
            throw error;
        }
    },

    cancelSubscription: async () => {
        const response = await axiosInstance.post('/stripe/cancel-subscription');
        return response.data;
    }
};

