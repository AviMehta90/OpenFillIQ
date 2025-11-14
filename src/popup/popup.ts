/**
 * Popup UI script
 */

import { createLogger } from '@common/logger';

const logger = createLogger('Popup');

logger.info('Popup initialized');

// DOM elements
const manageProfileBtn = document.getElementById('manageProfile') as HTMLButtonElement;
const toggleExtensionBtn = document.getElementById('toggleExtension') as HTMLButtonElement;

// Event listeners
manageProfileBtn?.addEventListener('click', () => {
  logger.info('Opening options page');
  chrome.runtime.openOptionsPage();
});

toggleExtensionBtn?.addEventListener('click', async () => {
  logger.info('Toggling extension');
  // TODO: Implement toggle functionality
});

// Load initial state
async function loadState() {
  // TODO: Load settings and update UI
  logger.debug('Loading popup state...');
}

loadState();
