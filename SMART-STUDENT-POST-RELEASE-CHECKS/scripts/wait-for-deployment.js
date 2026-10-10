// scripts/wait-for-deployment.js
const http = require('http');
const https = require('https');
const { getEnvironment } = require('../config/environments');
const thresholds = require('../config/thresholds');

const env = getEnvironment();

const MAX_RETRIES = 30;
const RETRY_INTERVAL_MS = 2000;

function timedCheckUrl(url) {
  return new Promise((resolve) => {
    const start = Date.now();
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, (res) => {
      const durationMs = Date.now() - start;
      resolve({
        ok: res.statusCode >= 200 && res.statusCode < 400,
        statusCode: res.statusCode,
        durationMs,
      });
    });

    req.on('error', (err) => {
      resolve({ ok: false, error: err.message, durationMs: Date.now() - start });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ ok: false, error: 'Request timeout', durationMs: Date.now() - start });
    });
  });
}

async function probeService(name, url, maxDurationMs) {
  console.log(`[Pre-Flight Probe] Polling ${name} at ${url}...`);

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const res = await timedCheckUrl(url);

    if (res.ok) {
      const withinThreshold = res.durationMs <= maxDurationMs;
      console.log(`[Pre-Flight Probe] ✓ ${name} is HEALTHY (HTTP ${res.statusCode}) - Response Time: ${res.durationMs}ms ${withinThreshold ? '✓ (Within threshold)' : '⚠️ (Slow response)'}`);
      return true;
    }

    console.log(`[Pre-Flight Probe] ⏳ ${name} not ready yet (${res.error || `HTTP ${res.statusCode}`}). Retrying in ${RETRY_INTERVAL_MS / 1000}s... (Attempt ${attempt}/${MAX_RETRIES})`);
    await new Promise((r) => setTimeout(r, RETRY_INTERVAL_MS));
  }

  console.error(`[Pre-Flight Probe] ✕ ERROR: ${name} failed readiness check after ${MAX_RETRIES} attempts.`);
  return false;
}

async function main() {
  console.log('========================================================');
  console.log(`  Jenkins Pre-Flight Deployment Probe: ${env.name}`);
  console.log('========================================================');

  const healthUrl = `${env.apiUrl}/v1/students/health`;
  const apiHealthy = await probeService('Student API', healthUrl, thresholds.performance.healthCheckMaxMs);
  const uiHealthy = await probeService('Student Portal UI', env.appUrl, thresholds.performance.uiPageLoadMaxMs);

  if (!apiHealthy || !uiHealthy) {
    console.error('\n✕ Pre-flight deployment probe FAILED. Aborting post-release checks.\n');
    process.exit(1);
  }

  console.log('\n✓ Deployment is stable and within performance thresholds. Ready for checks!\n');
  process.exit(0);
}

main();
