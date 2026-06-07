# Code Style Guide

Coding standards and conventions for the LineUp project.

## General Principles

- **Readability**: Code should be easy to understand
- **Consistency**: Follow established patterns
- **Simplicity**: Keep code simple and maintainable
- **Documentation**: Document complex logic
- **Testing**: Write testable code

## Dart/Flutter Guidelines

### File Organization

```dart
// 1. Imports
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

// 2. Constants
const String APP_NAME = 'LineUp';
const Duration ANIMATION_DURATION = Duration(milliseconds: 300);

// 3. Class definition
class MyWidget extends StatefulWidget {
  // Implementation
}

class _MyWidgetState extends State<MyWidget> {
  // Implementation
}
```

### Naming Conventions

```dart
// Classes: PascalCase
class UserProfile { }

// Variables & functions: camelCase
String userName;
Void calculateTotal() { }

// Constants: lowercase with underscores or UPPER_CASE
const String apiUrl = 'https://api.example.com';
const int MAX_RETRIES = 3;

// Private members: prefix with underscore
String _privateVariable;
void _privateMethod() { }

// Boolean getters/methods: prefix with 'is', 'has', 'can'
bool isValid() { }
bool hasPermission() { }
bool canProcess() { }
```

### Widget Structure

```dart
class MyWidget extends StatelessWidget {
  final String title;
  final VoidCallback onPressed;

  const MyWidget({
    required this.title,
    required this.onPressed,
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: Center(
        child: ElevatedButton(
          onPressed: onPressed,
          child: Text('Press me'),
        ),
      ),
    );
  }
}
```

### Use const Constructors

```dart
// Good
const SizedBox(height: 16);
const Text('Hello');

// Avoid
SizedBox(height: 16);
Text('Hello');
```

### Formatting

```dart
// Max line length: 80 characters
// Use 2-space indentation

// Format with `flutter format`
flutter format lib/
```

## JavaScript/Node.js Guidelines

### File Organization

```javascript
// 1. Imports
const express = require('express');
const mongoose = require('mongoose');

// 2. Constants
const API_PORT = 3000;
const DB_NAME = 'lineup';

// 3. Middleware
app.use(express.json());

// 4. Routes
app.use('/api/users', userRoutes);

// 5. Error handling
app.use(errorHandler);
```

### Naming Conventions

```javascript
// Classes: PascalCase
class UserController { }

// Functions & variables: camelCase
function calculateTotal() { }
let userName = 'John';

// Constants: UPPER_CASE
const MAX_RETRIES = 3;
const API_BASE_URL = 'https://api.example.com';

// Private methods: prefix with underscore
_validateInput() { }

// Boolean functions: prefix with 'is', 'has', 'can'
function isValid() { }
function hasPermission() { }
function canProcess() { }
```

### Function Style

```javascript
// Use arrow functions for callbacks
array.map(item => item * 2);
array.forEach(item => console.log(item));

// Use async/await
async function fetchData() {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
  }
}

// Avoid callbacks
// Bad
fetchData((err, data) => { });

// Good
try {
  const data = await fetchData();
} catch (err) { }
```

### Formatting

```javascript
// Use 2-space indentation
// Max line length: 80 characters

// Format with eslint/prettier
npm run format

// Line breaks
if (condition) {
  // code
}
```

## Comments & Documentation

### Dart

```dart
/// Single line documentation comment
/// 
/// Multi-line documentation with
/// more details about the function.
/// 
/// Returns: Description of return value
String getUserName() => _userName;

// Use comments for complex logic
if (value > 100) {
  // Only process values above 100
  process(value);
}
```

### JavaScript

```javascript
/**
 * Single line documentation
 * 
 * @param {string} userId - User identifier
 * @return {Promise<User>} User object
 */
async function getUser(userId) { }

// Inline comments for complex logic
if (value > 100) {
  // Only process values above 100
  process(value);
}
```

## Error Handling

### Dart

```dart
try {
  await fetchData();
} catch (e) {
  print('Error: $e');
  // Handle error appropriately
} finally {
  // Cleanup if needed
}
```

### JavaScript

```javascript
try {
  await fetchData();
} catch (error) {
  console.error('Error:', error);
  // Handle error appropriately
} finally {
  // Cleanup if needed
}
```

## Testing

### Dart Tests

```dart
void main() {
  group('UserService', () {
    test('should return user by id', () async {
      // Arrange
      const userId = '123';
      
      // Act
      final user = await userService.getUser(userId);
      
      // Assert
      expect(user.id, equals(userId));
    });
  });
}
```

### JavaScript Tests

```javascript
describe('UserController', () => {
  it('should return user by id', async () => {
    // Arrange
    const userId = '123';
    
    // Act
    const user = await userController.getUser(userId);
    
    // Assert
    expect(user.id).toBe(userId);
  });
});
```

## Code Review Checklist

- [ ] Code follows naming conventions
- [ ] Code is formatted properly
- [ ] No debug prints/console.logs left
- [ ] Error handling is implemented
- [ ] Code is documented
- [ ] Tests are included
- [ ] No hardcoded values
- [ ] No unused imports
- [ ] Variable names are descriptive
- [ ] Functions are reasonably sized
