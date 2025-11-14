/**
 * Popup UI script
 */

import { createLogger } from '@common/logger';
import { sendMessage } from '@common/messaging';
import { MessageType } from '@common/types';
import type { UserProfile, Settings } from '@common/types';

const logger = createLogger('Popup');

// DOM elements
const manageProfileBtn = document.getElementById('manageProfile') as HTMLButtonElement;
const toggleExtensionBtn = document.getElementById('toggleExtension') as HTMLButtonElement;
const statusIndicator = document.getElementById('status') as HTMLSpanElement;

// State
let currentSettings: Settings | null = null;
let currentProfile: UserProfile | null = null;

/**
 * Initialize popup
 */
async function initialize() {
  logger.info('Popup initialized');

  // Load data
  await loadState();

  // Setup event listeners
  setupEventListeners();
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  manageProfileBtn?.addEventListener('click', () => {
    logger.info('Opening options page');
    chrome.runtime.openOptionsPage();
  });

  toggleExtensionBtn?.addEventListener('click', async () => {
    await toggleExtension();
  });
}

/**
 * Load current state from background
 */
async function loadState() {
  try {
    logger.debug('Loading popup state...');

    // Load settings
    currentSettings = await sendMessage<undefined, Settings>(MessageType.GET_SETTINGS);

    // Load active profile
    currentProfile = await sendMessage<undefined, UserProfile | null>(MessageType.GET_PROFILE);

    // Update UI
    updateUI();
  } catch (error) {
    logger.error('Failed to load state:', error);
    showError('Failed to load extension data');
  }
}

/**
 * Update UI based on current state
 */
function updateUI() {
  if (!currentSettings) {
    return;
  }

  // Update status indicator
  if (statusIndicator) {
    if (currentSettings.enabled) {
      statusIndicator.textContent = 'Enabled';
      statusIndicator.classList.remove('disabled');
      statusIndicator.classList.add('enabled');
    } else {
      statusIndicator.textContent = 'Disabled';
      statusIndicator.classList.remove('enabled');
      statusIndicator.classList.add('disabled');
    }
  }

  // Update toggle button text
  if (toggleExtensionBtn) {
    toggleExtensionBtn.textContent = currentSettings.enabled
      ? 'Disable Extension'
      : 'Enable Extension';
  }

  // Update manage profile button based on profile status
  if (manageProfileBtn) {
    if (currentProfile) {
      manageProfileBtn.textContent = 'Edit Profile';
    } else {
      manageProfileBtn.textContent = 'Create Profile';
    }
  }

  logger.debug('UI updated', {
    enabled: currentSettings.enabled,
    hasProfile: !!currentProfile,
  });
}

/**
 * Toggle extension enabled state
 */
async function toggleExtension() {
  if (!currentSettings) {
    return;
  }

  try {
    const newEnabled = !currentSettings.enabled;

    logger.info('Toggling extension:', newEnabled);

    // Update settings
    await sendMessage(MessageType.UPDATE_SETTINGS, {
      enabled: newEnabled,
    });

    // Update local state
    currentSettings.enabled = newEnabled;

    // Update UI
    updateUI();

    // Show feedback
    showSuccess(newEnabled ? 'Extension enabled' : 'Extension disabled');
  } catch (error) {
    logger.error('Failed to toggle extension:', error);
    showError('Failed to update settings');
  }
}

/**
 * Show success message
 */
function showSuccess(message: string) {
  logger.info(message);
  // TODO: Add visual feedback in Phase 5
}

/**
 * Show error message
 */
function showError(message: string) {
  logger.error(message);
  // TODO: Add visual feedback in Phase 5
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}
