import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { logger } from '../../lib/logger.js';
import process from 'node:process';
import { describe, it, before, after } from 'mocha';
import console from 'node:console';

describe('Logger', () => {
  const testLogPath = path.join(process.cwd(), 'log');
  const date = new Date().toISOString().substring(0, 10);
  const logFile = path.join(testLogPath, `${date}.test.log`);

  // Setup and cleanup
  before(() => {
    if (!fs.existsSync(testLogPath)) {
      fs.mkdirSync(testLogPath);
    }
    if (!fs.existsSync(logFile)) {
      fs.writeFileSync(logFile, '');
    }
  });

  after(async () => {
    await logger.close();
    if (fs.existsSync(logFile)) {
      fs.unlinkSync(logFile);
    }
  });

  // Test each logging method
  it('should write info log', async () => {
    logger.log('test info message');
    fs.readFileSync(logFile, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading log file:', err);
        return;
      }
      assert(data.includes('test info message'));
    });
  });

  it('should write debug log', () => {
    logger.debug('test debug message');
    fs.readFileSync(logFile, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading log file:', err);
        return;
      }
      assert(data.includes('test debug message'));
    });
  });

  it('should write error log', () => {
    logger.error('test error message');
    fs.readFileSync(logFile, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading log file:', err);
        return;
      }
      assert(data.includes('test error message'));
    });
  });

  it('should write system log', () => {
    logger.system('test system message');
    fs.readFileSync(logFile, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading log file:', err);
        return;
      }
      assert(data.includes('test system message'));
    });
  });

  it('should write access log', () => {
    logger.access('test access message');
    fs.readFileSync(logFile, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading log file:', err);
        return;
      }
      assert(data.includes('test access message'));
    });
  });

  it('should format multiple arguments', () => {
    logger.log('test', 'multiple', 'args');
    fs.readFileSync(logFile, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading log file:', err);
        return;
      }
      assert(data.includes('test multiple args'));
    });
  });

  it('should handle objects with dir method', () => {
    const testObj = { test: 'value' };
    logger.dir(testObj);
    fs.readFileSync(logFile, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading log file:', err);
        return;
      }
      assert(data.includes('{ test:'));
    });
  });
});
