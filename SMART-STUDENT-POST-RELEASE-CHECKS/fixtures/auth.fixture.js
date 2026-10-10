// fixtures/auth.fixture.js
const { test: base, expect } = require('@playwright/test');
const { getEnvironment } = require('../config/environments');
const { StudentApiClient } = require('./student-api.fixture');

const env = getEnvironment();

exports.test = base.extend({
  // Injected Student API Client
  studentApi: async ({ request }, use) => {
    const client = new StudentApiClient(request);
    await use(client);
  },

  // Authenticated Teacher Browser Session
  teacherPage: async ({ page }, use) => {
    await page.goto(env.appUrl);
    const demoBtn = page.locator('button:has-text("Teacher Admin")').first();
    if (await demoBtn.isVisible()) {
      await demoBtn.click();
    } else {
      await page.fill('input[type="email"]', env.credentials.teacher.email);
      await page.fill('input[type="password"]', env.credentials.teacher.password);
      await page.click('button[type="submit"]');
    }
    await expect(page.locator('h2:has-text("Teacher Control Center")')).toBeVisible({ timeout: 15000 });
    await use(page);
  },

  // Authenticated Student Browser Session
  studentPage: async ({ page }, use) => {
    await page.goto(env.appUrl);
    const demoBtn = page.locator('.demo-account-box button:has-text("Student")').first();
    if (await demoBtn.isVisible()) {
      await demoBtn.click();
    } else {
      await page.fill('input[type="email"]', env.credentials.student.email);
      await page.fill('input[type="password"]', env.credentials.student.password);
      await page.click('button[type="submit"]');
    }
    await expect(page.locator('h2:has-text("Welcome, Alex Rivera")')).toBeVisible({ timeout: 15000 });
    await use(page);
  },
});

exports.expect = expect;
