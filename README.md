# OpenFillIQ

**Universal, intelligent form-filling browser extension with local-first architecture**

[![GitHub Repository](https://img.shields.io/badge/GitHub-AviMehta90%2FopenFillIQ-blue?style=flat-square&logo=github)](https://github.com/AviMehta90/openFillIQ)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](./LICENSE)
[![Status](https://img.shields.io/badge/Status-In%20Development-orange?style=flat-square)](./docs/PROJECT_STATUS.md)

## 🎯 Overview

OpenFillIQ is a privacy-first browser extension that provides one-click autofill for any web form. Unlike traditional autofill tools, OpenFillIQ uses intelligent field detection and classification to work reliably across diverse form structures while keeping all data encrypted and stored locally.

## ✨ Features (MVP)

- 🎯 **Universal Form Detection** - Automatically detects forms across any website
- 🧠 **Intelligent Field Classification** - Uses heuristic rules to identify field types
- 🔒 **Local-First & Encrypted** - All data stored locally with AES-256 encryption
- ⚡ **One-Click Autofill** - Populate entire forms with a single click
- 🎨 **Clean UI** - Minimalist popup and settings interface
- 🔄 **Undo Support** - Revert autofilled values if needed

## 📁 Project Structure

```
OpenFillIQ/
├── docs/                     # Documentation
│   ├── PRD.md               # Product Requirements
│   ├── PS.md                # Problem Statement
│   └── SRS.md               # Software Requirements
├── public/                   # Static assets
│   ├── manifest.json        # Extension manifest (V3)
│   └── icons/               # Extension icons
├── src/
│   ├── common/              # Shared utilities
│   │   ├── types.ts         # TypeScript definitions
│   │   ├── constants.ts     # App constants
│   │   ├── logger.ts        # Logging utility
│   │   └── crypto.ts        # Encryption utilities
│   ├── background/          # Background service worker
│   │   └── index.ts         # Message handling & storage
│   ├── content/             # Content scripts
│   │   └── index.ts         # Form detection & autofill
│   ├── popup/               # Extension popup
│   │   ├── popup.html
│   │   ├── popup.css
│   │   └── popup.ts
│   └── options/             # Settings page
│       ├── options.html
│       ├── options.css
│       └── options.ts
├── tests/                   # Test files
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Chrome/Chromium browser (Firefox support coming soon)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/AviMehta90/openFillIQ.git
   cd openFillIQ
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Build the extension**

   ```bash
   npm run build
   ```

4. **Load in Chrome**
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist/` folder

### Development

```bash
# Run in watch mode
npm run dev

# Run tests
npm test

# Run linter
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

## 🏗️ Architecture

### Components

1. **Content Script** - Runs on web pages to detect forms and inject UI
2. **Background Worker** - Handles storage, encryption, and message coordination
3. **Popup UI** - Quick access to status and profile management
4. **Options Page** - Full profile editing and settings

### Data Flow

```
Web Page → Content Script → Background Worker → Storage (Encrypted)
                ↓                    ↑
          User Interaction    Message Passing
```

## 🔐 Security

- **Zero external requests** - All processing happens locally
- **AES-256 encryption** - Profile data encrypted at rest
- **No telemetry** - We don't track anything
- **Open source** - Code is transparent and auditable

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm test -- --coverage
```

## 📝 Development Roadmap

See the main conversation for detailed phase breakdown:

- ✅ Phase 1: Project Setup
- ⏳ Phase 2: Core Infrastructure
- ⏳ Phase 3: Form Detection & Classification
- ⏳ Phase 4: Autofill Engine
- ⏳ Phase 5: User Interface
- ⏳ Phase 6: Integration & Testing
- ⏳ Phase 7: Polish & Launch

## 🤝 Contributing

This is currently in active development. Contributions welcome after MVP release.

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

Built with:

- TypeScript
- Vite
- crypto-js
- Chrome Extension APIs (Manifest V3)

---

**Status**: 🚧 In Development - MVP Phase
