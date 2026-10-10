const { test: base, expect } = require('@playwright/test');
const { getEnvironment } = require('../../config/environments');

const env = getEnvironment();

exports.test = base.extend({
  teacherPage: async ({ page }, use) => {
    await page.goto(env.appUrl);
    const demoBtn = page.locator('button:has-text("Teacher Admin")');
    if (await demoBtn.isVisible()) {
      await demoBtn.click();
    } else {
      await page.fill('input[type="email"]', env.credentials.teacher.email);
      await page.fill('input[type="password"]', env.credentials.teacher.password);
      await page.click('button[type="submit"]');
    }
    await expect(page.locator('h2:has-text("Teacher Control Center")')).toBeVisible({ timeout: 10000 });
    await use(page);
  },

  studentPage: async ({ page }, use) => {
    await page.goto(env.appUrl);
    const demoBtn = page.locator('button:has-text("Student (Alex)")');
    if (await demoBtn.isVisible()) {
      await demoBtn.click();
    } else {
      await page.fill('input[type="email"]', env.credentials.student.email);
      await page.fill('input[type="password"]', env.credentials.student.password);
      await page.click('button[type="submit"]');
    }
    await expect(page.locator('h2:has-text("Welcome, Alex Rivera")')).toBeVisible({ timeout: 10000 });
    await use(page);
  },
});

exports.expect = expect;
