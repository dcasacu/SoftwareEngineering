# Complete Setup Guide

Detailed instructions for setting up LineUp for all platforms.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Flutter Setup](#flutter-setup)
3. [Backend Setup](#backend-setup)
4. [Platform-Specific Setup](#platform-specific-setup)
5. [Verification](#verification)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements

- **OS**: macOS 10.11+, Windows 7+, or Linux (Ubuntu 16.04+)
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: 3GB for Flutter SDK + additional for emulators/simulators
- **Git**: Version control system

### Software Requirements

- **Flutter SDK**: 3.0 or higher
- **Dart**: 2.19 or higher (comes with Flutter)
- **Node.js**: 14.0 or higher
- **npm**: 6.0 or higher

## Flutter Setup

### 1. Install Flutter SDK

**macOS:**
```bash
brew install flutter
```

**Windows:**
Download from https://flutter.dev/docs/get-started/install/windows

**Linux:**
```bash
cd ~/development
git clone https://github.com/flutter/flutter.git -b stable
export PATH="$PATH:`pwd`/flutter/bin"
```

### 2. Add Flutter to PATH

**macOS/Linux:**
```bash
export PATH="$PATH:[path-to-flutter-directory]/flutter/bin"
```

Add to your shell profile (`.bashrc`, `.zshrc`, or `.bash_profile`):
```bash
echo 'export PATH="$PATH:[path-to-flutter-directory]/flutter/bin"' >> ~/.bashrc
```

**Windows:**
Add Flutter to your system PATH via System Properties

### 3. Verify Installation

```bash
flutter --version
flutter doctor
```

Fix any issues reported by `flutter doctor`.

## Backend Setup

### 1. Install Node.js

Download from https://nodejs.org/ (LTS version recommended)

### 2. Verify Installation

```bash
node --version
npm --version
```

### 3. Install Backend Dependencies

```bash
cd LineUp_FullStack
npm install
```

### 4. Configure Environment (if needed)

Create a `.env` file in `LineUp_FullStack/` (see project documentation for required variables)

## Platform-Specific Setup

### Android Setup

#### Option 1: Using Android Studio

1. Download [Android Studio](https://developer.android.com/studio)
2. Install Android SDK
3. Accept Android licenses:
   ```bash
   flutter doctor --android-licenses
   ```

#### Option 2: Using Command Line

```bash
flutter config --enable-android
```

### iOS Setup (macOS only)

```bash
# Install CocoaPods dependency manager
sudo gem install cocoapods

# Accept Xcode licenses
sudo xcode-select --install
```

### Web Setup

```bash
# Enable web support
flutter config --enable-web
```

## Verification

### 1. Clone the Repository

```bash
git clone https://github.com/dcasacu/SoftwareEngineering.git
cd SoftwareEngineering/LineUp_FullStack
```

### 2. Install Dependencies

```bash
flutter pub get
npm install
```

### 3. Run Flutter Doctor

```bash
flutter doctor
```

All checks should show ✓ (though some may show warnings, which are usually acceptable).

### 4. List Available Devices

```bash
flutter devices
```

### 5. Run the App

```bash
# Terminal 1: Start backend
npm start

# Terminal 2: Run Flutter app
flutter run
```

## Troubleshooting

### Flutter Issues

```bash
# Clear Flutter cache
flutter clean

# Update Flutter
flutter upgrade

# Get fresh dependencies
flutter pub get
```

### Backend Issues

```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules
npm install
```

### Device Issues

```bash
# List connected devices
flutter devices

# Create Android emulator
flutter emulators --create --name MyEmulator

# List available emulators
flutter emulators
```

For more help, see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
