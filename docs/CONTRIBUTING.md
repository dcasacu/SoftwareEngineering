# Contributing to LineUp

Thank you for interest in contributing to LineUp! This document outlines the process and guidelines.

## Code of Conduct

- Be respectful and constructive
- Welcome diverse perspectives
- Focus on the code, not the person
- Help each other learn and grow

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Create a new branch for your feature/fix
4. Make your changes
5. Test thoroughly
6. Submit a pull request

See [SETUP.md](./SETUP.md) for detailed installation instructions.

## Development Process

### 1. Create an Issue (for major changes)

Before starting work on a major feature or fix:
1. Check existing issues to avoid duplicates
2. Create an issue describing the problem/feature
3. Wait for feedback from maintainers

### 2. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

**Branch naming:**
- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `refactor/description` - Code refactoring
- `docs/description` - Documentation updates

### 3. Make Your Changes

- Follow [CODE_STYLE.md](./CODE_STYLE.md)
- Write clear, descriptive commit messages
- Add tests for new functionality
- Update documentation as needed

### 4. Test Your Changes

```bash
# Run all tests
flutter test

# Run specific test file
flutter test test/path/to/test.dart

# Check code style
flutter analyze

# Backend tests (if applicable)
cd LineUp_FullStack && npm test
```

### 5. Commit Your Changes

```bash
git add .
git commit -m "feat: Add new feature description"
```

**Commit message format:**
```
<type>: <short description>

<optional longer description>

Closes #<issue-number>
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `test` - Test additions/changes
- `refactor` - Code refactoring
- `chore` - Build/dependency changes

### 6. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 7. Create a Pull Request

1. Go to GitHub and create a PR
2. Fill out the PR template
3. Link related issues with "Closes #123"
4. Describe what your PR does
5. Include screenshots/videos if UI changes
6. Wait for review

## PR Checklist

Before submitting a PR, ensure:

- [ ] Code follows [CODE_STYLE.md](./CODE_STYLE.md)
- [ ] All tests pass (`flutter test`, `npm test`)
- [ ] Code analysis is clean (`flutter analyze`)
- [ ] New features include tests
- [ ] Documentation is updated
- [ ] No merge conflicts
- [ ] PR description is clear
- [ ] Related issues are linked
- [ ] No debug prints/console logs left

## Types of Contributions

### Bug Reports

Include:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/videos
- Your environment (OS, device, etc.)

### Feature Requests

Include:
- Clear description of the feature
- Why it's needed
- How it should work
- Any related existing features

### Documentation

- Fix typos
- Clarify confusing sections
- Add examples
- Translate (if multilingual)

### Code

- New features
- Bug fixes
- Performance improvements
- Code refactoring

## Review Process

### What Reviewers Look For

1. **Functionality** - Does it work as intended?
2. **Code Quality** - Is it clean and maintainable?
3. **Tests** - Are there adequate tests?
4. **Documentation** - Is it documented?
5. **Style** - Does it follow guidelines?
6. **Performance** - Any performance concerns?

### Addressing Feedback

1. Read reviewer comments carefully
2. Ask clarifying questions if needed
3. Make requested changes
4. Push new commits (don't force push)
5. Comment when ready for re-review

## Merging

PRs are merged when:
- [ ] At least 1 approval from maintainer
- [ ] All tests pass
- [ ] Code review complete
- [ ] Documentation updated
- [ ] No merge conflicts

## Questions?

- Check [FAQ.md](./FAQ.md)
- Review [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- Open an issue for discussion
- Ask in GitHub Discussions

## Recognition

All contributors will be:
- Listed in the project
- Credited in releases
- Thanked publicly

---

**Thank you for contributing to LineUp!** 🎉
