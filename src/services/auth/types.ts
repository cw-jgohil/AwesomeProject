// Types and query keys for the auth module
// ----------------------------------------
// This file centralizes all types and query keys for auth-related API hooks.

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginData {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: number;
    username: string;
    email: string;
    full_name?: string;
    role_id?: number;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error_code?: string;
}

// React Query Keys for auth data
export const authQueryKeys = {
  all: ['auth'] as const,
  user: () => [...authQueryKeys.all, 'user'] as const,
  profile: () => [...authQueryKeys.user(), 'profile'] as const,
};

// Session Management Types
// ========================
// These types enable comprehensive multi-device session management.
// Users can view all their active sessions, see device information,
// and revoke specific sessions or all sessions for security.

/**
 * Represents an active user session on a specific device.
 * 
 * Contains all information needed to display and manage
 * active sessions in the user interface.
 */
export interface SessionInfo {
  id: number;                          // Unique session identifier
  device_name?: string;                // Human-readable device name ("iPhone 15", "MacBook Pro")
  ip_address?: string;                 // IP address when session was created
  user_agent?: string;                 // Browser/app technical information
  issued_at: string;                   // ISO timestamp when session started
  last_used: string;                   // ISO timestamp of last activity
  expires_at: string;                  // ISO timestamp when session expires
  is_current_session: boolean;         // Whether this is the current device
}

/**
 * Response containing all active sessions for a user.
 * 
 * Returned by the /users/sessions endpoint to show
 * all devices where the user is currently logged in.
 */
export interface ActiveSessionsResponse extends ApiResponse {
  total_sessions: number;              // Total number of active sessions
  current_session_id?: number;        // ID of the current session (if identifiable)
  sessions: SessionInfo[];             // Array of all active sessions
}

/**
 * Response for session management actions.
 * 
 * Used when revoking individual sessions or logging out
 * from multiple devices at once.
 */
export interface SessionActionResponse extends ApiResponse {
  revoked_sessions?: number;           // Number of sessions that were revoked
}

/**
 * Device information sent during login for session tracking.
 * 
 * Helps users identify their sessions later in the session
 * management interface.
 */
export interface DeviceInfo {
  device_name?: string;                // User-friendly name like "John's iPhone"
  user_agent?: string;                 // Technical device/browser information
} 