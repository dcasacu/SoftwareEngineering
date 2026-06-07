# Troubleshooting Guide

Solutions to common problems in LineUp development.

## Installation Issues

### Flutter Installation Problems

**Problem: "Flutter not found" or command not recognized**

*Solution:*
```bash
# Verify Flutter is installed
which flutter

# Add to PATH (add to ~/.bashrc or ~/.zshrc)
export PATH="$PATH:[path-to-flutter]/bin"

# Reload shell
source ~/.bashrc
```

**Problem: `flutter doctor` shows errors**

*Solution:*
```bash
# Follow recommendations from flutter doctor
flutter doctor

# Accept Android licenses
flutter doctor --android-licenses

# Install missing components
flutter config --enable-android  # For Android
flutter config --enable-web      # For Web
```

### Node.js / npm Issues

**Problem: "npm command not found"**

*Solution:*
- Download Node.js from https://nodejs.org/
- Verify installation: `node --version && npm --version`

**Problem: Permission denied errors**

*Solution:*
```bash
# Linux/macOS
sudo npm install -g npm

# Or use nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

## Build Issues

### Flutter Build Failures

**Problem: "Gradle build failed"**

*Solution:*
```bash
flutter clean
cd android
./gradlew clean
cd ..
flutter pub get
flutter run
```

**Problem: "AAPT: error while executing aapt dump badging"**

*Solution:*
```bash
flutter clean
flutter pub get
flutter run
```

**Problem: "MissingPluginException"**

*Solution:*
```bash
flutter clean
flutter pub get
flutter run
```

### Backend Build Issues

**Problem: "npm ERR! peer dep missing"**

*Solution:*
```bash
npm install --legacy-peer-deps
```

**Problem: Port already in use**

*Solution:*
```bash
# macOS/Linux
lsof -i :3000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
PORT=3001 npm start
```

## Runtime Issues

### App Won't Start

**Problem: App crashes immediately**

*Solution:*
1. Check console for error message
2. Verify all dependencies installed: `flutter pub get`
3. Try different device/emulator
4. Clear data: `flutter run --no-fast-start`

**Problem: Blank white screen**

*Solution:*
```bash
flutter run --verbose  # Check logs
flutter clean
flutter run
```

### Backend Won't Start

**Problem: "Cannot find module"**

*Solution:*
```bash
rm -rf node_modules package-lock.json
npm install
```

**Problem: ENOENT errors**

*Solution:*
```bash
# Verify environment file
ls -la .env

# Create if missing
cp .env.example .env
```

## Network Issues

**Problem: API calls timing out**

*Solution:*
1. Verify backend is running: `npm start`
2. Check API URL in frontend
3. Test manually with Postman
4. Verify network connectivity
5. Check if on same network/localhost

**Problem: CORS errors**

*Solution:*
- Backend should include CORS headers
- Check CORS middleware configuration
- Verify API URL matches

## Device/Emulator Issues

**Problem: No devices found**

*Solution:*
```bash
flutter devices  # List available

# Create Android emulator
flutter emulators --create --name MyEmulator

# Run emulator
flutter emulators --launch MyEmulator
```

**Problem: Device offline**

*Solution:*
```bash
# Reconnect
adb devices
adb kill-server
adb start-server
```

**Problem: Permissions denied on device**

*Solution:*
```bash
adb shell pm grant com.example.app android.permission.CAMERA
```

## Database Issues

**Problem: "Connection refused"**

*Solution:*
- Verify database is running
- Check connection string in `.env`
- Verify credentials
- Check firewall rules

**Problem: "Authentication failed"**

*Solution:*
- Verify database credentials
- Check if database user exists
- Reset password if needed
- Check user permissions

## Performance Issues

**Problem: App is slow or laggy**

*Solution:*
```bash
# Profile with DevTools
flutter pub global activate devtools
flutter pub global run devtools

# Check for:
# - Excessive rebuilds
# - Memory leaks
# - Slow network requests
# - Large images/assets
```

**Problem: High memory usage**

*Solution:*
- Check for memory leaks
- Dispose resources properly
- Limit image sizes
- Clear caches

## Testing Issues

**Problem: Tests fail**

*Solution:*
```bash
flutter test --verbose  # See detailed output
flutter test test/path/to/test.dart  # Run specific test
```

**Problem: "Test timeout"**

*Solution:*
```dart
test('name', () async {
  // test code
}, timeout: Timeout(Duration(seconds: 30)));
```

## General Troubleshooting

### Check Logs

```bash
# Flutter verbose output
flutter run -v

# Backend console logs
node --inspect server.js

# Check specific logs
cd LineUp_FullStack && tail -f logs/app.log
```

### Clear Everything

```bash
# Nuclear option - clean all caches
flutter clean
rm -rf pubspec.lock
flutter pub get

# Backend
rm -rf node_modules package-lock.json
npm install
```

### Get Help

1. Check [FAQ.md](./FAQ.md)
2. Review [DEVELOPMENT.md](./DEVELOPMENT.md)
3. Search existing issues
4. Open a new issue with:
   - Error message
   - Steps to reproduce
   - Environment (OS, versions, etc.)
   - Logs/screenshots

## Still Stuck?

- Open an issue on GitHub
- Ask in GitHub Discussions
- Contact maintainers
- Check project documentation
