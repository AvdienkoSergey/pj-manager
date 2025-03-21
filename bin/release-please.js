#!/usr/bin/env node

import dotenv from 'dotenv';
import { exec } from 'child_process';
import process from 'process';
import console from 'console';

function releasePlease(cmd) {
  dotenv.config();

  const { GITHUB_TOKEN, GITHUB_REPO } = process.env;

  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    console.error(`
      Error: GITHUB_TOKEN or GITHUB_REPO\n
      variables are not set in .env file.\n
      Please set them and try again.
    `);
    process.exit(1);
  }

  const command =
    `release-please ${cmd} ` +
    `--token="${GITHUB_TOKEN}" ` +
    `--repo-url="${GITHUB_REPO}" ` +
    '--release-type=node ' +
    '--target-branch=master';

  console.log(`Executing command: ${command}`);

  // Execute command and output the result
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('Error executing command:', error);
      console.error(stderr);
      process.exit(1);
    }
    console.log(stdout);
  });
}

export { releasePlease };
