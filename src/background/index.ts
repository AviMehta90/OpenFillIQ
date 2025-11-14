/**
 * Background service worker
 * Handles storage, messaging, and coordination between components
 */

import { createLogger } from '@common/logger';
import { MessageType, Message, MessageResponse } from '@common/types';

const logger = createLogger('Background');

logger.info('Background service worker initialized');

// Message listener
chrome.runtime.onMessage.addListener(
  (
    message: Message,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: MessageResponse) => void
  ) => {
    logger.debug('Received message:', message.type, 'from', sender.tab?.id);

    // Handle messages asynchronously
    handleMessage(message, sender)
      .then((response) => {
        sendResponse(response);
      })
      .catch((error) => {
        logger.error('Error handling message:', error);
        sendResponse({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          requestId: message.requestId,
        });
      });

    // Return true to indicate async response
    return true;
  }
);

/**
 * Message handler router
 */
async function handleMessage(
  message: Message,
  _sender: chrome.runtime.MessageSender
): Promise<MessageResponse> {
  switch (message.type) {
    case MessageType.GET_PROFILE:
      // TODO: Implement get profile
      return { success: true, data: null };

    case MessageType.UPDATE_PROFILE:
      // TODO: Implement update profile
      return { success: true };

    case MessageType.GET_SETTINGS:
      // TODO: Implement get settings
      return { success: true, data: null };

    case MessageType.UPDATE_SETTINGS:
      // TODO: Implement update settings
      return { success: true };

    case MessageType.AUTOFILL_REQUEST:
      // TODO: Implement autofill
      return { success: true };

    default:
      logger.warn('Unknown message type:', message.type);
      return {
        success: false,
        error: 'Unknown message type',
      };
  }
}

// Installation handler
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    logger.info('Extension installed');
    // TODO: Initialize default storage
  } else if (details.reason === 'update') {
    logger.info('Extension updated');
    // TODO: Handle migration if needed
  }
});
