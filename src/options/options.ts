/**
 * Options page script
 */

import { createLogger } from '@common/logger';
import { sendMessage } from '@common/messaging';
import { MessageType } from '@common/types';
import type { UserProfile, Settings, ProfileData } from '@common/types';

const logger = createLogger('Options');

// DOM elements
const profileForm = document.getElementById('profileForm') as HTMLFormElement;
const clearBtn = document.getElementById('clearBtn') as HTMLButtonElement;
const enabledToggle = document.getElementById('enabledToggle') as HTMLInputElement;
const inlineButtonToggle = document.getElementById('inlineButtonToggle') as HTMLInputElement;

// Profile form fields
const firstNameInput = document.getElementById('firstName') as HTMLInputElement;
const lastNameInput = document.getElementById('lastName') as HTMLInputElement;
const emailInput = document.getElementById('email') as HTMLInputElement;
const phoneInput = document.getElementById('phone') as HTMLInputElement;
const addressLine1Input = document.getElementById('addressLine1') as HTMLInputElement;
const cityInput = document.getElementById('city') as HTMLInputElement;
const stateInput = document.getElementById('state') as HTMLInputElement;
const postalCodeInput = document.getElementById('postalCode') as HTMLInputElement;

// State
let currentProfile: UserProfile | null = null;
let currentSettings: Settings | null = null;

/**
 * Initialize options page
 */
async function initialize() {
  logger.info('Options page initialized');

  // Load data
  await loadData();

  // Setup event listeners
  setupEventListeners();
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Profile form submission
  profileForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveProfile();
  });

  // Clear data button
  clearBtn?.addEventListener('click', async () => {
    if (confirm('Are you sure you want to clear all stored data?')) {
      await clearData();
    }
  });

  // Settings toggles
  enabledToggle?.addEventListener('change', async (e) => {
    const enabled = (e.target as HTMLInputElement).checked;
    await updateSetting('enabled', enabled);
  });

  inlineButtonToggle?.addEventListener('change', async (e) => {
    const show = (e.target as HTMLInputElement).checked;
    await updateSetting('showInlineButton', show);
  });
}

/**
 * Load saved data
 */
async function loadData() {
  try {
    logger.debug('Loading saved data...');

    // Load profile
    currentProfile = await sendMessage<undefined, UserProfile | null>(MessageType.GET_PROFILE);

    // Load settings
    currentSettings = await sendMessage<undefined, Settings>(MessageType.GET_SETTINGS);

    // Populate form
    populateForm();

    logger.debug('Data loaded successfully', {
      hasProfile: !!currentProfile,
      settings: currentSettings,
    });
  } catch (error) {
    logger.error('Failed to load data:', error);
    showError('Failed to load profile data');
  }
}

/**
 * Populate form with current profile data
 */
function populateForm() {
  if (currentProfile && currentProfile.data) {
    const data = currentProfile.data;

    if (firstNameInput) firstNameInput.value = data.firstName || '';
    if (lastNameInput) lastNameInput.value = data.lastName || '';
    if (emailInput) emailInput.value = data.email || '';
    if (phoneInput) phoneInput.value = data.phone || '';
    if (addressLine1Input) addressLine1Input.value = data.addressLine1 || '';
    if (cityInput) cityInput.value = data.city || '';
    if (stateInput) stateInput.value = data.state || '';
    if (postalCodeInput) postalCodeInput.value = data.postalCode || '';
  }

  if (currentSettings) {
    if (enabledToggle) enabledToggle.checked = currentSettings.enabled;
    if (inlineButtonToggle) inlineButtonToggle.checked = currentSettings.showInlineButton;
  }
}

/**
 * Save profile data
 */
async function saveProfile() {
  try {
    logger.info('Saving profile...');

    // Get form data
    const formData = new FormData(profileForm);
    const profileData: ProfileData = {};

    // Map form fields to profile data
    for (const [key, value] of formData.entries()) {
      if (value && typeof value === 'string' && value.trim()) {
        profileData[key] = value.trim();
      }
    }

    logger.debug('Profile data:', profileData);

    if (currentProfile) {
      // Update existing profile
      await sendMessage(MessageType.UPDATE_PROFILE, {
        profileId: currentProfile.id,
        updates: profileData,
      });
      showSuccess('Profile updated successfully!');
    } else {
      // Create new profile
      const newProfile: UserProfile = {
        id: generateProfileId(),
        name: 'Default Profile',
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        data: profileData,
      };

      await sendMessage(MessageType.SAVE_PROFILE, newProfile);
      currentProfile = newProfile;
      showSuccess('Profile created successfully!');
    }

    logger.info('Profile saved successfully');
  } catch (error) {
    logger.error('Failed to save profile:', error);
    showError('Failed to save profile. Please try again.');
  }
}

/**
 * Update a single setting
 */
async function updateSetting(key: keyof Settings, value: boolean | number) {
  try {
    logger.info('Updating setting:', key, value);

    await sendMessage(MessageType.UPDATE_SETTINGS, {
      [key]: value,
    });

    // Update local state
    if (currentSettings) {
      currentSettings[key] = value as never; // Type assertion needed for generic
    }

    showSuccess('Settings updated');
  } catch (error) {
    logger.error('Failed to update setting:', error);
    showError('Failed to update settings');
  }
}

/**
 * Clear all data
 */
async function clearData() {
  try {
    logger.info('Clearing all data...');

    // Create a new empty profile
    const emptyProfile: UserProfile = {
      id: generateProfileId(),
      name: 'Default Profile',
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      data: {},
    };

    await sendMessage(MessageType.SAVE_PROFILE, emptyProfile);

    // Reset form
    profileForm?.reset();
    currentProfile = null;

    showSuccess('All data cleared!');
    logger.info('Data cleared successfully');
  } catch (error) {
    logger.error('Failed to clear data:', error);
    showError('Failed to clear data');
  }
}

/**
 * Generate a unique profile ID
 */
function generateProfileId(): string {
  return `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Show success message
 */
function showSuccess(message: string) {
  logger.info(message);
  alert(message); // Simple for now, will improve in Phase 5
}

/**
 * Show error message
 */
function showError(message: string) {
  logger.error(message);
  alert(message); // Simple for now, will improve in Phase 5
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}
