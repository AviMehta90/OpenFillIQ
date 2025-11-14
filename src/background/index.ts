/**
 * Background service worker
 * Handles storage, messaging, and coordination between components
 */

import { createLogger } from '@common/logger';
import { MessageType } from '@common/types';
import { MessageRouter } from '@common/messaging';
import { storageService } from './storageService';
import type { UserProfile, ProfileData, Settings } from '@common/types';

const logger = createLogger('Background');

// Initialize message router
const router = new MessageRouter();

/**
 * Initialize background service
 */
async function initialize() {
  try {
    // Initialize storage
    await storageService.initialize();

    // Set up message handlers
    setupMessageHandlers();

    // Start listening for messages
    router.listen();

    logger.info('Background service worker initialized');
  } catch (error) {
    logger.error('Failed to initialize background service:', error);
  }
}

/**
 * Setup message handlers
 */
function setupMessageHandlers() {
  // Get active profile
  router.on(MessageType.GET_PROFILE, async () => {
    const profile = await storageService.getActiveProfile();
    return profile;
  });

  // Update profile
  router.on<{ profileId: string; updates: Partial<ProfileData> }>(
    MessageType.UPDATE_PROFILE,
    async (payload) => {
      if (!payload || !payload.profileId) {
        throw new Error('Profile ID is required');
      }
      await storageService.updateProfile(payload.profileId, payload.updates);
      return { success: true };
    }
  );

  // Save new profile
  router.on<UserProfile>(MessageType.SAVE_PROFILE, async (payload) => {
    if (!payload) {
      throw new Error('Profile data is required');
    }
    await storageService.saveProfile(payload);
    return { success: true };
  });

  // Get settings
  router.on(MessageType.GET_SETTINGS, async () => {
    const settings = await storageService.getSettings();
    return settings;
  });

  // Update settings
  router.on<Partial<Settings>>(MessageType.UPDATE_SETTINGS, async (payload) => {
    if (!payload) {
      throw new Error('Settings data is required');
    }
    await storageService.updateSettings(payload);
    return { success: true };
  });

  // Autofill request (placeholder for Phase 4)
  router.on(MessageType.AUTOFILL_REQUEST, async () => {
    logger.info('Autofill request received (not yet implemented)');
    return { success: false, message: 'Autofill not yet implemented' };
  });

  logger.debug('Message handlers registered');
}

// Installation handler
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    logger.info('Extension installed - initializing storage');
    await storageService.initialize();
  } else if (details.reason === 'update') {
    logger.info('Extension updated');
    // Handle migration if needed in future versions
  }
});

// Start the service
initialize();
