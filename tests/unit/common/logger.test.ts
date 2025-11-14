/**
 * Unit tests for logger utility
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createLogger, LogLevel } from '@common/logger';

describe('Logger', () => {
  beforeEach(() => {
    // Restore console mocks before each test
    vi.restoreAllMocks();
  });

  it('should create a logger with context', () => {
    const logger = createLogger('TestContext');
    expect(logger).toBeDefined();
  });

  it('should log debug messages', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const logger = createLogger('Test');
    logger.setLogLevel(LogLevel.DEBUG);

    logger.debug('Debug message');

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringMatching(/\[OpenFillIQ:Test\].*\[DEBUG\]/),
      'Debug message'
    );
  });

  it('should log info messages', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const logger = createLogger('Test');
    logger.setLogLevel(LogLevel.INFO);

    logger.info('Info message');

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringMatching(/\[OpenFillIQ:Test\].*\[INFO\]/),
      'Info message'
    );
  });

  it('should log warning messages', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const logger = createLogger('Test');
    logger.setLogLevel(LogLevel.WARN);

    logger.warn('Warning message');

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringMatching(/\[OpenFillIQ:Test\].*\[WARN\]/),
      'Warning message'
    );
  });

  it('should log error messages', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const logger = createLogger('Test');
    logger.setLogLevel(LogLevel.ERROR);

    logger.error('Error message');

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringMatching(/\[OpenFillIQ:Test\].*\[ERROR\]/),
      'Error message'
    );
  });

  it('should respect log level', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const logger = createLogger('Test');
    logger.setLogLevel(LogLevel.ERROR);

    logger.debug('Debug message');
    logger.info('Info message');
    logger.warn('Warning message');

    // None of these should be logged
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it('should log with additional arguments', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const logger = createLogger('Test');
    logger.setLogLevel(LogLevel.INFO);

    const obj = { key: 'value' };
    logger.info('Message', obj, 123);

    expect(consoleSpy).toHaveBeenCalledWith(expect.any(String), 'Message', obj, 123);
  });

  it('should not log when level is NONE', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const logger = createLogger('Test');
    logger.setLogLevel(LogLevel.NONE);

    logger.debug('Debug');
    logger.info('Info');
    logger.warn('Warn');
    logger.error('Error');

    expect(consoleSpy).not.toHaveBeenCalled();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });
});
