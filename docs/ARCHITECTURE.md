# System Architecture

High-level overview of LineUp's architecture and design.

## Architecture Overview

LineUp follows a **client-server architecture** with a mobile frontend and REST API backend.

```
┌─────────────────────────────────────────────────┐
│         LineUp Mobile Application               │
│  (Flutter/Dart - Android, iOS, Web support)     │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────┐    ┌──────────────────┐     │
│  │   UI Layer   │───▶│  State Management │     │
│  └──────────────┘    └──────────────────┘     │
│         │                      │               │
│         ▼                      ▼               │
│  ┌──────────────────────────────────────┐     │
│  │  API Client / HTTP Layer             │     │
│  └──────────────────────────────────────┘     │
│                    │                           │
└────────────────────┼───────────────────────────┘
                     │ HTTP/REST
                     ▼
┌─────────────────────────────────────────────────┐
│    LineUp Backend (Node.js/Express)            │
├─────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────┐ │
│  │        REST API Routes                    │ │
│  │  - Authentication                         │ │
│  │  - Queue Management                       │ │
│  │  - Shop Management                        │ │
│  │  - User Management                        │ │
│  └───────────────────────────────────────────┘ │
│               │                                │
│               ▼                                │
│  ┌───────────────────────────────────────────┐ │
│  │    Business Logic Layer                   │ │
│  │    - Queue operations                     │ │
│  │    - User authentication                  │ │
│  │    - Data validation                      │ │
│  └───────────────────────────────────────────┘ │
│               │                                │
│               ▼                                │
│  ┌───────────────────────────────────────────┐ │
│  │    Data Access Layer                      │ │
│  │    - Database queries                     │ │
│  │    - Data persistence                     │ │
│  └───────────────────────────────────────────┘ │
│               │                                │
└───────────────┼────────────────────────────────┘
                │
                ▼
         ┌─────────────┐
         │  Database   │
         │  (MongoDB/  │
         │   Firebase) │
         └─────────────┘
```

## Frontend Architecture (Flutter/Dart)

### Layer Structure

1. **Presentation Layer**
   - Widgets and UI components
   - Screens (Welcome, Login, Queue, Admin, etc.)
   - State management (Provider/BLoC/GetX)

2. **Business Logic Layer**
   - User authentication logic
   - Queue operations
   - Data processing

3. **Data Layer**
   - API client
   - Local storage
   - Network calls

### Key Components

- **Models**: Data structures for API responses
- **Services**: API communication, authentication
- **Providers/BLoC**: State management
- **Widgets**: Reusable UI components
- **Screens**: Full-page UI components

## Backend Architecture (Node.js/Express)

### Layer Structure

1. **API Layer** (`routes/`)
   - HTTP endpoint definitions
   - Request/response handling

2. **Controller Layer** (`controllers/`)
   - Business logic execution
   - Request validation
   - Response formatting

3. **Service Layer** (`services/`)
   - Core business operations
   - Data manipulation
   - Third-party integrations

4. **Model/Schema Layer** (`models/`)
   - Data structure definitions
   - Database schemas
   - Validations

5. **Middleware Layer**
   - Authentication checks
   - CORS handling
   - Request logging

## Data Flow

### User Queue Joining Flow

```
User Action (Mobile App)
        ▼
UI Event Handler
        ▼
State Management (Provider/BLoC)
        ▼
API Service Call (HTTP POST)
        ▼
Backend Route Handler
        ▼
Middleware (Auth Check)
        ▼
Controller (Business Logic)
        ▼
Service (Queue Operations)
        ▼
Database Query
        ▼
Response Back to Mobile
        ▼
State Update in App
        ▼
UI Re-render
```

## API Communication

### REST Endpoints

- **Authentication**: POST `/api/auth/login`, `/api/auth/register`
- **Queues**: GET/POST `/api/queues`, PUT `/api/queues/:id`
- **Shops**: GET `/api/shops`, POST `/api/shops`
- **Users**: GET/PUT `/api/users/:id`

### Request/Response Format

```json
Request:
{
  "userId": "123",
  "queueId": "456"
}

Response:
{
  "success": true,
  "data": { /* data */ },
  "message": "Operation successful"
}
```

## Technology Stack

### Frontend
- **Framework**: Flutter
- **Language**: Dart
- **State Management**: Provider/BLoC (see implementation)
- **API Client**: http/dio package

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB / Firebase (see configuration)
- **Authentication**: JWT tokens

## Deployment Architecture

### Mobile App
- Android APK/App Bundle → Google Play Store
- iOS IPA → Apple App Store
- Web (if applicable) → Web hosting

### Backend
- Docker containerization (if applicable)
- Cloud deployment (Heroku, Firebase, AWS, etc.)

## Scalability Considerations

1. **Database Indexing**: Queue and user data indexed for quick lookup
2. **API Rate Limiting**: Prevent abuse and ensure fair usage
3. **Caching**: Client-side caching of queue data
4. **Load Balancing**: Support multiple backend instances
5. **Real-time Updates**: WebSocket support (future enhancement)

## Security

1. **Authentication**: JWT-based user authentication
2. **Authorization**: Role-based access control (User, ShopOwner, Admin)
3. **Data Validation**: Input validation on both client and server
4. **HTTPS**: Encrypted communication
5. **Password Hashing**: Bcrypt or similar for password storage
