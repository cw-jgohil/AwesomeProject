import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  useActiveSessions,
  useRevokeSession,
  useLogoutOtherDevices,
  useLogoutAllDevices,
  useRefreshSessions,
} from '../services/auth/useSessionManagement';
import { SessionInfo } from '../services/auth/types';
import { useToast } from '../contexts/ToastContext';

/**
 * SessionManagement Component
 * ==========================
 *
 * A comprehensive session management interface that allows users to:
 * - View all their active sessions across devices
 * - See detailed information about each session
 * - Logout from specific devices
 * - Logout from all other devices
 * - Logout from all devices (including current)
 *
 * Features:
 * - Beautiful, intuitive UI with device icons
 * - Real-time session updates
 * - Pull-to-refresh functionality
 * - Loading states and error handling
 * - Toast notifications for all actions
 * - Confirmation dialogs for destructive actions
 * - Responsive design for different screen sizes
 */

interface SessionCardProps {
  session: SessionInfo;
  onRevoke: (sessionId: number) => void;
  isRevoking: boolean;
}

/**
 * Individual Session Card Component
 *
 * Displays information about a single session with:
 * - Device name and icon
 * - Last activity timestamp
 * - IP address and technical info
 * - Current session indicator
 * - Logout button for remote sessions
 */
const SessionCard: React.FC<SessionCardProps> = ({
  session,
  onRevoke,
  isRevoking,
}) => {
  const { showToast } = useToast();

  /**
   * Get appropriate device icon based on device name or user agent.
   *
   * Uses heuristics to determine device type from the stored
   * device information and user agent string.
   */
  const getDeviceIcon = () => {
    const deviceName = session.device_name?.toLowerCase() || '';
    const userAgent = session.user_agent?.toLowerCase() || '';

    if (deviceName.includes('iphone') || userAgent.includes('iphone')) {
      return 'phone-portrait-outline';
    }
    if (deviceName.includes('ipad') || userAgent.includes('ipad')) {
      return 'tablet-portrait-outline';
    }
    if (deviceName.includes('android') || userAgent.includes('android')) {
      return 'phone-portrait-outline';
    }
    if (deviceName.includes('mac') || userAgent.includes('macintosh')) {
      return 'laptop-outline';
    }
    if (deviceName.includes('windows') || userAgent.includes('windows')) {
      return 'desktop-outline';
    }
    if (
      userAgent.includes('chrome') ||
      userAgent.includes('firefox') ||
      userAgent.includes('safari')
    ) {
      return 'globe-outline';
    }
    return 'hardware-chip-outline'; // Default icon
  };

  /**
   * Format the last activity timestamp into a human-readable format.
   *
   * Shows relative time (e.g., "2 minutes ago", "1 hour ago")
   * or absolute time for older sessions.
   */
  const formatLastActivity = () => {
    const lastUsed = new Date(session.last_used);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - lastUsed.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) return 'Active now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440)
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return lastUsed.toLocaleDateString();
  };

  /**
   * Handle session revocation with confirmation.
   *
   * Shows a confirmation dialog before revoking the session
   * to prevent accidental logouts.
   */
  const handleRevoke = () => {
    Alert.alert(
      'Logout Device',
      `Are you sure you want to logout from "${session.device_name || 'this device'}"?\n\nThis will end the session and require login again on that device.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            onRevoke(session.id);
            showToast(
              `Logging out from ${session.device_name || 'device'}...`,
              'info',
            );
          },
        },
      ],
    );
  };

  return (
    <View className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100">
      {/* Session Header */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center flex-1">
          <View
            className={`w-12 h-12 rounded-full items-center justify-center mr-3 ${
              session.is_current_session ? 'bg-green-100' : 'bg-blue-100'
            }`}
          >
            <Icon
              name={getDeviceIcon()}
              size={24}
              color={session.is_current_session ? '#059669' : '#2563EB'}
            />
          </View>

          <View className="flex-1">
            <View className="flex-row items-center">
              <Text className="text-lg font-semibold text-gray-900 mr-2">
                {session.device_name || 'Unknown Device'}
              </Text>
              {session.is_current_session && (
                <View className="bg-green-100 px-2 py-1 rounded-full">
                  <Text className="text-green-800 text-xs font-medium">
                    Current
                  </Text>
                </View>
              )}
            </View>
            <Text className="text-gray-600 text-sm">
              {formatLastActivity()}
            </Text>
          </View>
        </View>

        {/* Logout Button (only for non-current sessions) */}
        {!session.is_current_session && (
          <TouchableOpacity
            onPress={handleRevoke}
            disabled={isRevoking}
            className="bg-red-50 p-2 rounded-lg"
          >
            {isRevoking ? (
              <ActivityIndicator size="small" color="#DC2626" />
            ) : (
              <Icon name="log-out-outline" size={20} color="#DC2626" />
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Session Details */}
      <View className="space-y-2">
        {session.ip_address && (
          <View className="flex-row items-center">
            <Icon name="location-outline" size={16} color="#6B7280" />
            <Text className="text-gray-600 text-sm ml-2">
              IP: {session.ip_address}
            </Text>
          </View>
        )}

        <View className="flex-row items-center">
          <Icon name="time-outline" size={16} color="#6B7280" />
          <Text className="text-gray-600 text-sm ml-2">
            Started: {new Date(session.issued_at).toLocaleDateString()}
          </Text>
        </View>

        {session.user_agent && (
          <View className="flex-row items-start">
            <Icon name="information-circle-outline" size={16} color="#6B7280" />
            <Text
              className="text-gray-600 text-sm ml-2 flex-1"
              numberOfLines={2}
            >
              {session.user_agent}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

/**
 * Main SessionManagement Component
 */
const SessionManagement: React.FC = () => {
  const { showToast } = useToast();
  const [refreshing, setRefreshing] = useState(false);

  // Session management hooks
  const { data: sessionsData, isLoading, error, refetch } = useActiveSessions();
  const revokeSession = useRevokeSession();
  const logoutOtherDevices = useLogoutOtherDevices();
  const logoutAllDevices = useLogoutAllDevices();
  const refreshSessions = useRefreshSessions();

  /**
   * Handle pull-to-refresh functionality.
   *
   * Allows users to manually refresh the session list
   * by pulling down on the screen.
   */
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
      showToast('Sessions updated', 'success');
    } catch (error) {
      showToast('Failed to refresh sessions', 'error');
    } finally {
      setRefreshing(false);
    }
  };

  /**
   * Handle individual session revocation.
   *
   * Revokes a specific session and shows appropriate
   * success or error messages to the user.
   */
  const handleRevokeSession = (sessionId: number) => {
    revokeSession.mutate(sessionId, {
      onSuccess: data => {
        if (data.success) {
          showToast('Device logged out successfully', 'success');
        } else {
          showToast(data.message || 'Failed to logout device', 'error');
        }
      },
      onError: (error: Error) => {
        showToast(error.message, 'error');
      },
    });
  };

  /**
   * Handle logout from all other devices.
   *
   * Shows confirmation dialog and logs out from all
   * devices except the current one.
   */
  const handleLogoutOtherDevices = () => {
    const otherDevicesCount =
      sessionsData?.sessions?.filter(s => !s.is_current_session).length || 0;

    if (otherDevicesCount === 0) {
      showToast('No other active sessions found', 'info');
      return;
    }

    Alert.alert(
      'Logout Other Devices',
      `This will logout from ${otherDevicesCount} other device${otherDevicesCount > 1 ? 's' : ''}.\n\nYou will remain logged in on this device, but all other devices will need to login again.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout Other Devices',
          style: 'destructive',
          onPress: () => {
            logoutOtherDevices.mutate(undefined, {
              onSuccess: data => {
                if (data.success) {
                  showToast(
                    `Logged out from ${data.revoked_sessions || otherDevicesCount} devices`,
                    'success',
                  );
                } else {
                  showToast(
                    data.message || 'Failed to logout from other devices',
                    'error',
                  );
                }
              },
              onError: (error: Error) => {
                showToast(error.message, 'error');
              },
            });
          },
        },
      ],
    );
  };

  /**
   * Handle logout from all devices (nuclear option).
   *
   * Shows strong confirmation dialog and logs out from
   * ALL devices including the current one.
   */
  const handleLogoutAllDevices = () => {
    const totalDevices = sessionsData?.total_sessions || 0;

    Alert.alert(
      'Logout All Devices',
      `⚠️ WARNING: This will logout from ALL ${totalDevices} device${totalDevices > 1 ? 's' : ''} including this one.\n\nYou will need to login again on every device, including this one.\n\nOnly proceed if you suspect your account is compromised.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout Everywhere',
          style: 'destructive',
          onPress: () => {
            logoutAllDevices.mutate(undefined, {
              onSuccess: data => {
                if (data.success) {
                  showToast(
                    `Logged out from all devices. Please login again.`,
                    'success',
                  );
                  // Navigation to login will be handled by auth state change
                } else {
                  showToast(
                    data.message || 'Failed to logout from all devices',
                    'error',
                  );
                }
              },
              onError: (error: Error) => {
                showToast(error.message, 'error');
              },
            });
          },
        },
      ],
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <View className="flex-row items-center justify-center py-8">
          <ActivityIndicator size="large" color="#2563EB" />
          <Text className="ml-3 text-gray-600">Loading active sessions...</Text>
        </View>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <View className="items-center py-8">
          <Icon name="warning-outline" size={48} color="#DC2626" />
          <Text className="text-gray-900 font-semibold text-lg mt-3 mb-2">
            Failed to Load Sessions
          </Text>
          <Text className="text-gray-600 text-center mb-4">
            {error.message || 'Unable to retrieve your active sessions'}
          </Text>
          <TouchableOpacity
            onPress={() => refetch()}
            className="bg-blue-500 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const sessions = sessionsData?.sessions || [];
  const totalSessions = sessionsData?.total_sessions || 0;

  return (
    <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <Text className="text-lg font-semibold text-gray-900">
            Active Sessions
          </Text>
          <Text className="text-gray-600">
            {totalSessions} active session{totalSessions !== 1 ? 's' : ''}{' '}
            across your devices
          </Text>
        </View>
        <TouchableOpacity
          onPress={refreshSessions}
          className="bg-gray-100 p-2 rounded-lg"
        >
          <Icon name="refresh-outline" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Sessions List */}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
        className="max-h-96"
      >
        {sessions.length === 0 ? (
          <View className="items-center py-8">
            <Icon name="phone-portrait-outline" size={48} color="#9CA3AF" />
            <Text className="text-gray-600 mt-3">No active sessions found</Text>
          </View>
        ) : (
          sessions.map(session => (
            <SessionCard
              key={session.id}
              session={session}
              onRevoke={handleRevokeSession}
              isRevoking={revokeSession.isPending}
            />
          ))
        )}
      </ScrollView>

      {/* Action Buttons */}
      {sessions.length > 1 && (
        <View className="mt-6 space-y-3">
          <TouchableOpacity
            onPress={handleLogoutOtherDevices}
            disabled={logoutOtherDevices.isPending}
            className="bg-orange-500 rounded-lg p-4 flex-row items-center justify-center"
          >
            {logoutOtherDevices.isPending ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Icon name="log-out-outline" size={20} color="white" />
                <Text className="text-white font-semibold ml-2">
                  Logout Other Devices
                </Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogoutAllDevices}
            disabled={logoutAllDevices.isPending}
            className="bg-red-500 rounded-lg p-4 flex-row items-center justify-center"
          >
            {logoutAllDevices.isPending ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Icon name="power-outline" size={20} color="white" />
                <Text className="text-white font-semibold ml-2">
                  Logout All Devices
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Security Notice */}
      <View className="mt-6 bg-blue-50 p-4 rounded-lg">
        <View className="flex-row items-start">
          <Icon name="shield-checkmark-outline" size={20} color="#2563EB" />
          <View className="ml-3 flex-1">
            <Text className="text-blue-900 font-medium text-sm">
              Security Tip
            </Text>
            <Text className="text-blue-800 text-sm mt-1">
              If you see unfamiliar devices or suspect unauthorized access,
              immediately logout from all devices and change your password.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SessionManagement;
