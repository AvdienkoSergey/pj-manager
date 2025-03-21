import assert from 'node:assert/strict';
import { describe, it } from 'mocha';
import process from 'node:process';

describe('GitHub Token Tests', () => {
  const token = process.env.GITHUB_TOKEN;
  const repoUrl = process.env.GITHUB_REPO;

  it('should have GITHUB_TOKEN defined', () => {
    assert.ok(token, 'GITHUB_TOKEN is not defined');
  });

  it('should have correct token format', () => {
    assert.ok(token.startsWith('github_pat'), 'Token format is invalid');
  });

  it('should have GITHUB_REPO defined', () => {
    assert.ok(repoUrl, 'Is not defined');
  });

  it('should have valid repo URL format', () => {
    const githubUrlPattern = /^[\w-]+\/[\w-]+$/;
    assert.ok(githubUrlPattern.test(repoUrl), 'GITHUB_REPO should be a valid GitHub URL');
  });
});
