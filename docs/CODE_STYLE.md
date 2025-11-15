# Code Style Guide

This document describes the code formatting and linting setup for OpenFillIQ.

## Automated Formatting

All code is automatically formatted using **Prettier** and linted using **ESLint**.

### Configuration Files

- **`.prettierrc`** - Prettier configuration
- **`.eslintrc.json`** - ESLint rules
- **`.vscode/settings.json`** - VS Code editor settings

## Prettier Rules

```json
{
  "semi": true, // Always use semicolons
  "trailingComma": "es5", // Trailing commas where valid in ES5
  "singleQuote": true, // Use single quotes instead of double
  "printWidth": 100, // Max line length of 100 characters
  "tabWidth": 2, // 2 spaces for indentation
  "useTabs": false, // Use spaces, not tabs
  "arrowParens": "always", // Always include parens in arrow functions
  "endOfLine": "lf" // Unix line endings (LF)
}
```

## ESLint Rules

Key rules:

- TypeScript strict mode enabled
- `@typescript-eslint/no-explicit-any`: warn (avoid `any` type)
- `@typescript-eslint/no-unused-vars`: off (TypeScript handles this)
- `no-console`: warn (except in `logger.ts` where it's allowed)
- Prettier integration enabled

## VS Code Integration

### Auto-Format on Save

When you press **Cmd+S** (Mac) or **Ctrl+S** (Windows/Linux), the file will automatically:

1. **Format** using Prettier
2. **Fix** ESLint issues
3. **Save** the file

### Auto-Save Behavior

- **Auto-save**: Enabled on focus change
- Files auto-save when you switch tabs or windows
- Formatting is applied on every save (manual or automatic)

### Supported File Types

The following file types are auto-formatted:

- TypeScript (`.ts`, `.tsx`)
- JavaScript (`.js`, `.jsx`)
- JSON (`.json`)
- CSS (`.css`)
- HTML (`.html`)

## Running Formatters Manually

### Format All Files

```bash
npm run format
```

This will format all files in the `src/` directory.

### Check Formatting

```bash
npm run format:check
```

This checks if all files are formatted correctly without modifying them.

### Fix Linting Issues

```bash
npm run lint:fix
```

This automatically fixes ESLint issues where possible.

### Run All Checks

```bash
npm run validate
```

This runs:

1. TypeScript type checking
2. ESLint linting
3. Prettier format checking

## Best Practices

### 1. Let the Tools Do the Work

Don't worry about formatting while writing code. The tools will format it automatically on save.

### 2. Commit Formatted Code

Always ensure code is formatted before committing:

```bash
npm run validate
```

If this passes, your code is ready to commit.

### 3. Consistent Naming

- **Files**: `camelCase.ts` or `PascalCase.tsx` for components
- **Variables/Functions**: `camelCase`
- **Types/Interfaces**: `PascalCase`
- **Constants**: `UPPER_SNAKE_CASE` or `camelCase` for config objects

### 4. Import Order

Organize imports in this order:

1. External libraries (e.g., `crypto-js`)
2. Internal absolute imports (e.g., `@common/types`)
3. Relative imports (e.g., `./utils`)

Example:

```typescript
import CryptoJS from 'crypto-js';

import { createLogger } from '@common/logger';
import type { UserProfile } from '@common/types';

import { helperFunction } from './utils';
```

### 5. Type Annotations

Always use explicit return types for exported functions:

```typescript
// Good
export function saveProfile(profile: UserProfile): Promise<void> {
  // ...
}

// Avoid
export function saveProfile(profile: UserProfile) {
  // ...
}
```

### 6. Comments

Use JSDoc comments for exported functions and classes:

```typescript
/**
 * Encrypts a user profile for secure storage
 * @param profile - The user profile to encrypt
 * @returns The encrypted profile string
 */
export async function encryptProfile(profile: UserProfile): Promise<string> {
  // ...
}
```

### 7. Error Handling

Always handle errors explicitly:

```typescript
try {
  await saveProfile(profile);
} catch (error) {
  logger.error('Failed to save profile:', error);
  throw new Error('Profile save failed');
}
```

## Git Hooks (Optional)

Consider adding pre-commit hooks with Husky to automatically validate code before commits:

```bash
npm install --save-dev husky lint-staged
```

This ensures all committed code is properly formatted and linted.

## Troubleshooting

### Files Not Formatting

1. **Check VS Code extensions**: Ensure Prettier and ESLint extensions are installed
2. **Reload VS Code**: Sometimes a reload is needed after installing extensions
3. **Check file type**: Ensure the file extension is supported
4. **Run manually**: Try `npm run format` to see error messages

### ESLint Errors

If you see ESLint errors:

1. Try auto-fix: `npm run lint:fix`
2. Check the `.eslintrc.json` for rules
3. Some errors must be fixed manually

### Type Errors

If TypeScript complains:

1. Run `npm run type-check` to see all errors
2. Ensure types are imported correctly
3. Check `tsconfig.json` for configuration

## Documentation Style

### Markdown Files

When writing documentation (README, guides, etc.):

- **No emojis** - Keep documentation professional and text-based
- Use **bold** for emphasis instead of emojis
- Use standard markdown headers (##, ###)
- Include code blocks with proper syntax highlighting
- Use lists for clarity
- Keep line length reasonable (100-120 characters)

### Comments in Code

- Use clear, descriptive comments
- Explain "why", not "what" (code should be self-explanatory)
- Use JSDoc for exported functions
- No emojis in code comments

## Questions?

If you have questions about code style, check:

1. This document
2. Existing code in the repository
3. Open an issue for clarification

---

**Remember**: The goal is consistency, not perfection. Let the tools handle formatting so you can focus on writing great code!
