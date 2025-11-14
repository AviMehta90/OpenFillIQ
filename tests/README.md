# Tests

This directory contains unit and integration tests for OpenFillIQ.

## Test Structure

```
tests/
├── unit/              # Unit tests for individual modules
│   ├── common/       # Tests for common utilities
│   ├── content/      # Tests for content scripts
│   └── background/   # Tests for background worker
├── integration/      # Integration tests
└── fixtures/         # Test fixtures and mock data
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run tests with UI
npm run test:ui
```

## Writing Tests

- Use Vitest for testing framework
- Follow AAA pattern (Arrange, Act, Assert)
- Mock browser APIs using test utilities
- Keep tests isolated and independent
- Test edge cases and error conditions

## Test Coverage Goals

- Core utilities: 90%+
- Field detection: 85%+
- Classification engine: 85%+
- Autofill logic: 80%+
