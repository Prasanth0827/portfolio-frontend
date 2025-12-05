import axios from 'axios';

// Backend API URL - reads from environment variable
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_URL = import.meta.env.VITE_API_URL || 'https://portfolio-backend-lkeg.onrender.com/api';



// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 second timeout
});

// Request interceptor - Add auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear auth and redirect to login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('isAuthenticated');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API methods organized by resource
export const portfolioAPI = {
  // ==================== AUTHENTICATION ====================
  auth: {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    getMe: () => api.get('/auth/me'),
    updateProfile: (userData) => api.put('/auth/me', userData)
  },

  // ==================== ABOUT / PROFILE ====================
  about: {
    get: () => api.get('/about'),
    update: (data) => api.put('/about', data),
    addExperience: (experience) => api.post('/about/experience', experience),
    addEducation: (education) => api.post('/about/education', education)
  },

  // ==================== PROJECTS ====================
  projects: {
    getAll: (params) => api.get('/projects', { params }), // params: page, limit, q (search)
    getById: (id) => api.get(`/projects/${id}`),
    getFeatured: () => api.get('/projects/featured'),
    create: (project) => api.post('/projects', project),
    update: (id, project) => api.put(`/projects/${id}`, project),
    delete: (id) => api.delete(`/projects/${id}`)
  },

  // ==================== SKILLS ====================
  skills: {
    getAll: (category) => api.get('/skills', { params: { category } }),
    getById: (id) => api.get(`/skills/${id}`),
    create: (skill) => api.post('/skills', skill),
    update: (id, skill) => api.put(`/skills/${id}`, skill),
    delete: (id) => api.delete(`/skills/${id}`)
  },

  // ==================== CONTACT ====================
  contact: {
    submit: (message) => api.post('/contact', message),
    getAll: (params) => api.get('/contact', { params }), // Protected
    getById: (id) => api.get(`/contact/${id}`), // Protected
    markAsRead: (id) => api.put(`/contact/${id}/read`), // Protected
    delete: (id) => api.delete(`/contact/${id}`) // Protected
  },

  // ==================== FILE UPLOAD ====================
  upload: {
    single: (file) => {
      const formData = new FormData();
      formData.append('image', file);
      return api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    multiple: (files) => {
      const formData = new FormData();
      files.forEach(file => formData.append('images', file));
      return api.post('/upload/multiple', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
  },

  // ==================== HEALTH CHECK ====================
  health: () => axios.get(`${API_URL.replace('/api', '')}/health`)
};

// Export default api instance for custom requests
export default api;

