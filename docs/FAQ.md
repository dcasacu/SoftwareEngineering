# Frequently Asked Questions

## Setup & Installation

### Q: I'm getting "Flutter not found" error
**A:** Make sure Flutter is installed and added to your PATH.
```bash
flutter --version  # Check if installed
export PATH="$PATH:[path-to-flutter]/bin"  # Add to PATH
```

### Q: How do I use a different device/emulator?
**A:** 
```bash
flutter devices  # List available devices
flutter run -d <device-id>  # Run on specific device
```

### Q: Backend won't start - Port 3000 already in use
**A:**
```bash
# Find process using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill the process or use different port
npm start -- --port 3001
```

## Development

### Q: How do I hot reload changes?
**A:** Press `R` in the Flutter terminal. For full restart, press `r`.

### Q: My changes aren't showing up
**A:** 
- Try hot restart: `r`
- Clear cache: `flutter clean`
- Rebuild: `flutter pub get && flutter run`

### Q: How do I debug the backend?
**A:**
```bash
node --inspect server.js  # Start with debugger
# Open chrome://inspect in Chrome
```

### Q: How do I run tests?
**A:**
```bash
flutter test  # Run all Flutter tests
flutter test test/path/to/test.dart  # Run specific test
npm test  # Run backend tests
```

## Common Issues

### Q: Getting "gradle build failed"
**A:**
```bash
flutter clean
flutter pub get
flutter run  # Try again
```

### Q: API calls timing out
**A:**
- Check if backend is running: `npm start`
- Verify correct API URL in frontend
- Check network connectivity
- Increase timeout in API client

### Q: App crashes on startup
**A:**
- Check Flutter console for error messages
- Verify all dependencies are installed: `flutter pub get`
- Try on a different device/emulator
- Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

### Q: Database connection errors
**A:**
- Verify database credentials in `.env`
- Check if database service is running
- Verify connection string format
- Check firewall rules

## Git & GitHub

### Q: How do I create a pull request?
**A:**
1. Create a feature branch: `git checkout -b feature/name`
2. Make changes and commit: `git commit -m "message"`
3. Push: `git push origin feature/name`
4. Go to GitHub and click "Create Pull Request"

### Q: I made a mistake in my last commit
**A:**
```bash
git commit --amend  # Modify last commit
git commit --amend --no-edit  # Add to last commit
```

### Q: How do I sync with the main branch?
**A:**
```bash
git fetch origin
git rebase origin/main
# or
git merge origin/main
```

## Project Structure

### Q: Where do I put new features?
**A:**
- Flutter screens: `lib/screens/`
- Flutter widgets: `lib/widgets/`
- Backend routes: `backend/routes/`
- Backend controllers: `backend/controllers/`

### Q: Where are tests located?
**A:**
- Flutter tests: `test/`
- Backend tests: `backend/test/` or `backend/tests/`

## Best Practices

### Q: What's the branching strategy?
**A:**
- `main` - Production-ready code
- `develop` - Integration branch (if used)
- `feature/` - New features
- `bugfix/` - Bug fixes

### Q: How should I name variables?
**A:**
- camelCase for variables and functions
- PascalCase for classes
- UPPER_CASE for constants
- Descriptive names (avoid single letters except loops)

### Q: Do I need to write tests?
**A:** Yes! Tests for:
- New features
- Bug fixes
- Complex logic
- API integration

## Performance

### Q: How can I improve app performance?
**A:**
- Use `const` constructors in Flutter
- Implement proper state management
- Cache API responses
- Lazy load data
- Profile with DevTools

### Q: Why is the app slow?
**A:**
- Check for excessive rebuilds
- Verify efficient database queries
- Check for memory leaks
- Monitor network requests
- Use Flutter DevTools to profile

## Deployment

### Q: How do I build for production?
**A:**
```bash
# Android
flutter build apk --release
flutter build appbundle --release

# iOS
flutter build ios --release

# Web
flutter build web --release
```

### Q: How do I deploy the backend?
**A:** See deployment documentation or contact maintainers.

## Still Need Help?

- Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- Review [DEVELOPMENT.md](./DEVELOPMENT.md)
- Open an issue on GitHub
- Ask in GitHub Discussions
