// tests/health/student-health.spec.js
const { test, expect } = require('../../fixtures/auth.fixture');
const { getEnvironment } = require('../../config/environments');
const thresholds = require('../../config/thresholds');

const env = getEnvironment();

test.describe('Layer 1: Pre-Flight Health Checks', () => {

  test('[@critical @prod-safe @health] Student API health check returns HTTP 200 within threshold (< 2000ms)', async ({ studentApi }) => {
    const { status, durationMs, data } = await studentApi.getHealth();
    
    expect(status, 'Health endpoint did not return HTTP 200').toBe(200);
    expect(durationMs, `Response time exceeded smoke threshold: ${durationMs}ms > ${thresholds.performance.healthCheckMaxMs}ms`)
      .toBeLessThan(thresholds.performance.healthCheckMaxMs);

    const body = await data();
    expect(body.status).toBe('UP');
    expect(body.service).toBeDefined();
    console.log(`[Health Probe] ✓ API Health: UP (${durationMs}ms)`);
  });

  test('[@critical @prod-safe @health] Student Portal UI reachability and title verification (< 5000ms)', async ({ page }) => {
    const start = Date.now();
    const response = await page.goto(env.appUrl);
    const durationMs = Date.now() - start;

    expect(response?.status()).toBe(200);
    expect(durationMs).toBeLessThan(thresholds.performance.uiPageLoadMaxMs);

    await expect(page).toHaveTitle(/EduManage/);
    console.log(`[Health Probe] ✓ UI Reachable: HTTP 200 in ${durationMs}ms`);
  });

  test('[@critical @prod-safe @health] Core Dashboard aggregate statistics verification', async ({ request }) => {
    const start = Date.now();
    const response = await request.get(`${env.apiUrl}/dashboard/stats`);
    const durationMs = Date.now() - start;

    expect(response.status()).toBe(200);
    expect(durationMs).toBeLessThan(thresholds.performance.healthCheckMaxMs);

    const stats = await response.json();
    expect(typeof stats.totalStudents).toBe('number');
    expect(typeof stats.totalClasses).toBe('number');
    expect(stats.totalStudents).toBeGreaterThanOrEqual(1);
    console.log(`[Health Probe] ✓ Database & System Stats Verified: ${stats.totalStudents} students registered.`);
  });

});
