import assert from 'node:assert';
import path from 'node:path';
import { promises as fs } from 'node:fs';
import { describe, it, before, after } from 'mocha';
import loader from '../../../lib/loader.js';
import process from 'node:process';

describe('Loader', () => {
  const testFilePath = path.join(process.cwd(), 'test', 'fixtures', 'test-script.js');

  before(async () => {
    await fs.mkdir(path.dirname(testFilePath), { recursive: true });

    const testScript = `
      export default {
        add: (a, b) => a + b,
        multiply: (a, b) => a * b,
        getData: () => sandbox.testData
      };
    `;
    await fs.writeFile(testFilePath, testScript);
  });

  after(async () => {
    await fs.rm(path.dirname(testFilePath), { recursive: true, force: true });
  });

  it('should load and execute script with sandbox', async () => {
    const options = { timeout: 1000 };
    const sandbox = { testData: 'test value' };
    const load = loader(options);

    const exported = await load(testFilePath, sandbox);

    assert.strictEqual(exported.add(2, 3), 5);
    assert.strictEqual(exported.multiply(2, 3), 6);
    assert.strictEqual(exported.getData(), 'test value');
  });

  it('should throw error for invalid script', async () => {
    const invalidPath = path.join(process.cwd(), 'test', 'fixtures', 'invalid.js');
    await fs.writeFile(invalidPath, 'invalid javascript code');

    const load = loader({});

    await assert.rejects(async () => await load(invalidPath, {}), { name: 'SyntaxError' });
  });

  it('should throw error for non-existent file', async () => {
    const nonExistentPath = path.join(process.cwd(), 'non-existent.js');
    const load = loader({});

    await assert.rejects(async () => await load(nonExistentPath, {}), { code: 'ENOENT' });
  });

  it('should freeze sandbox object', async () => {
    const sandbox = { testData: 'original' };
    const load = loader({ timeout: 1000 });

    await load(testFilePath, sandbox);

    assert.strictEqual(Object.isFrozen(sandbox), true);
    assert.throws(() => {
      sandbox.testData = 'modified';
    }, /Cannot assign to read only property/);
  });

  it('should prevent sandbox modification from script', async () => {
    const sandbox = { testData: 'original' };
    const load = loader({ timeout: 1000 });

    const testScript = `
      export default {
        modifySandbox: () => {
          try {
            sandbox.testData = 'modified';
          } catch (error) {
            return error.message;
          }
          return sandbox.testData;
        },
        readSandbox: () => sandbox.testData
      };
    `;
    await fs.writeFile(testFilePath, testScript);

    const exported = await load(testFilePath, sandbox);

    const result = exported.modifySandbox();
    assert(result.includes('Cannot'), 'Should return error message about property modification');

    assert.strictEqual(exported.readSandbox(), 'original');
    assert.strictEqual(sandbox.testData, 'original');
  });
});
