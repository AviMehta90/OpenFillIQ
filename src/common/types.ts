/**
 * Core type definitions for OpenFillIQ
 */

// ============================================================================
// Profile & User Data Types
// ============================================================================

export interface UserProfile {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
  data: ProfileData;
}

export interface ProfileData {
  // Personal Information
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;

  // Address Information
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;

  // Additional fields (extensible)
  [key: string]: string | undefined;
}

// ============================================================================
// Field Detection Types
// ============================================================================

export interface DetectedField {
  element: HTMLElement;
  type: FieldType;
  metadata: FieldMetadata;
  classification?: FieldClassification;
}

export type FieldType = 'input' | 'textarea' | 'select';

export interface FieldMetadata {
  id?: string;
  name?: string;
  className?: string;
  type?: string;
  placeholder?: string;
  ariaLabel?: string;
  labelText?: string;
  surroundingText?: string;
  autocomplete?: string;
}

export interface FieldClassification {
  fieldName: FieldName;
  confidence: number;
  matchedRule: string;
}

export type FieldName =
  | 'firstName'
  | 'lastName'
  | 'fullName'
  | 'email'
  | 'phone'
  | 'dateOfBirth'
  | 'addressLine1'
  | 'addressLine2'
  | 'city'
  | 'state'
  | 'postalCode'
  | 'country'
  | 'unknown';

// ============================================================================
// Autofill Types
// ============================================================================

export interface AutofillResult {
  success: boolean;
  filledFields: number;
  failedFields: number;
  fields: FilledField[];
}

export interface FilledField {
  fieldName: FieldName;
  element: HTMLElement;
  value: string;
  success: boolean;
  previousValue?: string;
}

// ============================================================================
// Message Passing Types
// ============================================================================

export enum MessageType {
  // Content -> Background
  DETECT_FORMS = 'DETECT_FORMS',
  AUTOFILL_REQUEST = 'AUTOFILL_REQUEST',
  SAVE_PROFILE = 'SAVE_PROFILE',

  // Background -> Content
  AUTOFILL_RESPONSE = 'AUTOFILL_RESPONSE',
  PROFILE_DATA = 'PROFILE_DATA',

  // Popup -> Background
  GET_PROFILE = 'GET_PROFILE',
  UPDATE_PROFILE = 'UPDATE_PROFILE',
  GET_SETTINGS = 'GET_SETTINGS',
  UPDATE_SETTINGS = 'UPDATE_SETTINGS',
}

export interface Message<T = unknown> {
  type: MessageType;
  payload?: T;
  requestId?: string;
}

export interface MessageResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  requestId?: string;
}

// ============================================================================
// Storage Types
// ============================================================================

export interface StorageData {
  profiles: UserProfile[];
  activeProfileId: string | null;
  settings: Settings;
  version: string;
}

export interface Settings {
  enabled: boolean;
  showInlineButton: boolean;
  autoDetectForms: boolean;
  confidenceThreshold: number;
}

// ============================================================================
// Configuration Types
// ============================================================================

export interface ClassificationRule {
  fieldName: FieldName;
  patterns: RegExp[];
  weight: number;
  checkAttributes: Array<keyof FieldMetadata>;
}

export interface EncryptionConfig {
  algorithm: string;
  keySize: number;
  iterations: number;
}

// ============================================================================
// Utility Types
// ============================================================================

export interface Logger {
  debug(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  error(message: string, ...args: unknown[]): void;
}

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
