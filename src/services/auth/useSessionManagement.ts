import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCall, deleteCall } from '../../axios/instance';
import { authQueryKeys, ActiveSessionsResponse, SessionActionResponse } from './types';

/**
 * Session Management API Hooks
 * ============================
 * 
 * These hooks provide a complete session management system for React Native.
 * Users can view all their active sessions across devices and manage them
 * with proper loading states, error handling, and optimistic updates.
 * 
 * Key Features:
 * - View all active sessions with device information
 * - Revoke individual sessions (logout specific device)
 * - Logout from all other devices (keep current session)
 * - Logout from ALL devices (nuclear option)
 * - Real-time session list updates
 * - Proper error handling and loading states
 */

// Query keys for session management
export const sessionQueryKeys = {
  all: ['sessions'] as const,
  list: () => [...sessionQueryKeys.all, 'list'] as const,
} as const;

/**
 * Hook to fetch all active sessions for the current user.
 * 
 * This hook retrieves all devices where the user is currently logged in,
 * including device names, IP addresses, last activity, and whether each
 * session is the current device.
 * 
 * Features:
 * - Automatic retry on network errors
 * - Cached data with background updates
 * - Loading and error states
 * - Real-time session status
 * 
 * @param options React Query options for customization
 * @returns Query object with sessions data, loading state, and error handling
 */
export const useActiveSessions = (options?: any) => {
  return useQuery<ActiveSessionsResponse>({
    queryKey: sessionQueryKeys.list(),
    queryFn: async () => {
      try {
        const response = await getCall('/users/sessions');
        if (!response.data) {
          throw new Error('No response from server');
        }
        return response.data as ActiveSessionsResponse;
      } catch (error: any) {
        // Enhanced error handling for better user experience
        if (error.response?.status === 401) {
          throw new Error('Please login again to view your sessions');
        }
        if (error.response?.status === 403) {
          throw new Error('You do not have permission to view sessions');
        }
        throw new Error(error.message || 'Failed to load active sessions');
      }
    },
    staleTime: 30 * 1000,              // Consider data fresh for 30 seconds
    refetchInterval: 60 * 1000,        // Auto-refresh every minute
    refetchOnWindowFocus: true,        // Refresh when app comes back to focus
    retry: 3,                          // Retry failed requests 3 times
    ...options,
  });
};

/**
 * Hook to revoke a specific session (logout from one device).
 * 
 * This allows users to logout from a specific device by revoking
 * that device's session. The device will immediately lose access
 * and need to login again.
 * 
 * Security Features:
 * - Users can only revoke their own sessions
 * - Optimistic updates for instant UI feedback
 * - Automatic session list refresh after revocation
 * - Detailed success/error messages
 * 
 * @param options React Query mutation options
 * @returns Mutation object with revoke function and loading state
 */
export const useRevokeSession = (options?: any) => {
  const queryClient = useQueryClient();

  return useMutation<SessionActionResponse, Error, number>({
    mutationFn: async (sessionId: number) => {
      try {
        const response = await deleteCall(`/users/sessions/${sessionId}`);
        if (!response.data) {
          throw new Error('No response from server');
        }
        return response.data as SessionActionResponse;
      } catch (error: any) {
        // Detailed error handling for specific scenarios
        if (error.response?.status === 404) {
          throw new Error('Session not found or already logged out');
        }
        if (error.response?.status === 403) {
          throw new Error('Cannot revoke this session');
        }
        throw new Error(error.message || 'Failed to logout from device');
      }
    },
    onSuccess: (data, sessionId) => {
      // Optimistically update the session list
      queryClient.setQueryData<ActiveSessionsResponse>(
        sessionQueryKeys.list(),
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            total_sessions: oldData.total_sessions - 1,
            sessions: oldData.sessions.filter(session => session.id !== sessionId),
          };
        }
      );
      
      // Refresh the session list to ensure accuracy
      queryClient.invalidateQueries({ queryKey: sessionQueryKeys.list() });
    },
    onError: () => {
      // Refresh session list on error to show current state
      queryClient.invalidateQueries({ queryKey: sessionQueryKeys.list() });
    },
    ...options,
  });
};

/**
 * Hook to logout from all other devices (keep current session).
 * 
 * This revokes all sessions except the current one, effectively
 * logging the user out from all other devices while keeping
 * them logged in on the current device.
 * 
 * Use Cases:
 * - User suspects account compromise
 * - User wants to ensure only current device has access
 * - Security best practice for shared/public devices
 * 
 * @param options React Query mutation options
 * @returns Mutation object with logout function and loading state
 */
export const useLogoutOtherDevices = (options?: any) => {
  const queryClient = useQueryClient();

  return useMutation<SessionActionResponse, Error, void>({
    mutationFn: async () => {
      try {
        const response = await deleteCall('/users/sessions');
        if (!response.data) {
          throw new Error('No response from server');
        }
        return response.data as SessionActionResponse;
      } catch (error: any) {
        if (error.response?.status === 401) {
          throw new Error('Please login again to manage sessions');
        }
        throw new Error(error.message || 'Failed to logout from other devices');
      }
    },
    onSuccess: (data) => {
      // Update session list to show only current session
      queryClient.setQueryData<ActiveSessionsResponse>(
        sessionQueryKeys.list(),
        (oldData) => {
          if (!oldData) return oldData;
          const currentSession = oldData.sessions.find(s => s.is_current_session);
          return {
            ...oldData,
            total_sessions: currentSession ? 1 : 0,
            sessions: currentSession ? [currentSession] : [],
          };
        }
      );
      
      // Refresh to ensure accuracy
      queryClient.invalidateQueries({ queryKey: sessionQueryKeys.list() });
    },
    onError: () => {
      // Refresh on error to show current state
      queryClient.invalidateQueries({ queryKey: sessionQueryKeys.list() });
    },
    ...options,
  });
};

/**
 * Hook to logout from ALL devices including current one.
 * 
 * This is the "nuclear option" that revokes ALL sessions
 * for the user, including the current device. The user
 * will need to login again everywhere.
 * 
 * Use Cases:
 * - User confirms account is compromised
 * - User wants to force re-authentication everywhere
 * - Security incident response
 * - User is leaving a shared device permanently
 * 
 * @param options React Query mutation options
 * @returns Mutation object with logout function and loading state
 */
export const useLogoutAllDevices = (options?: any) => {
  const queryClient = useQueryClient();

  return useMutation<SessionActionResponse, Error, void>({
    mutationFn: async () => {
      try {
        const response = await deleteCall('/users/sessions/all');
        if (!response.data) {
          throw new Error('No response from server');
        }
        return response.data as SessionActionResponse;
      } catch (error: any) {
        if (error.response?.status === 401) {
          throw new Error('Please login again to manage sessions');
        }
        throw new Error(error.message || 'Failed to logout from all devices');
      }
    },
    onSuccess: () => {
      // Clear all session data since user is logged out everywhere
      queryClient.setQueryData<ActiveSessionsResponse>(
        sessionQueryKeys.list(),
        {
          success: true,
          message: 'Logged out from all devices',
          total_sessions: 0,
          sessions: [],
        }
      );
      
      // Clear all auth-related queries since user is logged out
      queryClient.removeQueries({ queryKey: authQueryKeys.all });
      queryClient.clear();
    },
    onError: () => {
      // Refresh session list on error
      queryClient.invalidateQueries({ queryKey: sessionQueryKeys.list() });
    },
    ...options,
  });
};

/**
 * Hook to refresh the session list manually.
 * 
 * Useful for pull-to-refresh functionality or when user
 * wants to ensure they're seeing the latest session data.
 * 
 * @returns Function to manually refresh session data
 */
export const useRefreshSessions = () => {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({ queryKey: sessionQueryKeys.list() });
  };
}; 