// tests/ui/student-journey.spec.js
const { test, expect } = require('../../fixtures/auth.fixture');
const { getEnvironment } = require('../../config/environments');

const env = getEnvironment();

test.describe('Layer 3: UI Smoke Checks & Shell Verification', () => {

  test('[@ui @critical] Open Student Portal, verify app shell mounts and zero console errors', async ({ page }) => {
    const consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    const response = await page.goto(env.appUrl);
    expect(response?.status()).toBe(200);

    // Verify App Shell
    await expect(page.locator('#root')).toBeVisible();
    await expect(page.locator('h2:has-text("EduManage Portal")')).toBeVisible();

    // Verify Zero Critical Unhandled Errors
    expect(consoleErrors.length, `Detected console errors on load: ${consoleErrors.join(', ')}`).toBe(0);
    console.log('[UI Smoke] ✓ App shell mounted cleanly without console errors.');
  });

  test('[@ui @critical] Student authentication and primary navigation verification', async ({ page }) => {
    await page.goto(env.appUrl);

    // 1. Authenticate via Student credentials
    const demoStudentBtn = page.locator('.demo-account-box button:has-text("Student")').first();
    await demoStudentBtn.click();

    // 2. Verify Student Dashboard mounts
    await expect(page.locator('h2:has-text("Welcome, Alex Rivera")')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('span:has-text("Grade 10 - Section A")').first()).toBeVisible();

    // 3. Verify Primary Navigation tabs
    const homeworkTab = page.locator('button:has-text("My Homework")');
    const gradesTab = page.locator('button:has-text("Submissions & Grades")');

    await expect(homeworkTab).toBeVisible();
    await expect(gradesTab).toBeVisible();

    // 4. Click Submissions & Grades tab
    await gradesTab.click();
    await expect(page.locator('.glass-card').first()).toBeVisible();
    console.log('[UI Smoke] ✓ Student portal primary navigation and grades view verified.');
  });

  test('[@ui @critical] Teacher Admin portal navigation (Dashboard, Students, Homework, Grading)', async ({ page }) => {
    await page.goto(env.appUrl);

    // 1. Authenticate as Teacher
    const demoTeacherBtn = page.locator('button:has-text("Teacher Admin")').first();
    await demoTeacherBtn.click();

    // 2. Verify Teacher Control Center mounts
    await expect(page.locator('h2:has-text("Teacher Control Center")')).toBeVisible({ timeout: 15000 });

    // 3. Verify primary navigation items
    const overviewBtn = page.getByRole('button', { name: 'Overview' });
    const studentsBtn = page.getByRole('button', { name: 'Students & Classes' });
    const homeworkBtn = page.getByRole('button', { name: 'Homeworks' });
    const gradingBtn = page.getByRole('button', { name: 'Submissions & Grading' });
    const classesBtn = page.getByRole('button', { name: 'Classes', exact: true });

    await expect(overviewBtn).toBeVisible();
    await expect(studentsBtn).toBeVisible();
    await expect(homeworkBtn).toBeVisible();
    await expect(gradingBtn).toBeVisible();
    await expect(classesBtn).toBeVisible();

    // 4. Verify Students Table
    await studentsBtn.click();
    await expect(page.locator('table.modern-table')).toBeVisible();
    console.log('[UI Smoke] ✓ Teacher Admin navigation tabs and student roster verified.');
  });

});
