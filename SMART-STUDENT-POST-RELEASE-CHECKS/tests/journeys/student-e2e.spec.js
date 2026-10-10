// tests/journeys/student-e2e.spec.js
const { test, expect } = require('../../fixtures/auth.fixture');
const { getEnvironment } = require('../../config/environments');

const env = getEnvironment();

test.describe('E2E Lifecycle: Student UI to Backend API Flow', () => {

  const testNotes = `Automated Post-Release E2E Submission - ${Date.now()}`;
  const testAttachment = 'https://drive.google.com/sample-e2e-homework-solution.pdf';

  test('[@critical @e2e] Complete Student submission -> Teacher evaluation -> Student grade verification', async ({ page, request }) => {
    // 1. Verify API readiness
    const health = await request.get(`${env.apiUrl}/v1/students/health`);
    expect(health.status()).toBe(200);

    // 2. Student signs in
    await page.goto(env.appUrl);
    await page.click('.demo-account-box button:has-text("Student")');
    await expect(page.locator('h2:has-text("Welcome, Alex Rivera")')).toBeVisible({ timeout: 15000 });

    // 3. Open Homework Submission modal
    const submitBtn = page.locator('.homework-card button').first();
    await submitBtn.click();

    // 4. Fill submission form
    await expect(page.locator('.modal-content')).toBeVisible();
    await page.fill('textarea.form-textarea', testNotes);
    await page.fill('input[type="url"]', testAttachment);
    await page.click('.modal-actions button.btn-primary');

    // 5. Verify confirmation toast
    await expect(page.locator('.toast').first()).toBeVisible({ timeout: 5000 });

    // 6. Switch to Teacher Console
    await page.click('button:has-text("Switch to Teacher")');
    await expect(page.locator('h2:has-text("Teacher Control Center")')).toBeVisible({ timeout: 15000 });

    // 7. Teacher navigates to Grading Queue
    await page.click('button:has-text("Submissions & Grading")');
    await expect(page.locator('table.modern-table')).toBeVisible();

    // 8. Grade the submission
    const gradeBtn = page.locator('table.modern-table button:has-text("Grade Work"), table.modern-table button:has-text("Edit Grade")').first();
    await gradeBtn.click();

    await expect(page.locator('.modal-content')).toBeVisible();
    await page.fill('input[placeholder*="95"]', '98');
    await page.fill('textarea[placeholder*="remarks"]', 'E2E Verified: Excellent accuracy and flawless reasoning.');
    await page.click('.modal-actions button.btn-primary');

    // 9. Verify toast
    await expect(page.locator('.toast').first()).toBeVisible({ timeout: 5000 });

    // 10. Switch back to Student and verify grade
    await page.click('button:has-text("Switch to Student")');
    await expect(page.locator('h2:has-text("Welcome, Alex Rivera")')).toBeVisible({ timeout: 15000 });

    await page.click('button:has-text("Submissions & Grades")');
    await expect(page.locator('.glass-card').first()).toBeVisible();
    await expect(page.locator('text=98 pts').first()).toBeVisible();
    console.log('[E2E Journey] ✓ Full UI -> Student API submission and teacher grading lifecycle PASSED.');
  });

});
