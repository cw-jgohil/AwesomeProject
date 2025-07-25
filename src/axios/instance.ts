import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { applyGlobalMiddleware } from './middleware';
import CONFIG from '../config/config';

/**
 * Shared Axios instance for all API calls.
 * Configured with baseURL, timeout, and global middleware (auth, error, etc.).
 *
 * You can import this instance for all API usage, or create your own with custom middleware.
 */
const api = axios.create({
  baseURL: CONFIG.API.BASE_URL,
  timeout: CONFIG.API.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Apply global middleware/interceptors
applyGlobalMiddleware(api);

export default api;

// --- Optional: Helper functions for DRY API usage (getCall, postCall, etc.) ---
export const getCall = (url: string, config?: AxiosRequestConfig) => api.get(url, config);
export const postCall = <T>(url: string, data: T, config?: AxiosRequestConfig) => api.post(url, data, config);
export const putCall = <T>(url: string, data: T, config?: AxiosRequestConfig) => api.put(url, data, config);
export const deleteCall = (url: string, config?: AxiosRequestConfig) => api.delete(url, config); 
