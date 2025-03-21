import assert from 'assert';
import dotenv from 'dotenv';
import { describe, it } from 'mocha';
import process from 'node:process';
import fetch from 'node:fetch';
dotenv.config();

describe('GitHub API Integration Tests', function() {
  this.timeout(10000);
  const token = process.env.GITHUB_TOKEN;
  const repository = process.env.GITHUB_REPO;

  const getHeaders = (token) => ({
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'GitHub-API-Test',
  });

  it('should have GITHUB_TOKEN set in environment', () => {
    assert(token, 'GITHUB_TOKEN is not set');
    assert(typeof token === 'string' && token.length > 0, 'GITHUB_TOKEN is empty');
  });

  it('should connect to GitHub API and authenticate user', async () => {
    const userResponse = await fetch('https://api.github.com/user', {
      headers: getHeaders(token),
    });

    assert(userResponse.ok, 'Failed to connect to GitHub API');

    const userData = await userResponse.json();
    assert(userData.login, 'User data does not contain login');
  });

  it('should get repository details', async () => {
    const token = process.env.GITHUB_TOKEN;
    const repoUrl = `https://api.github.com/repos/${repository}`;

    const repoResponse = await fetch(repoUrl, {
      headers: getHeaders(token),
    });

    if (!repoResponse.ok) {
      const errorMessage = `GitHub API error: ${repoResponse.status} - ${repoResponse.statusText}`;
      throw new Error(errorMessage);
    }

    const repoData = await repoResponse.json();
    assert(repoData.full_name, 'Repository data does not contain full_name');

    const correctRepoFormat = repoData.full_name;
    assert(correctRepoFormat, 'Repository data does not contain full_name');
  });
});
