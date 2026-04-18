import axios from 'axios';

// Base URLs from requirements
const API_URL = import.meta.env.VITE_MAIN_API_URL || 'http://localhost:8000';
const GRIEVANCE_URL = import.meta.env.VITE_GRIEVANCE_URL || 'http://localhost:8001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create a separate instance for Grievance service if needed, 
// but we'll handle the URL switch in the interceptor or per-call.
export const grievanceApi = axios.create({
  baseURL: GRIEVANCE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
const addAuthToken = (config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

api.interceptors.request.use(addAuthToken, (error) => Promise.reject(error));
grievanceApi.interceptors.request.use(addAuthToken, (error) => Promise.reject(error));

// Response interceptor for token refresh
const handleAuthError = async (error) => {
  const originalRequest = error.config;
  
  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      try {
        const response = await axios.post(
          `${API_URL}/api/auth/refresh?refresh_token=${refreshToken}`
        );
        
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
        
        originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
        return axios(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = '/signin';
      }
    }
  }
  return Promise.reject(error);
};

api.interceptors.response.use((r) => r, handleAuthError);
grievanceApi.interceptors.response.use((r) => r, handleAuthError);

export { api, api as default };
