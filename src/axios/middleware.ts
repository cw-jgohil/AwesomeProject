import { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import storage from '../utils/storage';
import { CONFIG } from '../config/config';

/**
 * Global middleware for Axios instances.
 * Handles:
 *   - Token injection
 *   - Token refresh (single-flight)
 *   - Global error handling
 *   - Extensibility for additional middleware
 *
 * Usage:
 *   import { applyGlobalMiddleware } from './middleware';
 *   const instance = axios.create(...);
 *   applyGlobalMiddleware(instance);
 *
 * You can also register additional middleware per instance.
 */

// --- Token Refresh Lock ---
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

// --- Token Management ---
async function getAccessToken() {
  return storage.getItem(CONFIG.STORAGE.ACCESS_TOKEN);
}
async function getRefreshToken() {
  return storage.getItem(CONFIG.STORAGE.REFRESH_TOKEN);
}
async function setAccessToken(token: string) {
  await storage.setItem(CONFIG.STORAGE.ACCESS_TOKEN, token);
}
async function setRefreshToken(token: string) {
  await storage.setItem(CONFIG.STORAGE.REFRESH_TOKEN, token);
}
async function clearTokens() {
  await storage.removeItem(CONFIG.STORAGE.ACCESS_TOKEN);
  await storage.removeItem(CONFIG.STORAGE.REFRESH_TOKEN);
  await storage.removeItem(CONFIG.STORAGE.USER_DATA);
}

// --- Token Refresh Logic ---
async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null;
  try {
    // You may want to move this endpoint to a config file
    const response = await fetch(CONFIG.API.BASE_URL + CONFIG.API.ENDPOINTS.AUTH.REFRESH, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    const data = await response.json();
    if (data?.data?.access_token) {
      await setAccessToken(data.data.access_token);
      if (data.data.refresh_token) await setRefreshToken(data.data.refresh_token);
      return data.data.access_token;
    }
  } catch (err) {
    // Optionally log error
  }
  return null;
}

/**
 * Apply global middleware/interceptors to an Axios instance.
 * You can call this for every instance you create.
 * @param instance AxiosInstance
 * @param options Optional: { onAuthFailure, onGlobalError, ... }
 */
export function applyGlobalMiddleware(
  instance: AxiosInstance,
  options?: {
    onAuthFailure?: () => void;
    onGlobalError?: (error: AxiosError) => void;
    // Add more hooks as needed
  }
) {
  // --- Request Interceptor: Inject token, handle refresh ---
  instance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    let token = await getAccessToken();
    // If no token, or token is about to expire, refresh it
    if (!token && !isRefreshing) {
      isRefreshing = true;
      refreshPromise = refreshAccessToken().finally(() => {
        isRefreshing = false;
      });
      token = await refreshPromise;
    } else if (!token && isRefreshing && refreshPromise) {
      token = await refreshPromise;
    }
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // --- Response Interceptor: Handle 401, refresh, retry, global errors ---
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
      if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
        originalRequest._retry = true;
        if (!isRefreshing) {
          isRefreshing = true;
          refreshPromise = refreshAccessToken().finally(() => {
            isRefreshing = false;
          });
        }
        const newToken = await refreshPromise;
        if (newToken) {
          await setAccessToken(newToken);
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return instance(originalRequest);
        } else {
          await clearTokens();
          if (options?.onAuthFailure) options.onAuthFailure();
        }
      }
      // Global error handler
      if (options?.onGlobalError) options.onGlobalError(error);
      return Promise.reject(error);
    }
  );
}

// --- Extensibility: You can add more middleware functions here ---
// e.g., logging, analytics, custom error reporting, etc. 