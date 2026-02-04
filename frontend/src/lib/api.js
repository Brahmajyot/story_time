import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add Clerk token to requests
export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

// Story API endpoints
export const storyAPI = {
    getCount: async () => {
        const response = await api.get('/stories/count');
        return response.data;
    },

    generate: async (storyData) => {
        const response = await api.post('/stories/generate', storyData);
        return response.data;
    },

    getAll: async () => {
        const response = await api.get('/stories');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/stories/${id}`);
        return response.data;
    }
};

// Admin API endpoints
export const adminAPI = {
    checkAdmin: async () => {
        const response = await api.get('/admin/check');
        return response.data;
    },

    getAllUsers: async () => {
        const response = await api.get('/admin/users');
        return response.data;
    },

    togglePremium: async (userId, isPremium) => {
        const response = await api.put(`/admin/users/${userId}/premium`, { isPremium });
        return response.data;
    },

    getStats: async () => {
        const response = await api.get('/admin/stats');
        return response.data;
    },

    getUserStories: async (userId) => {
        const response = await api.get(`/admin/users/${userId}/stories`);
        return response.data;
    }
};

export default api;
