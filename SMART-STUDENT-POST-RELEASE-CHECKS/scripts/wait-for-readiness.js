// scripts/wait-for-readiness.js
const http = require('http');
const https = require('https');
const { getEnvironment } = require('../config/environments');

const env = getEnvironment();

const MAX_RETRIES = 30;
const RETRY_INTERVAL_MS = 2000;

function checkUrl(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, (res) => {
      resolve(res.statusCode >= 200 && res.statusCode < 400);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(3000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function waitForService(name, url) {
  console.log(`[Readiness Probe] Waiting for ${name} at ${url}...`);
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const isReady = await checkUrl(url);
    if (isReady) {
      console.log(`[Readiness Probe] ✓ ${name} is READY! (Attempt ${attempt}/${MAX_RETRIES})`);
      return true;
    }
    console.log(`[Readiness Probe] ⏳ ${name} not ready yet. Retrying in ${RETRY_INTERVAL_MS / 1000}s... (${attempt}/${MAX_RETRIES})`);
    await new Promise((r) => setTimeout(r, RETRY_INTERVAL_MS));
  }
  console.error(`[Readiness Probe] ✕ ERROR: ${name} failed readiness check after ${MAX_RETRIES} attempts.`);
  return false;
}

async function main() {
  console.log('========================================================');
  console.log(`  Jenkins Post-Release Readiness Probe: ${env.name}`);
  console.log('========================================================');

  const backendReady = await waitForService('Backend Spring Boot API', `${env.apiUrl}/dashboard/stats`);
  const frontendReady = await waitForService('Frontend React Portal', env.appUrl);

  if (!backendReady || !frontendReady) {
    console.error('\n✕ Deployment Readiness Failed. Aborting pipeline tests.');
    process.exit(1);
  }

  console.log('\n✓ All application services are fully operational and ready for testing!\n');
  process.exit(0);
}

main();
