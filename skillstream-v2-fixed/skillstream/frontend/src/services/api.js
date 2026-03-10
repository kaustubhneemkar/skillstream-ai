/**
 * API Service
 * Handles all HTTP requests to the backend
 */

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  signup: (data) => api.post('/auth/signup', data),
  verify: (token) => api.post('/auth/verify', { token })
};

// Asset APIs
export const assetAPI = {
  getAll: (filters) => api.get('/assets', { params: filters }),
  getById: (id) => api.get(`/assets/${id}`),
  getCategories: () => api.get('/assets/categories/list'),
  create: (data) => api.post('/assets', data),
  update: (id, data) => api.put(`/assets/${id}`, data),
  delete: (id) => api.delete(`/assets/${id}`)
};

// Employee APIs
export const employeeAPI = {
  getProfile: () => api.get('/employees/me'),
  updateProfile: (data) => api.put('/employees/me', data),
  getProgress: () => api.get('/employees/me/progress'),
  updateProgress: (data) => api.post('/employees/me/progress', data),
  submitScore: (data) => api.post('/employees/me/scores', data),
  getAnalytics: () => api.get('/employees/me/analytics')
};

// Learning Path APIs
export const learningPathAPI = {
  generate: (category) => api.post('/learning-paths/generate', { category }),
  getAll: () => api.get('/learning-paths/me'),
  getById: (id) => api.get(`/learning-paths/${id}`),
  adapt: (id) => api.post(`/learning-paths/${id}/adapt`),
  getNext: (id) => api.get(`/learning-paths/${id}/next`)
};

// Admin APIs
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getEmployees: () => api.get('/admin/employees'),
  getEmployeeDetails: (id) => api.get(`/admin/employees/${id}/details`),
  seedDatabase: () => api.post('/admin/seed'),
  getAssetAnalytics: () => api.get('/admin/assets/analytics')
};

export default api;
