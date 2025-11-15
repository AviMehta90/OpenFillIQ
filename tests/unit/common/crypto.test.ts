/**
 * Unit tests for crypto utilities
 */

import { describe, it, expect } from 'vitest';
import { encrypt, decrypt, encryptObject, decryptObject } from '@common/crypto';

describe('Crypto utilities', () => {
  describe('encrypt/decrypt', () => {
    it('should encrypt and decrypt a string', async () => {
      const original = 'Hello, World!';
      const encrypted = await encrypt(original);
      const decrypted = await decrypt(encrypted);

      expect(decrypted).toBe(original);
    });

    it('should produce different encrypted values for same input', async () => {
      const original = 'test data';
      const encrypted1 = await encrypt(original);
      const encrypted2 = await encrypt(original);

      // Encrypted values should be different due to randomization
      expect(encrypted1).not.toBe(encrypted2);

      // But both should decrypt to the same value
      const decrypted1 = await decrypt(encrypted1);
      const decrypted2 = await decrypt(encrypted2);
      expect(decrypted1).toBe(original);
      expect(decrypted2).toBe(original);
    });

    it('should handle empty strings', async () => {
      const original = '';
      const encrypted = await encrypt(original);
      const decrypted = await decrypt(encrypted);

      expect(decrypted).toBe(original);
    });

    it('should handle special characters', async () => {
      const original = '!@#$%^&*()_+-={}[]|\\:;"<>,.?/~`';
      const encrypted = await encrypt(original);
      const decrypted = await decrypt(encrypted);

      expect(decrypted).toBe(original);
    });

    it('should handle unicode characters', async () => {
      const original = 'Hello مرحبا';
      const encrypted = await encrypt(original);
      const decrypted = await decrypt(encrypted);

      expect(decrypted).toBe(original);
    });
  });

  describe('encryptObject/decryptObject', () => {
    it('should encrypt and decrypt an object', async () => {
      const original = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
      };

      const encrypted = await encryptObject(original);
      const decrypted = await decryptObject<typeof original>(encrypted);

      expect(decrypted).toEqual(original);
    });

    it('should handle nested objects', async () => {
      const original = {
        user: {
          name: 'Jane',
          address: {
            city: 'New York',
            zip: '10001',
          },
        },
        settings: {
          theme: 'dark',
        },
      };

      const encrypted = await encryptObject(original);
      const decrypted = await decryptObject<typeof original>(encrypted);

      expect(decrypted).toEqual(original);
    });

    it('should handle arrays', async () => {
      const original = {
        items: ['item1', 'item2', 'item3'],
        numbers: [1, 2, 3, 4, 5],
      };

      const encrypted = await encryptObject(original);
      const decrypted = await decryptObject<typeof original>(encrypted);

      expect(decrypted).toEqual(original);
    });

    it('should handle empty objects', async () => {
      const original = {};

      const encrypted = await encryptObject(original);
      const decrypted = await decryptObject<typeof original>(encrypted);

      expect(decrypted).toEqual(original);
    });
  });
});
