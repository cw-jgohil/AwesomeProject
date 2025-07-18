# Environment-Based Configuration System

This project now uses an environment-based configuration system that allows you to easily switch between different environments (development, production) and manage API endpoints, feature flags, and other configuration values.

## Environment Files

### `.env` (Development)
This file contains configuration for development environment:
```
# API Configuration
API_BASE_URL=http://localhost:8000
API_TIMEOUT=10000

# Environment
NODE_ENV=development

# App Configuration
APP_NAME=AwesomeProject
APP_VERSION=0.0.1

# Feature Flags
ENABLE_BLUETOOTH=true
ENABLE_ANALYTICS=false

# Storage Keys
STORAGE_ACCESS_TOKEN=access_token
STORAGE_REFRESH_TOKEN=refresh_token
STORAGE_USER_DATA=user_data
```

### `.env.production` (Production/Real Device)
This file contains configuration for production environment with ngrok URL:
```
# API Configuration for Production/Real Device
API_BASE_URL=https://your-ngrok-url.ngrok.io
API_TIMEOUT=10000

# Environment
NODE_ENV=production

# App Configuration
APP_NAME=AwesomeProject
APP_VERSION=0.0.1

# Feature Flags
ENABLE_BLUETOOTH=true
ENABLE_ANALYTICS=true

# Storage Keys
STORAGE_ACCESS_TOKEN=access_token
STORAGE_REFRESH_TOKEN=refresh_token
STORAGE_USER_DATA=user_data
```

## Configuration Structure

The configuration is centralized in `src/config/config.ts` and provides:

### Environment Configuration
- `ENV.NODE_ENV`: Current environment
- `ENV.IS_DEV`: Boolean for development environment
- `ENV.IS_PROD`: Boolean for production environment

### API Configuration
- `API.BASE_URL`: Base URL for API calls
- `API.TIMEOUT`: Request timeout in milliseconds
- `API.ENDPOINTS`: Centralized API endpoint definitions

### Feature Flags
- `FEATURES.ENABLE_BLUETOOTH`: Enable/disable bluetooth features
- `FEATURES.ENABLE_ANALYTICS`: Enable/disable analytics

### Storage Keys
- `STORAGE.ACCESS_TOKEN`: Key for storing access tokens
- `STORAGE.REFRESH_TOKEN`: Key for storing refresh tokens
- `STORAGE.USER_DATA`: Key for storing user data

## Usage

### In Components/Screens
```typescript
import { CONFIG } from '@config/config';

// Check if bluetooth is enabled
if (CONFIG.FEATURES.ENABLE_BLUETOOTH) {
  // Enable bluetooth functionality
}

// Use API base URL
const apiUrl = CONFIG.API.BASE_URL;
```

### In Services
```typescript
import { CONFIG } from '@config/config';

// Use API endpoints
const loginEndpoint = CONFIG.API.ENDPOINTS.AUTH.LOGIN;
const userProfileEndpoint = CONFIG.API.ENDPOINTS.AUTH.ME;
```

## Services Organization

The services are now organized in a modular structure:

### Auth Service (`src/services/auth/`)
- `authAPIRoutes.ts`: API route constants
- `useAuthAPI.ts`: React Query hooks for authentication
- `index.ts`: Exports all auth-related functionality

### User Service (`src/services/user/`)
- `userAPIRoutes.ts`: API route constants
- `useUserAPI.ts`: React Query hooks for user management
- `index.ts`: Exports all user-related functionality

### Bluetooth Service (`src/services/bluetooth/`)
- `bluetoothAPIRoutes.ts`: API route constants
- `useBluetoothAPI.ts`: React Query hooks for bluetooth
- `index.ts`: Exports all bluetooth-related functionality

## Importing Services

You can now import services in a clean way:

```typescript
import {
  useLogin,
  useLogout,
  useGetUserProfile,
  useCreateUser,
  useGetUserList,
  useScanBluetoothDevices,
  useConnectBluetoothDevice,
} from '@services';
```

## Switching Environments

### For Development (Simulator)
Use the `.env` file with localhost URL:
```
API_BASE_URL=http://localhost:8000
NODE_ENV=development
```

### For Real Device (Production)
1. Start ngrok to expose your local server:
   ```bash
   ngrok http 8000
   ```

2. Update `.env.production` with the ngrok URL:
   ```
   API_BASE_URL=https://your-ngrok-url.ngrok.io
   NODE_ENV=production
   ```

3. Copy `.env.production` to `.env`:
   ```bash
   cp .env.production .env
   ```

4. Restart your React Native app

## Adding New Environment Variables

1. Add the variable to both `.env` and `.env.production` files
2. Add the type declaration in `src/types/env.d.ts`
3. Import and use in `src/config/config.ts`
4. Use the configuration in your components/services

## Benefits

1. **Environment Switching**: Easy switching between development and production
2. **Centralized Configuration**: All config values in one place
3. **Type Safety**: Full TypeScript support for configuration
4. **Feature Flags**: Enable/disable features per environment
5. **Clean Service Organization**: Modular service structure
6. **Easy API Management**: Centralized API endpoints
7. **Real Device Support**: Easy ngrok integration for real device testing 