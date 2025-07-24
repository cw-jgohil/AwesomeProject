#!/bin/bash

# Script to copy app icons from assets/icons/AppIcons to iOS and Android platform folders
# Usage: sh scripts/set_app_icons.sh

set -e

# Paths
SRC_IOS="assets/icons/AppIcons/ios/AppIcon.appiconset"
DST_IOS="ios/AwesomeProject/Images.xcassets/AppIcon.appiconset"
SRC_IOS_ROOT="assets/icons/AppIcons/ios"
DST_IOS_ROOT="ios/AwesomeProject/Images.xcassets"
SRC_ANDROID="assets/icons/AppIcons/android"
DST_ANDROID="android/app/src/main/res"

# Function to copy iOS icons
copy_ios_icons() {
  echo "\n[INFO] Copying iOS app icons..."
  if [ ! -d "$SRC_IOS" ]; then
    echo "[ERROR] iOS source icon set not found at $SRC_IOS"
    exit 1
  fi
  mkdir -p "$DST_IOS"
  cp -R "$SRC_IOS/"* "$DST_IOS/"
  echo "[SUCCESS] iOS app icons updated."

  # Copy iTunesArtwork files if present
  for artwork in "$SRC_IOS_ROOT"/iTunesArtwork*; do
    if [ -f "$artwork" ]; then
      cp "$artwork" "$DST_IOS_ROOT/"
      echo "[SUCCESS] Copied $(basename "$artwork") to $DST_IOS_ROOT/"
    fi
  done
}

# Function to clean and copy Android icons
copy_android_icons() {
  echo "\n[INFO] Cleaning and copying Android app icons..."
  for density in mdpi hdpi xhdpi xxhdpi xxxhdpi; do
    DST_MIPMAP="$DST_ANDROID/mipmap-$density"
    # Remove old .png files for these icons
    for icon in ic_launcher ic_launcher_foreground ic_launcher_round; do
      if [ -f "$DST_MIPMAP/${icon}.png" ]; then
        rm "$DST_MIPMAP/${icon}.png"
        echo "[CLEAN] Removed $DST_MIPMAP/${icon}.png"
      fi
    done
    # Copy .webp icons
    for icon in ic_launcher.webp ic_launcher_foreground.webp ic_launcher_round.webp; do
      SRC_ICON="$SRC_ANDROID/mipmap-$density/$icon"
      DST_ICON="$DST_MIPMAP/$icon"
      if [ -f "$SRC_ICON" ]; then
        mkdir -p "$DST_MIPMAP"
        cp "$SRC_ICON" "$DST_ICON"
        echo "[SUCCESS] Updated $DST_ICON"
      else
        echo "[WARNING] Source icon not found for $density: $icon at $SRC_ICON"
      fi
    done
  done

  # Copy Play Store and web icons if present
  if [ -f "$SRC_ANDROID/playstore-icon.png" ]; then
    cp "$SRC_ANDROID/playstore-icon.png" "$DST_ANDROID/playstore-icon.png"
    echo "[SUCCESS] Copied playstore-icon.png to $DST_ANDROID/"
  fi
  if [ -f "$SRC_ANDROID/ic_launcher-web.png" ]; then
    cp "$SRC_ANDROID/ic_launcher-web.png" "$DST_ANDROID/ic_launcher-web.png"
    echo "[SUCCESS] Copied ic_launcher-web.png to $DST_ANDROID/"
  fi
}

copy_ios_icons
copy_android_icons

echo "\n[ALL DONE] App icons (including Play Store and web icons) have been set for both iOS and Android. Only .webp icons are used for Android to prevent duplicate resource errors." 