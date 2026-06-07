# Quick Start Guide

Get LineUp up and running in 5 minutes!

## Prerequisites

- Git
- Flutter SDK ([Download](https://flutter.dev/docs/get-started/install))
- Node.js 14+ ([Download](https://nodejs.org/))
- A code editor (VSCode recommended)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/dcasacu/SoftwareEngineering.git
cd SoftwareEngineering
```

### 2. Navigate to the Main Project

```bash
cd LineUp_FullStack
```

### 3. Install Dependencies

#### Flutter Dependencies
```bash
flutter pub get
```

#### Backend Dependencies (Node.js)
```bash
npm install
```

### 4. Start the Backend

```bash
npm start
```

The backend will start on `http://localhost:3000`

### 5. Run the Application

In a new terminal:

```bash
flutter run
```

Select your target device when prompted.

## 🎉 Done!

The LineUp app should now be running on your device or emulator.

## Next Steps

- Read the [full setup guide](./SETUP.md) for detailed instructions
- Check [DEVELOPMENT.md](./DEVELOPMENT.md) for development workflow
- Visit the [troubleshooting guide](./TROUBLESHOOTING.md) if you hit any issues

## Common Commands

```bash
# Run Flutter app
flutter run

# Run tests
flutter test

# Build for production
flutter build apk        # Android
flutter build ios        # iOS

# Start backend
npm start

# Run backend tests (if configured)
npm test
```
