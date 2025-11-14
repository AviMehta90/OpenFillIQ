/**
 * Encryption utilities for local data storage
 * Uses AES-256 encryption via crypto-js
 */

import CryptoJS from 'crypto-js';
import { ENCRYPTION_CONFIG } from './constants';
import { createLogger } from './logger';

const logger = createLogger('Crypto');

/**
 * Generate a deterministic encryption key from browser-specific data
 * This ensures the key is consistent across sessions but unique per browser
 */
const generateEncryptionKey = async (): Promise<string> => {
  try {
    // Use a combination of browser-specific identifiers
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const language = navigator.language;

    // Combine identifiers
    const seed = `${userAgent}-${platform}-${language}`;

    // Hash the seed to create a consistent key
    const hash = CryptoJS.SHA256(seed);
    return hash.toString(CryptoJS.enc.Base64);
  } catch (error) {
    logger.error('Failed to generate encryption key:', error);
    throw new Error('Encryption key generation failed');
  }
};

/**
 * Encrypt data using AES-256
 */
export const encrypt = async (data: string): Promise<string> => {
  try {
    const key = await generateEncryptionKey();
    const encrypted = CryptoJS.AES.encrypt(data, key, {
      keySize: ENCRYPTION_CONFIG.keySize / 32,
      iterations: ENCRYPTION_CONFIG.iterations,
    });
    return encrypted.toString();
  } catch (error) {
    logger.error('Encryption failed:', error);
    throw new Error('Failed to encrypt data');
  }
};

/**
 * Decrypt data using AES-256
 */
export const decrypt = async (encryptedData: string): Promise<string> => {
  try {
    const key = await generateEncryptionKey();
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
      keySize: ENCRYPTION_CONFIG.keySize / 32,
      iterations: ENCRYPTION_CONFIG.iterations,
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    logger.error('Decryption failed:', error);
    throw new Error('Failed to decrypt data');
  }
};

/**
 * Encrypt object as JSON
 */
export const encryptObject = async <T>(obj: T): Promise<string> => {
  const json = JSON.stringify(obj);
  return encrypt(json);
};

/**
 * Decrypt JSON to object
 */
export const decryptObject = async <T>(encryptedData: string): Promise<T> => {
  const json = await decrypt(encryptedData);
  return JSON.parse(json) as T;
};
