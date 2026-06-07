# Testing Guide

Comprehensive guide for testing LineUp.

## Testing Strategy

### Test Pyramid

```
        UI Tests
       /         \
      /           \
   Integration Tests
   /               \
  /                 \
 Unit Tests
```

- **Unit Tests** (70%): Test individual functions/methods
- **Integration Tests** (20%): Test component interactions
- **UI Tests** (10%): Test user interface

## Unit Tests

### Flutter Unit Tests

**Location**: `test/`

**Run tests**:
```bash
flutter test
flutter test test/path/to/test.dart  # Specific test
flutter test --coverage              # With coverage
```

**Example**:
```dart
void main() {
  group('UserService', () {
    late UserService userService;

    setUp(() {
      userService = UserService();
    });

    test('should fetch user successfully', () async {
      // Arrange
      const userId = '123';
      
      // Act
      final user = await userService.getUser(userId);
      
      // Assert
      expect(user.id, equals(userId));
      expect(user.name, isNotEmpty);
    });

    test('should throw on invalid user ID', () {
      // Arrange
      const invalidId = '';
      
      // Act & Assert
      expect(
        () => userService.getUser(invalidId),
        throwsException,
      );
    });
  });
}
```

### Backend Unit Tests

**Location**: `backend/tests/` or `backend/test/`

**Run tests**:
```bash
npm test
npm test -- --watch     # Watch mode
npm test -- --coverage  # Coverage report
```

**Example**:
```javascript
describe('UserService', () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
  });

  it('should fetch user by ID', async () => {
    // Arrange
    const userId = '123';
    
    // Act
    const user = await userService.getUser(userId);
    
    // Assert
    expect(user.id).toBe(userId);
    expect(user.name).toBeDefined();
  });

  it('should throw on invalid ID', () => {
    // Act & Assert
    expect(() => userService.getUser(''))
      .rejects.toThrow();
  });
});
```

## Integration Tests

### Flutter Widget Tests

**Example**:
```dart
void main() {
  group('Login Screen', () => {
    testWidgets('should show login form', (WidgetTester tester) async {
      // Arrange
      await tester.pumpWidget(MaterialApp(
        home: LoginScreen(),
      ));
      
      // Act & Assert
      expect(find.byType(TextField), findsWidgets);
      expect(find.byType(ElevatedButton), findsOneWidget);
    });

    testWidgets('should validate email field', 
      (WidgetTester tester) async {
      // Arrange
      await tester.pumpWidget(MaterialApp(
        home: LoginScreen(),
      ));
      
      // Act
      await tester.enterText(
        find.byType(TextField).first,
        'invalid-email',
      );
      await tester.pumpWidget(MaterialApp(
        home: LoginScreen(),
      ));
      
      // Assert
      expect(find.text('Invalid email'), findsOneWidget);
    });
  });
}
```

### Backend API Tests

**Example**:
```javascript
describe('POST /api/auth/login', () => {
  it('should return token on successful login', async () => {
    // Arrange
    const credentials = {
      email: 'user@example.com',
      password: 'password123'
    };
    
    // Act
    const response = await request(app)
      .post('/api/auth/login')
      .send(credentials);
    
    // Assert
    expect(response.status).toBe(200);
    expect(response.body.data.token).toBeDefined();
  });

  it('should return 401 on invalid credentials', async () => {
    // Act
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'user@example.com',
        password: 'wrongpassword'
      });
    
    // Assert
    expect(response.status).toBe(401);
  });
});
```

## Test Coverage

### Generating Coverage Reports

**Flutter**:
```bash
flutter test --coverage
genhtml coverage/lcov.info -o coverage/html
open coverage/html/index.html
```

**Backend**:
```bash
npm test -- --coverage
```

### Target Coverage

- **Overall**: > 80%
- **Critical paths**: > 90%
- **Utilities**: > 70%

## CI/CD Testing

### GitHub Actions

Tests run automatically on:
- Push to main branch
- Pull requests to main
- Manual trigger

**Workflow location**: `.github/workflows/`

## Best Practices

### Writing Good Tests

1. **Use AAA Pattern**
   - Arrange: Set up test data
   - Act: Execute the code
   - Assert: Verify results

2. **One Assertion Per Test** (when possible)
   ```dart
   // Good
   test('should return user', () {
     expect(user.name, equals('John'));
   });
   
   // Avoid
   test('should return user', () {
     expect(user.name, equals('John'));
     expect(user.email, equals('john@example.com'));
   });
   ```

3. **Descriptive Test Names**
   ```dart
   // Good
   test('should throw ArgumentError when ID is empty', () { });
   
   // Avoid
   test('test1', () { });
   ```

4. **Use Mocks and Stubs**
   ```dart
   // Mock API responses
   when(mockApi.getUser(any))
     .thenAnswer((_) async => User(id: '123'));
   ```

5. **Keep Tests Fast**
   - Avoid real API calls
   - Mock external dependencies
   - Use test data efficiently

### Common Issues

**Problem**: Tests are flaky
**Solution**: 
- Remove timing dependencies
- Use proper async/await
- Mock unpredictable components

**Problem**: Tests are slow
**Solution**:
- Use unit tests instead of integration tests
- Mock external services
- Parallelize test execution

**Problem**: Coverage not increasing
**Solution**:
- Focus on critical paths first
- Add tests for new features
- Refactor for testability

## Testing Checklist

- [ ] All new features have tests
- [ ] All bug fixes have tests
- [ ] Coverage > 80%
- [ ] Tests pass locally
- [ ] Tests pass in CI/CD
- [ ] No flaky tests
- [ ] Tests are fast (< 1 min total)
- [ ] Code follows testing conventions

## Resources

- [Flutter Testing Docs](https://docs.flutter.dev/testing)
- [Jest Documentation](https://jestjs.io/)
- [Testing Best Practices](https://en.wikipedia.org/wiki/Software_testing)
