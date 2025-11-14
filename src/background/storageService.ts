/**
 * Storage Service
 * Handles encrypted storage and retrieval of user profiles and settings
 */

import { encryptObject, decryptObject } from '@common/crypto';
import { createLogger } from '@common/logger';
import { STORAGE_KEYS, DEFAULT_SETTINGS } from '@common/constants';
import type { UserProfile, ProfileData, Settings, StorageData, Nullable } from '@common/types';

const logger = createLogger('StorageService');

/**
 * Storage Service Class
 * Manages all interactions with Chrome storage API
 */
class StorageService {
  private initialized = false;

  /**
   * Initialize storage with default values if empty
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      const data = await chrome.storage.local.get(STORAGE_KEYS.VERSION);

      // First time setup
      if (!data[STORAGE_KEYS.VERSION]) {
        logger.info('First time setup - initializing storage');
        await this.initializeDefaults();
      }

      this.initialized = true;
      logger.info('Storage service initialized');
    } catch (error) {
      logger.error('Failed to initialize storage:', error);
      throw error;
    }
  }

  /**
   * Initialize default storage values
   */
  private async initializeDefaults(): Promise<void> {
    const defaultData = {
      [STORAGE_KEYS.VERSION]: '0.1.0',
      [STORAGE_KEYS.PROFILES]: JSON.stringify([]),
      [STORAGE_KEYS.ACTIVE_PROFILE_ID]: null,
      [STORAGE_KEYS.SETTINGS]: JSON.stringify(DEFAULT_SETTINGS),
    };

    await chrome.storage.local.set(defaultData);
  }

  /**
   * Get all profiles
   */
  async getProfiles(): Promise<UserProfile[]> {
    try {
      const data = await chrome.storage.local.get(STORAGE_KEYS.PROFILES);
      const encryptedProfiles = data[STORAGE_KEYS.PROFILES];

      if (!encryptedProfiles) {
        return [];
      }

      const profiles = await decryptObject<UserProfile[]>(encryptedProfiles);
      return profiles;
    } catch (error) {
      logger.error('Failed to get profiles:', error);
      return [];
    }
  }

  /**
   * Get a specific profile by ID
   */
  async getProfile(profileId: string): Promise<Nullable<UserProfile>> {
    try {
      const profiles = await this.getProfiles();
      return profiles.find((p) => p.id === profileId) || null;
    } catch (error) {
      logger.error('Failed to get profile:', error);
      return null;
    }
  }

  /**
   * Get the active profile
   */
  async getActiveProfile(): Promise<Nullable<UserProfile>> {
    try {
      const data = await chrome.storage.local.get(STORAGE_KEYS.ACTIVE_PROFILE_ID);
      const activeProfileId = data[STORAGE_KEYS.ACTIVE_PROFILE_ID];

      if (!activeProfileId) {
        return null;
      }

      return await this.getProfile(activeProfileId);
    } catch (error) {
      logger.error('Failed to get active profile:', error);
      return null;
    }
  }

  /**
   * Save a new profile
   */
  async saveProfile(profile: UserProfile): Promise<void> {
    try {
      const profiles = await this.getProfiles();

      // Check if profile already exists
      const existingIndex = profiles.findIndex((p) => p.id === profile.id);

      if (existingIndex >= 0) {
        throw new Error('Profile with this ID already exists. Use updateProfile instead.');
      }

      profiles.push(profile);

      const encrypted = await encryptObject(profiles);
      await chrome.storage.local.set({
        [STORAGE_KEYS.PROFILES]: encrypted,
      });

      logger.info('Profile saved successfully:', profile.id);

      // If this is the first profile, make it active
      if (profiles.length === 1) {
        await this.setActiveProfile(profile.id);
      }
    } catch (error) {
      logger.error('Failed to save profile:', error);
      throw error;
    }
  }

  /**
   * Update an existing profile
   */
  async updateProfile(profileId: string, updates: Partial<ProfileData>): Promise<void> {
    try {
      const profiles = await this.getProfiles();
      const profileIndex = profiles.findIndex((p) => p.id === profileId);

      if (profileIndex === -1) {
        throw new Error('Profile not found');
      }

      // Update profile data
      profiles[profileIndex] = {
        ...profiles[profileIndex],
        data: {
          ...profiles[profileIndex].data,
          ...updates,
        },
        updatedAt: Date.now(),
      };

      const encrypted = await encryptObject(profiles);
      await chrome.storage.local.set({
        [STORAGE_KEYS.PROFILES]: encrypted,
      });

      logger.info('Profile updated successfully:', profileId);
    } catch (error) {
      logger.error('Failed to update profile:', error);
      throw error;
    }
  }

  /**
   * Delete a profile
   */
  async deleteProfile(profileId: string): Promise<void> {
    try {
      const profiles = await this.getProfiles();
      const filteredProfiles = profiles.filter((p) => p.id !== profileId);

      if (filteredProfiles.length === profiles.length) {
        throw new Error('Profile not found');
      }

      const encrypted = await encryptObject(filteredProfiles);
      await chrome.storage.local.set({
        [STORAGE_KEYS.PROFILES]: encrypted,
      });

      // If deleted profile was active, clear active profile
      const data = await chrome.storage.local.get(STORAGE_KEYS.ACTIVE_PROFILE_ID);
      if (data[STORAGE_KEYS.ACTIVE_PROFILE_ID] === profileId) {
        await chrome.storage.local.set({
          [STORAGE_KEYS.ACTIVE_PROFILE_ID]: null,
        });
      }

      logger.info('Profile deleted successfully:', profileId);
    } catch (error) {
      logger.error('Failed to delete profile:', error);
      throw error;
    }
  }

  /**
   * Set the active profile
   */
  async setActiveProfile(profileId: string): Promise<void> {
    try {
      // Verify profile exists
      const profile = await this.getProfile(profileId);
      if (!profile) {
        throw new Error('Profile not found');
      }

      await chrome.storage.local.set({
        [STORAGE_KEYS.ACTIVE_PROFILE_ID]: profileId,
      });

      logger.info('Active profile set:', profileId);
    } catch (error) {
      logger.error('Failed to set active profile:', error);
      throw error;
    }
  }

  /**
   * Get settings
   */
  async getSettings(): Promise<Settings> {
    try {
      const data = await chrome.storage.local.get(STORAGE_KEYS.SETTINGS);
      const encryptedSettings = data[STORAGE_KEYS.SETTINGS];

      if (!encryptedSettings) {
        return DEFAULT_SETTINGS;
      }

      const settings = await decryptObject<Settings>(encryptedSettings);
      return settings;
    } catch (error) {
      logger.error('Failed to get settings:', error);
      return DEFAULT_SETTINGS;
    }
  }

  /**
   * Update settings
   */
  async updateSettings(updates: Partial<Settings>): Promise<void> {
    try {
      const currentSettings = await this.getSettings();
      const newSettings = {
        ...currentSettings,
        ...updates,
      };

      const encrypted = await encryptObject(newSettings);
      await chrome.storage.local.set({
        [STORAGE_KEYS.SETTINGS]: encrypted,
      });

      logger.info('Settings updated successfully');
    } catch (error) {
      logger.error('Failed to update settings:', error);
      throw error;
    }
  }

  /**
   * Clear all data (use with caution!)
   */
  async clearAll(): Promise<void> {
    try {
      await chrome.storage.local.clear();
      await this.initializeDefaults();
      logger.info('All data cleared and reset to defaults');
    } catch (error) {
      logger.error('Failed to clear data:', error);
      throw error;
    }
  }

  /**
   * Export all data (for backup)
   */
  async exportData(): Promise<StorageData> {
    try {
      const profiles = await this.getProfiles();
      const settings = await this.getSettings();
      const data = await chrome.storage.local.get(STORAGE_KEYS.ACTIVE_PROFILE_ID);

      return {
        profiles,
        activeProfileId: data[STORAGE_KEYS.ACTIVE_PROFILE_ID] || null,
        settings,
        version: '0.1.0',
      };
    } catch (error) {
      logger.error('Failed to export data:', error);
      throw error;
    }
  }

  /**
   * Import data (for restore)
   */
  async importData(data: StorageData): Promise<void> {
    try {
      // Validate data structure
      if (!data.profiles || !Array.isArray(data.profiles)) {
        throw new Error('Invalid data format');
      }

      // Save profiles
      const encryptedProfiles = await encryptObject(data.profiles);
      const encryptedSettings = await encryptObject(data.settings);

      await chrome.storage.local.set({
        [STORAGE_KEYS.PROFILES]: encryptedProfiles,
        [STORAGE_KEYS.SETTINGS]: encryptedSettings,
        [STORAGE_KEYS.ACTIVE_PROFILE_ID]: data.activeProfileId,
        [STORAGE_KEYS.VERSION]: data.version,
      });

      logger.info('Data imported successfully');
    } catch (error) {
      logger.error('Failed to import data:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const storageService = new StorageService();
