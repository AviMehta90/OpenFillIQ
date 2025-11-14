# Development Guide

This guide will help you get started with OpenFillIQ development.

## Initial Setup

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/AviMehta90/openFillIQ.git
cd openFillIQ

# Install dependencies
npm install
```

### 2. Create Icon Placeholders

For development, you need placeholder icons. You can:

**Option A**: Use any PNG images (16x16, 32x32, 48x48, 128x128) and place them in `public/icons/` with names:

- `icon-16.png`
- `icon-32.png`
- `icon-48.png`
- `icon-128.png`

**Option B**: Generate simple colored squares using an online tool like:

- https://www.genericons.com/
- https://placeholder.com/
- Or use Photoshop/Figma

### 3. Build the Extension

```bash
# Development build (with watch mode)
npm run dev

# Production build
npm run build
```

The built extension will be in the `dist/` folder.

### 4. Load in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `dist/` folder from this project

### 5. Test the Extension

- Click the extension icon in the toolbar to open the popup
- Right-click the icon → Options to open the settings page
- Visit any website with a form to test form detection

## Development Workflow

### Watch Mode

```bash
npm run dev
```

This will rebuild the extension automatically when you make changes. You'll need to:

1. Save your changes
2. Go to `chrome://extensions/`
3. Click the refresh icon on the OpenFillIQ extension

### Testing

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm test -- --coverage
```

### Code Quality

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Type check
npm run type-check
```

## Project Structure Overview

```
src/
├── common/          # Shared utilities and types
│   ├── types.ts     # TypeScript interfaces and types
│   ├── constants.ts # App-wide constants
│   ├── logger.ts    # Logging utility
│   └── crypto.ts    # Encryption utilities
│
├── background/      # Background service worker
│   └── index.ts     # Message handling, storage coordination
│
├── content/         # Content scripts (runs on web pages)
│   └── index.ts     # Form detection, autofill injection
│
├── popup/           # Extension popup UI
│   ├── popup.html
│   ├── popup.css
│   └── popup.ts
│
└── options/         # Settings/options page
    ├── options.html
    ├── options.css
    └── options.ts
```

## Next Implementation Steps

### Phase 2: Core Infrastructure (Current Phase)

1. **Storage Service** (`src/background/storageService.ts`)
   - Implement profile storage with encryption
   - Add get/set/update methods
   - Handle settings persistence

2. **Message Passing** (`src/common/messaging.ts`)
   - Create helper functions for message sending
   - Type-safe message handlers
   - Request/response patterns

3. **Testing Setup**
   - Create test fixtures
   - Set up browser API mocks
   - Write first unit tests

### Phase 3: Form Detection & Classification

1. **Form Detector** (`src/content/formDetector.ts`)
   - Scan DOM for form fields
   - Extract field metadata
   - Handle dynamic forms with MutationObserver

2. **Field Classifier** (`src/content/classifier.ts`)
   - Implement heuristic rules
   - Confidence scoring
   - Pattern matching for field types

### Phase 4: Autofill Engine

1. **Autofill Engine** (`src/content/autofillEngine.ts`)
   - Fill fields with profile data
   - Trigger synthetic events
   - Handle edge cases
   - Undo functionality

### Phase 5: UI Enhancement

1. **Inline Button** (`src/content/uiInjector.ts`)
   - Detect forms and inject button
   - Position button appropriately
   - Handle clicks and trigger autofill

2. **Profile Management UI**
   - Connect forms to storage
   - Validate inputs
   - Export/import functionality

## Debugging Tips

### Console Logging

- Background worker logs: Open `chrome://extensions/` → Details → Inspect views: "service worker"
- Content script logs: Open DevTools on any webpage (F12)
- Popup logs: Right-click extension icon → Inspect popup

### Common Issues

**Extension not loading:**

- Check manifest.json syntax
- Verify all files referenced in manifest exist
- Check build output for errors

**Content script not running:**

- Check URL matches in manifest.json
- Verify permissions are granted
- Check browser console for errors

**Storage not persisting:**

- Check chrome.storage API usage
- Verify encryption/decryption works
- Check for quota exceeded errors

## Resources

- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/mv3/)
- [Manifest V3 Migration](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/)
- [Vitest Documentation](https://vitest.dev/)

## Need Help?

- Check the documentation in `docs/`
- Review the SRS for requirements
- Open an issue on GitHub
- Review existing code comments

---

Happy coding! 🚀
