/**
 * Options page script
 */

import { createLogger } from '@common/logger';

const logger = createLogger('Options');

logger.info('Options page initialized');

// DOM elements
const profileForm = document.getElementById('profileForm') as HTMLFormElement;
const clearBtn = document.getElementById('clearBtn') as HTMLButtonElement;
const enabledToggle = document.getElementById('enabledToggle') as HTMLInputElement;
const inlineButtonToggle = document.getElementById('inlineButtonToggle') as HTMLInputElement;

// Form submission
profileForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  logger.info('Saving profile...');

  const formData = new FormData(profileForm);
  const profile = Object.fromEntries(formData);

  logger.debug('Profile data:', profile);

  // TODO: Save profile to storage

  // Show success message
  alert('Profile saved successfully!');
});

// Clear data
clearBtn?.addEventListener('click', async () => {
  if (confirm('Are you sure you want to clear all stored data?')) {
    logger.info('Clearing all data...');
    // TODO: Clear storage
    profileForm?.reset();
    alert('All data cleared!');
  }
});

// Settings toggles
enabledToggle?.addEventListener('change', async (e) => {
  const enabled = (e.target as HTMLInputElement).checked;
  logger.info('Extension enabled:', enabled);
  // TODO: Update settings
});

inlineButtonToggle?.addEventListener('change', async (e) => {
  const show = (e.target as HTMLInputElement).checked;
  logger.info('Inline button enabled:', show);
  // TODO: Update settings
});

// Load saved data
async function loadData() {
  logger.debug('Loading saved data...');
  // TODO: Load profile and settings from storage
}

loadData();
