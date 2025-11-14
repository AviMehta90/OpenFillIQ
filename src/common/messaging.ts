/**
 * Message Passing System
 * Type-safe communication between extension components
 */

import { createLogger } from './logger';
import type { Message, MessageResponse, MessageType } from './types';

const logger = createLogger('Messaging');

/**
 * Send a message to the background script
 */
export async function sendMessage<T = unknown, R = unknown>(
  type: MessageType,
  payload?: T
): Promise<R> {
  const requestId = generateRequestId();

  const message: Message<T> = {
    type,
    payload,
    requestId,
  };

  logger.debug('Sending message:', type, requestId);

  try {
    const response = (await chrome.runtime.sendMessage(message)) as MessageResponse<R>;

    if (!response.success) {
      throw new Error(response.error || 'Unknown error');
    }

    logger.debug('Message response received:', type, requestId);
    return response.data as R;
  } catch (error) {
    logger.error('Message failed:', type, error);
    throw error;
  }
}

/**
 * Send a message to a specific tab
 */
export async function sendMessageToTab<T = unknown, R = unknown>(
  tabId: number,
  type: MessageType,
  payload?: T
): Promise<R> {
  const requestId = generateRequestId();

  const message: Message<T> = {
    type,
    payload,
    requestId,
  };

  logger.debug('Sending message to tab:', tabId, type, requestId);

  try {
    const response = (await chrome.tabs.sendMessage(tabId, message)) as MessageResponse<R>;

    if (!response.success) {
      throw new Error(response.error || 'Unknown error');
    }

    logger.debug('Tab message response received:', tabId, type, requestId);
    return response.data as R;
  } catch (error) {
    logger.error('Tab message failed:', tabId, type, error);
    throw error;
  }
}

/**
 * Create a message handler function
 * Wraps async handlers with proper error handling
 */
export function createMessageHandler<T = unknown, R = unknown>(
  handler: (payload: T, sender: chrome.runtime.MessageSender) => Promise<R>
): (
  message: Message<T>,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: MessageResponse<R>) => void
) => boolean {
  return (message, sender, sendResponse) => {
    // Handle async operation
    (async () => {
      try {
        logger.debug('Handling message:', message.type, message.requestId);

        const data = await handler(message.payload as T, sender);

        const response: MessageResponse<R> = {
          success: true,
          data,
          requestId: message.requestId,
        };

        sendResponse(response);
      } catch (error) {
        logger.error('Handler error:', message.type, error);

        const response: MessageResponse<R> = {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          requestId: message.requestId,
        };

        sendResponse(response);
      }
    })();

    // Return true to indicate async response
    return true;
  };
}

/**
 * Message router for handling multiple message types
 */
export class MessageRouter {
  private handlers: Map<
    MessageType,
    (payload: unknown, sender: chrome.runtime.MessageSender) => Promise<unknown>
  > = new Map();

  /**
   * Register a handler for a specific message type
   */
  on<T = unknown, R = unknown>(
    type: MessageType,
    handler: (payload: T, sender: chrome.runtime.MessageSender) => Promise<R>
  ): void {
    this.handlers.set(
      type,
      handler as (payload: unknown, sender: chrome.runtime.MessageSender) => Promise<unknown>
    );
    logger.debug('Handler registered for:', type);
  }

  /**
   * Get the message listener function
   */
  getListener(): (
    message: Message,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: MessageResponse) => void
  ) => boolean {
    return (
      message: Message,
      sender: chrome.runtime.MessageSender,
      sendResponse: (response: MessageResponse) => void
    ) => {
      (async () => {
        try {
          const handler = this.handlers.get(message.type);

          if (!handler) {
            throw new Error(`No handler registered for message type: ${message.type}`);
          }

          const data = await handler(message.payload, sender);

          const response: MessageResponse = {
            success: true,
            data,
            requestId: message.requestId,
          };

          sendResponse(response);
        } catch (error) {
          logger.error('Handler error:', message.type, error);

          const response: MessageResponse = {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            requestId: message.requestId,
          };

          sendResponse(response);
        }
      })();

      return true;
    };
  }

  /**
   * Start listening for messages
   */
  listen(): void {
    chrome.runtime.onMessage.addListener(this.getListener());
    logger.info('Message router started');
  }
}

/**
 * Generate a unique request ID
 */
function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Helper functions for common message patterns
 */

export const messaging = {
  /**
   * Send a message and handle errors gracefully
   */
  async send<T = unknown, R = unknown>(
    type: MessageType,
    payload?: T
  ): Promise<{ success: true; data: R } | { success: false; error: string }> {
    try {
      const data = await sendMessage<T, R>(type, payload);
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  /**
   * Send a message without waiting for response
   */
  sendFireAndForget<T = unknown>(type: MessageType, payload?: T): void {
    const message: Message<T> = {
      type,
      payload,
      requestId: generateRequestId(),
    };

    chrome.runtime.sendMessage(message).catch((error) => {
      logger.error('Fire-and-forget message failed:', type, error);
    });
  },
};
