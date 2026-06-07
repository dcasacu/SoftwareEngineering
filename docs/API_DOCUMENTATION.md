# API Documentation

Complete reference for LineUp backend API endpoints.

## Base URL

```
http://localhost:3000/api
```

## Authentication

All endpoints require JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Response Format

All responses follow this format:

```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation successful"
}
```

## Error Responses

```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400
}
```

## Endpoints

### Authentication

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe",
  "role": "customer" // or "shop_owner"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "123",
    "email": "user@example.com",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "123",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### Logout

```http
POST /api/auth/logout
Authorization: Bearer <token>
```

### Users

#### Get Current User

```http
GET /api/users/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "customer",
    "createdAt": "2026-06-01T10:00:00Z"
  }
}
```

#### Update User

```http
PUT /api/users/:userId
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "phone": "+1234567890"
}
```

#### Get User Profile

```http
GET /api/users/:userId
Authorization: Bearer <token>
```

### Queues

#### Get All Queues

```http
GET /api/queues?shop_id=456&status=active
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "789",
      "shopId": "456",
      "name": "Service Counter",
      "position": 5,
      "estimatedWait": 15,
      "status": "active",
      "createdAt": "2026-06-07T10:00:00Z"
    }
  ]
}
```

#### Get Queue Details

```http
GET /api/queues/:queueId
Authorization: Bearer <token>
```

#### Join Queue

```http
POST /api/queues/:queueId/join
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "position": 10,
    "estimatedWait": 25,
    "ticketNumber": "A123"
  }
}
```

#### Leave Queue

```http
POST /api/queues/:queueId/leave
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "123"
}
```

#### Update Queue Status

```http
PUT /api/queues/:queueId
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "paused" // or "active", "closed"
}
```

#### Get User Queue Position

```http
GET /api/queues/:queueId/position/:userId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "position": 5,
    "estimatedWait": 12,
    "ticketNumber": "B456"
  }
}
```

### Shops

#### Get All Shops

```http
GET /api/shops?location=city_name
Authorization: Bearer <token>
```

#### Get Shop Details

```http
GET /api/shops/:shopId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "456",
    "name": "Fresh Market",
    "location": "Main Street",
    "phone": "+1234567890",
    "hours": {
      "open": "08:00",
      "close": "20:00"
    },
    "queues": ["789", "790"]
  }
}
```

#### Create Shop (Shop Owner only)

```http
POST /api/shops
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Fresh Market",
  "location": "Main Street",
  "phone": "+1234567890",
  "hours": {
    "open": "08:00",
    "close": "20:00"
  }
}
```

#### Update Shop (Shop Owner only)

```http
PUT /api/shops/:shopId
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Fresh Market Updated",
  "phone": "+0987654321"
}
```

### Admin

#### Get System Statistics

```http
GET /api/admin/stats
Authorization: Bearer <admin-token>
```

#### Get All Users

```http
GET /api/admin/users
Authorization: Bearer <admin-token>
```

## Rate Limiting

API endpoints are rate-limited:
- 100 requests per minute per IP
- 1000 requests per hour per user

## Status Codes

- `200 OK` - Successful request
- `201 Created` - Resource created
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing/invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Pagination

Endpoints that return lists support pagination:

```http
GET /api/endpoint?page=1&limit=20
```

Response includes:
```json
{
  "success": true,
  "data": [ /* items */ ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

## Examples

### Using cURL

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'

# Get queues
curl http://localhost:3000/api/queues \
  -H "Authorization: Bearer <token>"

# Join queue
curl -X POST http://localhost:3000/api/queues/789/join \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"userId": "123"}'
```

### Using JavaScript

```javascript
// Register
const response = await fetch('http://localhost:3000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
    name: 'John Doe'
  })
});

const data = await response.json();
console.log(data.data.token);
```

---

For more information or to report issues with the API, contact maintainers.
