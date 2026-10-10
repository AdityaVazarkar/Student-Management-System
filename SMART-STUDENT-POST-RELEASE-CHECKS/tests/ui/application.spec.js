const { test, expect } = require('@playwright/test');
const { getEnvironment } = require('../../config/environments');

const env = getEnvironment();

test.describe('Application UI Smoke & Interaction Tests', () => {

  test('Login portal renders brand identity and quick demo credentials', async ({ page }) => {
    await page.goto(env.appUrl);

    // Verify Portal Brand
    await expect(page.locator('h2:has-text("EduManage Portal")')).toBeVisible();

    // Verify 1-Click Demo Buttons
    const teacherDemoBtn = page.locator('button:has-text("Teacher Admin")').first();
    const studentDemoBtn = page.locator('.demo-account-box button:has-text("Student")').first();

    await expect(teacherDemoBtn).toBeVisible();
    await expect(studentDemoBtn).toBeVisible();
  });

  test('Teacher Admin UI flow: Login, view stats and student roster', async ({ page }) => {
    await page.goto(env.appUrl);

    // Click demo login for teacher
    await page.click('button:has-text("Teacher Admin")');

    // Wait for Dashboard to appear
    await expect(page.locator('h2:has-text("Teacher Control Center")')).toBeVisible({ timeout: 10000 });

    // Verify navigation tabs
    await expect(page.locator('button:has-text("Students & Classes")')).toBeVisible();
    await expect(page.locator('button:has-text("Homeworks")')).toBeVisible();
    await expect(page.locator('button:has-text("Submissions & Grading")')).toBeVisible();

    // Switch to Students tab
    await page.click('button:has-text("Students & Classes")');
    await expect(page.locator('table.modern-table')).toBeVisible();
  });

  test('Student UI flow: View assigned homework and class banner', async ({ page }) => {
    await page.goto(env.appUrl);

    // Click demo login for student
    await page.click('button:has-text("Student (Alex)")');

    // Wait for Student Homework view
    await expect(page.locator('h2:has-text("Welcome, Alex Rivera")')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('span:has-text("Grade 10 - Section A")').first()).toBeVisible();

    // Verify homework cards are rendered
    const homeworkCards = page.locator('.homework-card');
    await expect(homeworkCards.first()).toBeVisible();
  });

  test('Theme toggle switches between dark and light themes', async ({ page }) => {
    await page.goto(env.appUrl);

    const themeToggleBtn = page.locator('button[title*="Theme"]');
    if (await themeToggleBtn.isVisible()) {
      const initialTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
      await themeToggleBtn.click();
      const updatedTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
      expect(updatedTheme).not.toBe(initialTheme);
    }
  });

});
