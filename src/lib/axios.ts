import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 3000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to automatically inject the token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle global errors like 401
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token on unauthorized access
      localStorage.removeItem('token');
      // Optionally redirect to login:
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
