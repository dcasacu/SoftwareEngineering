# Development Guide

Guidelines for developing LineUp features and improvements.

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

Branch naming convention:
- `feature/` for new features
- `bugfix/` for bug fixes
- `docs/` for documentation
- `refactor/` for code refactoring

### 2. Make Your Changes

Follow the [CODE_STYLE.md](./CODE_STYLE.md) guidelines.

### 3. Test Your Changes

```bash
# Flutter tests
flutter test

# Backend tests (if configured)
cd backend && npm test
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: Add feature description"
```

Follow conventional commits:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation
- `refactor:` for code changes that don't change functionality
- `test:` for adding tests
- `chore:` for maintenance tasks

### 5. Push and Create a Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with a clear description.

## Local Development Setup

### Starting Development Environment

```bash
# Terminal 1: Backend
cd LineUp_FullStack
npm install
npm start

# Terminal 2: Frontend
cd LineUp_FullStack
flutter pub get
flutter run -d <device-id>
```

### Development Tips

1. **Hot Reload**: Press `R` in Flutter terminal to reload changes
2. **Hot Restart**: Press `r` for a full restart
3. **Backend Logs**: Watch server logs for debugging
4. **DevTools**: Use Flutter DevTools for debugging

```bash
flutter pub global activate devtools
flutter pub global run devtools
```

## Feature Development

### Frontend (Flutter/Dart)

1. **Create Screen/Widget**
   ```
   lib/
   ├── screens/
   │   └── my_new_screen.dart
   ├── widgets/
   │   └── my_custom_widget.dart
   └── services/
       └── api_service.dart
   ```

2. **Update State Management**
   - Add provider/BLoC
   - Update state models
   - Connect to UI

3. **Add API Integration**
   - Define API endpoint
   - Handle responses
   - Error handling

### Backend (Node.js/Express)

1. **Create Route**
   ```javascript
   // routes/myFeature.js
   router.post('/endpoint', controller.handleRequest);
   ```

2. **Create Controller**
   ```javascript
   // controllers/myFeatureController.js
   exports.handleRequest = async (req, res) => { };
   ```

3. **Create Service** (if needed)
   ```javascript
   // services/myFeatureService.js
   exports.businessLogic = async () => { };
   ```

4. **Add Tests**
   ```javascript
   // tests/myFeature.test.js
   ```

## Debugging

### Flutter Debugging

1. **DevTools**
   ```bash
   flutter pub global activate devtools
   flutter pub global run devtools
   ```

2. **Print Debugging**
   ```dart
   print('Debug message: $variable');
   ```

3. **Breakpoints**
   - Set breakpoints in VS Code/Android Studio
   - Use `flutter run` to debug

### Backend Debugging

1. **Logging**
   ```javascript
   console.log('Debug:', variable);
   ```

2. **Node Debugger**
   ```bash
   node --inspect-brk server.js
   ```

3. **Postman**: Test API endpoints

## Code Review Process

1. **Submit PR** with clear description
2. **Automated Tests** run automatically
3. **Peer Review** - wait for team feedback
4. **Address Comments** - make requested changes
5. **Merge** - once approved

## Performance Optimization

### Flutter
- Use `const` constructors
- Implement `shouldRebuild()` properly
- Avoid rebuilding entire widget trees
- Profile with DevTools

### Backend
- Index database queries
- Implement caching
- Use async/await properly
- Monitor response times

## Common Tasks

### Adding a New API Endpoint

1. Add route in backend
2. Add controller method
3. Add service logic
4. Add tests
5. Document endpoint
6. Update frontend API service
7. Create frontend screen/widget
8. Add state management
9. Test integration

### Fixing a Bug

1. Create `bugfix/` branch
2. Write a test that reproduces the bug
3. Fix the bug
4. Verify test passes
5. Create PR with detailed explanation

### Improving Performance

1. Profile the application
2. Identify bottlenecks
3. Implement optimization
4. Measure improvement
5. Document changes

## Documentation

Always document:
- New features
- API endpoints
- Complex logic
- Breaking changes
- Setup instructions
