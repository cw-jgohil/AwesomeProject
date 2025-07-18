export const AUTH_ROUTES = {
  LOGIN: '/users/login',
  REFRESH: '/users/refresh',
  LOGOUT: '/users/logout',
  ME: '/users/me',
} as const;

export type AuthRoute = typeof AUTH_ROUTES[keyof typeof AUTH_ROUTES]; 