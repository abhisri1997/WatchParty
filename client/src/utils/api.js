import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
};

// Party APIs
export const partyAPI = {
  createParty: (data) => api.post('/party/create', data),
  joinParty: (data) => api.post('/party/join', data),
  getParty: (partyCode) => api.get(`/party/${partyCode}`),
  leaveParty: (partyCode) => api.post(`/party/${partyCode}/leave`),
  updateContent: (partyCode, data) => api.put(`/party/${partyCode}/content`, data),
  getActiveParties: () => api.get('/party/user/active'),
};

// User APIs
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  addStreamingService: (data) => api.post('/user/streaming-service', data),
  getStreamingServices: () => api.get('/user/streaming-services'),
};

export default api;
