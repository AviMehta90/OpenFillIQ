/**
 * Application-wide constants
 */

export const APP_NAME = 'OpenFillIQ';
export const APP_VERSION = '0.1.0';

// Storage keys
export const STORAGE_KEYS = {
  PROFILES: 'openfilliq_profiles',
  ACTIVE_PROFILE_ID: 'openfilliq_active_profile_id',
  SETTINGS: 'openfilliq_settings',
  VERSION: 'openfilliq_version',
} as const;

// Default settings
export const DEFAULT_SETTINGS = {
  enabled: true,
  showInlineButton: true,
  autoDetectForms: true,
  confidenceThreshold: 0.6,
};

// Encryption configuration
export const ENCRYPTION_CONFIG = {
  algorithm: 'AES',
  keySize: 256,
  iterations: 10000,
};

// Performance thresholds (in milliseconds)
export const PERFORMANCE = {
  FIELD_DETECTION_THRESHOLD: 30,
  AUTOFILL_THRESHOLD: 20,
  MAX_MUTATION_DELAY: 500,
} as const;

// UI configuration
export const UI_CONFIG = {
  BUTTON_ID: 'openfilliq-autofill-button',
  BUTTON_CLASS: 'openfilliq-btn',
  OVERLAY_CLASS: 'openfilliq-overlay',
} as const;

// Field confidence thresholds
export const CONFIDENCE = {
  HIGH: 0.8,
  MEDIUM: 0.6,
  LOW: 0.4,
} as const;
