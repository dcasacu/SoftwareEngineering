# lineup_fullstack_temp

A new Flutter project.

## Getting Started

This project is a starting point for a Flutter application.

A few resources to get you started if this is your first Flutter project:

- [Learn Flutter](https://docs.flutter.dev/get-started/learn-flutter)
- [Write your first Flutter app](https://docs.flutter.dev/get-started/codelab)
- [Flutter learning resources](https://docs.flutter.dev/reference/learning-resources)

For help getting started with Flutter development, view the
[online documentation](https://docs.flutter.dev/), which offers tutorials,
samples, guidance on mobile development, and a full API reference.



# LineUp FullStack

This folder contains the main LineUp application, including the Flutter mobile app, backend code, tests and project dependencies.

LineUp is a mobile application designed to help users manage and follow queues in local markets in a simple, accessible and efficient way.

## Project Overview

LineUp allows users to either log in or continue without logging in. This makes the app easier to use for customers who only want to check information quickly, while still allowing shop owners to access queue management features.

The project includes customer-oriented features, shop-owner features, accessibility improvements, widget tests and a Continuous Integration pipeline.

## Main Features

- Initial screen with login and guest access options.
- Anonymous access for users who do not want to log in.
- Queue visualization for market stalls.
- Queue management for shop owners.
- Basic customer flow.
- Basic shop-owner flow.
- Accessibility-oriented features.
- Vibration notifications when it is the user’s turn.
- Automated widget tests.
- Continuous Integration pipeline using GitHub Actions.

## Folder Structure

```text
LineUp_FullStack/
├── android/              # Android configuration and native project files
├── assets/               # Images and static resources
├── backend/              # Backend server and API logic
├── ios/                  # iOS configuration and native project files
├── lib/                  # Flutter application source code
├── linux/                # Linux desktop configuration
├── macos/                # macOS desktop configuration
├── test/                 # Flutter widget tests
├── web/                  # Web platform configuration
├── windows/              # Windows desktop configuration
├── analysis_options.yaml # Dart and Flutter analysis rules
├── package.json          # Backend dependencies and scripts
├── package-lock.json     # Locked backend dependency versions
├── pubspec.yaml          # Flutter dependencies and project configuration
├── pubspec.lock          # Locked Flutter dependency versions
└── README.md             # Technical project documentation
```

## Technologies Used

- Flutter
- Dart
- Node.js
- GitHub Actions

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/RegNugg/SoftwareEngineering.git
```

### 2. Enter the project folder

```bash
cd SoftwareEngineering/LineUp_FullStack
```

### 3. Install Flutter dependencies

```bash
flutter pub get
```

### 4. Run the Flutter application

```bash
flutter run
```

To check available devices:

```bash
flutter devices
```

## Backend Setup

The project includes a backend inside the `backend/` folder and Node.js dependencies in the project.

Install backend dependencies from the `LineUp_FullStack` folder:

```bash
npm install
```

Start the backend:

```bash
npm start
```

Some app features related to authentication, shops or queues may require the backend to be running.

## Testing

The project includes Flutter widget tests inside the `test/` folder.

Run all tests:

```bash
flutter test
```

The current widget tests check that:

- The application starts without crashing.
- The welcome screen is displayed.
- The login option is visible.
- The guest access option is visible.

These tests help verify that the main entry point of the application works correctly.

## Continuous Integration Pipeline

This project includes a Continuous Integration pipeline using GitHub Actions.

The pipeline runs automatically when:

- Code is pushed to the `main` branch.
- A Pull Request is opened targeting the `main` branch.

The CI workflow performs the following checks:

- Installs Flutter dependencies.
- Runs Flutter tests.
- Checks that the project can be tested automatically in GitHub Actions.

## Academic Context

This application was developed as part of the Software Engineering course. The project applies agile practices, product backlog management, implementation, testing and quality improvement.

## License

This project is for academic purposes.
