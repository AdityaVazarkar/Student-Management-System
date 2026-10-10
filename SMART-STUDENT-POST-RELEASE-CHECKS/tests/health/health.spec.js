const { test, expect } = require('@playwright/test');
const { getEnvironment } = require('../../config/environments');

const env = getEnvironment();

test.describe('Post-Release Health Checks', () => {

  test('Backend API Health & Statistics endpoint returns 200 OK', async ({ request }) => {
    const response = await request.get(`${env.apiUrl}/dashboard/stats`);
    expect(response.status()).toBe(200);

    const stats = await response.json();
    expect(stats).toBeDefined();
    expect(typeof stats.totalStudents).toBe('number');
    expect(typeof stats.totalClasses).toBe('number');
    expect(typeof stats.totalHomework).toBe('number');
    expect(stats.totalStudents).toBeGreaterThanOrEqual(1);
  });

  test('Frontend Web Application loads successfully', async ({ page }) => {
    const response = await page.goto(env.appUrl);
    expect(response?.status()).toBe(200);

    await expect(page).toHaveTitle(/EduManage/);
    const brandElement = page.locator('.brand-text, .auth-header');
    await expect(brandElement.first()).toBeVisible();
  });

  test('Database connection verified via student roster endpoint', async ({ request }) => {
    const response = await request.get(`${env.apiUrl}/students`);
    expect(response.status()).toBe(200);

    const students = await response.json();
    expect(Array.isArray(students)).toBeTruthy();
    expect(students.length).toBeGreaterThanOrEqual(1);
  });

});
