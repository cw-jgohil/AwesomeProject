import { useQuery } from '@tanstack/react-query';
import storage from '../../utils/storage';
import { authQueryKeys } from './types';
import CONFIG from '../../config/config';

/**
 * Hook to check if the user is authenticated (i.e., has an access token).
 * @param options Additional React Query options.
 */
export const useIsAuthenticated = (options?: any) => {
  return useQuery({
    queryKey: [...authQueryKeys.all, 'isAuthenticated'],
    queryFn: async () => {
      const token = await storage.getItem(CONFIG.STORAGE.ACCESS_TOKEN);
      return !!token;
    },
    ...options,
  });
}; 