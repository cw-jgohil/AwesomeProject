#!/bin/bash

# Script to switch between development and production environments

ENV_TYPE=$1

if [ -z "$ENV_TYPE" ]; then
    echo "Usage: ./scripts/switch-env.sh [dev|prod]"
    echo ""
    echo "Options:"
    echo "  dev   - Switch to development environment (localhost)"
    echo "  prod  - Switch to production environment (ngrok URL)"
    exit 1
fi

case $ENV_TYPE in
    "dev")
        echo "Switching to development environment..."
        if [ -f ".env.production" ]; then
            cp .env.production .env.backup
        fi
        echo "# API Configuration
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
STORAGE_USER_DATA=user_data" > .env
        echo "✅ Switched to development environment"
        echo "📱 Use this for iOS Simulator or Android Emulator"
        ;;
    "prod")
        echo "Switching to production environment..."
        echo "⚠️  Make sure you have ngrok running and have the correct URL"
        echo ""
        read -p "Enter your ngrok URL (e.g., https://abc123.ngrok.io): " NGROK_URL
        
        if [ -z "$NGROK_URL" ]; then
            echo "❌ No ngrok URL provided. Exiting..."
            exit 1
        fi
        
        if [ -f ".env.production" ]; then
            cp .env.production .env.backup
        fi
        echo "# API Configuration for Production/Real Device
API_BASE_URL=$NGROK_URL
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
STORAGE_USER_DATA=user_data" > .env
        echo "✅ Switched to production environment"
        echo "📱 Use this for real device testing"
        ;;
    *)
        echo "❌ Invalid environment type. Use 'dev' or 'prod'"
        exit 1
        ;;
esac

echo ""
echo "🔄 Please restart your React Native app for changes to take effect"
echo "   Run: npm start -- --reset-cache" 