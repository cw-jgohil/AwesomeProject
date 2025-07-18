export const USER_ROUTES = {
  PROFILE: '/users/profile',
  UPDATE: '/users/update',
  DELETE: '/users/delete',
  LIST: '/users/list',
  CREATE: '/users/create',
} as const;

export type UserRoute = typeof USER_ROUTES[keyof typeof USER_ROUTES]; 