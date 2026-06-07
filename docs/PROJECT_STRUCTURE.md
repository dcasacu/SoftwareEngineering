# Project Structure

Detailed breakdown of the LineUp project organization.

## Repository Root

```
SoftwareEngineering/
├── docs/                          # Documentation (this folder)
│   ├── INDEX.md                   # Documentation index
│   ├── SETUP.md                   # Installation guide
│   ├── QUICKSTART.md              # Quick start guide
│   ├── ARCHITECTURE.md            # System architecture
│   ├── PROJECT_STRUCTURE.md       # This file
│   ├── DEVELOPMENT.md             # Development guidelines
│   ├── TESTING.md                 # Testing guide
│   ├── CONTRIBUTING.md            # Contribution guidelines
│   ├── CODE_STYLE.md              # Code style guide
│   ├── TROUBLESHOOTING.md         # Troubleshooting guide
│   ├── FAQ.md                     # Frequently asked questions
│   └── API_DOCUMENTATION.md       # API documentation
├── LineUp_FullStack/              # Main application
│   ├── lib/                       # Flutter source code
│   │   ├── main.dart              # Entry point
│   │   ├── screens/               # App screens
│   │   ├── widgets/               # Reusable widgets
│   │   ├── models/                # Data models
│   │   ├── services/              # API services
│   │   ├── providers/             # State management
│   │   └── utils/                 # Utilities & helpers
│   ├── backend/                   # Node.js backend
│   │   ├── routes/                # API routes
│   │   ├── controllers/           # Route controllers
│   │   ├── services/              # Business logic
│   │   ├── models/                # Database models
│   │   ├── middleware/            # Express middleware
│   │   ├── config/                # Configuration
│   │   ├── server.js              # Entry point
│   │   └── package.json           # Backend dependencies
│   ├── test/                      # Flutter tests
│   ├── android/                   # Android configuration
│   ├── ios/                       # iOS configuration
│   ├── web/                       # Web configuration
│   ├── macos/                     # macOS configuration
│   ├── linux/                     # Linux configuration
│   ├── windows/                   # Windows configuration
│   ├── assets/                    # Images and resources
│   ├── pubspec.yaml               # Flutter dependencies
│   └── README.md                  # FullStack project README
├── ProductCanvas_LineUp.png       # Product canvas
├── UserStories.pdf                # User stories documentation
├── README.md                      # Main repository README
└── .gitignore                     # Git ignore rules
```

## Frontend (Flutter/Dart)

### lib/ Directory Structure

```
lib/
├── main.dart                      # App entry point
├── screens/                       # Full-page screens
│   ├── welcome_screen.dart
│   ├── login_screen.dart
│   ├── home_screen.dart
│   ├── queue_screen.dart
│   ├── profile_screen.dart
│   └── admin_screen.dart
├── widgets/                       # Reusable UI components
│   ├── queue_card.dart
│   ├── user_header.dart
│   ├── custom_button.dart
│   └── loading_indicator.dart
├── models/                        # Data structures
│   ├── user.dart
│   ├── queue.dart
│   ├── shop.dart
│   └── api_response.dart
├── services/                      # External services
│   ├── api_service.dart           # API client
│   ├── auth_service.dart          # Authentication
│   └── storage_service.dart       # Local storage
├── providers/                     # State management
│   ├── user_provider.dart
│   ├── queue_provider.dart
│   └── auth_provider.dart
├── utils/                         # Helper functions
│   ├── constants.dart
│   ├── validators.dart
│   ├── extensions.dart
│   └── logger.dart
and assets/                        # Images and icons
│   ├── images/
│   └── icons/
```

### Key Files

- **main.dart**: App initialization and theme setup
- **screens/**: One file per major screen
- **widgets/**: Reusable components used across screens
- **models/**: Serializable data classes with `toJson()`/`fromJson()`
- **services/**: Handle HTTP calls, storage, authentication
- **providers/**: State management logic
- **utils/**: Constants, extensions, validators

## Backend (Node.js/Express)

### backend/ Directory Structure

```
backend/
├── routes/                        # API route definitions
│   ├── auth.js                    # Authentication endpoints
│   ├── queues.js                  # Queue management endpoints
│   ├── shops.js                   # Shop management endpoints
│   ├── users.js                   # User endpoints
│   └── index.js                   # Route aggregator
├── controllers/                   # Request handlers
│   ├── authController.js
│   ├── queueController.js
│   ├── shopController.js
│   └── userController.js
├── services/                      # Business logic
│   ├── queueService.js
│   ├── userService.js
│   ├── authService.js
│   └── emailService.js
├── models/                        # Database schemas
│   ├── User.js
│   ├── Queue.js
│   ├── Shop.js
│   └── index.js
├── middleware/                    # Express middleware
│   ├── authMiddleware.js          # JWT verification
│   ├── errorHandler.js            # Error handling
│   └── logger.js                  # Request logging
├── config/                        # Configuration
│   ├── database.js                # Database connection
│   ├── env.js                     # Environment variables
│   └── constants.js               # Constants
├── tests/                         # Backend tests
│   ├── auth.test.js
│   ├── queues.test.js
│   └── users.test.js
├── server.js                      # Express app setup
├── package.json                   # Dependencies & scripts
└── .env.example                   # Environment template
```

### Key Files

- **server.js**: Express app initialization
- **routes/**: Define API endpoints
- **controllers/**: Handle requests and responses
- **services/**: Core business logic
- **models/**: Database schemas and validation
- **middleware/**: Cross-cutting concerns

## Configuration Files

### pubspec.yaml (Flutter)
```yaml
name: lineup_app
description: LineUp mobile application

dependencies:
  flutter:
    sdk: flutter
  provider: ^6.0.0
  http: ^0.13.0

dev_dependencies:
  flutter_test:
    sdk: flutter
```

### package.json (Backend)
```json
{
  "name": "lineup-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.0",
    "mongoose": "^6.0.0"
  }
}
```

## Asset Organization

```
assets/
├── images/
│   ├── logo.png
│   ├── background.png
│   └── icons/
│       ├── queue.png
│       ├── user.png
│       └── settings.png
└── translations/ (if multilingual)
    ├── en.json
    └── es.json
```

## Documentation Organization

Documentation is in the `docs/` folder:
- **INDEX.md**: Navigation hub
- **SETUP.md**: Installation guide
- **QUICKSTART.md**: 5-minute start
- **ARCHITECTURE.md**: System design
- **DEVELOPMENT.md**: Dev workflow
- **CONTRIBUTING.md**: How to contribute
- **CODE_STYLE.md**: Coding standards
- **FAQ.md**: Common questions
- **TROUBLESHOOTING.md**: Problem solutions
- **API_DOCUMENTATION.md**: API reference

## File Naming Conventions

### Dart/Flutter
- **Screens**: `snake_case_screen.dart` (e.g., `user_profile_screen.dart`)
- **Widgets**: `snake_case.dart` (e.g., `custom_button.dart`)
- **Models**: `snake_case.dart` (e.g., `user_model.dart`)
- **Services**: `snake_case.dart` (e.g., `api_service.dart`)

### JavaScript
- **Controllers**: `camelCaseController.js` (e.g., `userController.js`)
- **Services**: `camelCaseService.js` (e.g., `queueService.js`)
- **Models**: `PascalCase.js` (e.g., `User.js`)
- **Routes**: `camelCase.js` (e.g., `authRoutes.js`)

## Development Workflow

### When Adding a Feature

1. **Frontend**
   ```
   lib/screens/ → Create new screen
   lib/models/ → Define data model
   lib/services/ → Add API call
   lib/providers/ → Add state management
   test/ → Write tests
   ```

2. **Backend**
   ```
   backend/routes/ → Add route
   backend/controllers/ → Add handler
   backend/services/ → Add business logic
   backend/models/ → Update schema if needed
   backend/tests/ → Write tests
   ```

### File Size Guidelines

- **Dart files**: < 300 lines (consider splitting)
- **JavaScript files**: < 200 lines (consider splitting)
- **Functions**: < 50 lines (consider refactoring)

## Version Control

### .gitignore includes

```
flutter/
node_modules/
.env
build/
dist/
.DS_Store
*.log
```

### Commit Organization

Use conventional commits:
- `feat: description` - New feature
- `fix: description` - Bug fix
- `docs: description` - Documentation
- `refactor: description` - Code restructuring

---

For more details, see the specific documentation files or contact maintainers.
