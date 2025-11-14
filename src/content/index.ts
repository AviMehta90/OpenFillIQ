/**
 * Content script
 * Runs on web pages to detect forms and enable autofill
 */

import { createLogger } from '@common/logger';

const logger = createLogger('Content');

logger.info('Content script loaded on:', window.location.hostname);

// Initialize content script
function initialize() {
  logger.debug('Initializing form detection...');

  // TODO: Implement form detection
  // TODO: Inject autofill button
  // TODO: Set up mutation observers
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}

// Listen for messages from background
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  logger.debug('Content script received message:', message);

  // TODO: Handle messages

  sendResponse({ success: true });
  return true;
});
