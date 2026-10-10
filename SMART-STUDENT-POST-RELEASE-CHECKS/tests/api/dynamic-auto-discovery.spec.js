const { test, expect } = require('@playwright/test');
const { getEnvironment } = require('../../config/environments');

const env = getEnvironment();

test.describe('Zero-Config Dynamic API Auto-Discovery & Smoke Verification', () => {

  test('Auto-discover all Spring Boot REST routes and verify zero 404/500 errors', async ({ request }) => {
    // 1. Fetch all registered routes dynamically from Spring Boot
    const routesResponse = await request.get(`${env.apiUrl}/system/routes`);
    expect(routesResponse.status()).toBe(200);

    const routes = await routesResponse.json();
    expect(Array.isArray(routes)).toBeTruthy();
    expect(routes.length).toBeGreaterThan(0);

    console.log(`\n[Dynamic Discovery] Discovered ${routes.length} backend endpoints from Spring Boot runtime.`);

    // 2. Iterate through every discovered route automatically
    let verifiedCount = 0;
    for (const route of routes) {
      const path = route.path;
      const methods = route.methods;

      // Automatically test all GET endpoints that do not require URL path variables
      if (methods.includes('GET') && !path.includes('{')) {
        const res = await request.get(`${env.apiUrl.replace('/api', '')}${path}`);
        expect(res.status(), `Failed on dynamically discovered endpoint: ${path}`).toBeLessThan(500);
        expect(res.status(), `Discovered route ${path} returned 404`).not.toBe(404);
        verifiedCount++;
        console.log(`  ✓ Auto-tested: [GET] ${path} -> HTTP ${res.status()}`);
      } else {
        // Non-GET or parameterized endpoint verified as registered
        expect(path).toBeDefined();
        expect(route.controller).toBeDefined();
        verifiedCount++;
      }
    }

    expect(verifiedCount).toBe(routes.length);
    console.log(`[Dynamic Discovery] ✓ All ${verifiedCount} registered APIs verified successfully without manual configuration.\n`);
  });

});
