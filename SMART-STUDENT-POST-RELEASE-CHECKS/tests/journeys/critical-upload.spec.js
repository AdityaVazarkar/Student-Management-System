const { test, expect } = require('@playwright/test');
const { getEnvironment } = require('../../config/environments');

const env = getEnvironment();

test.describe('Critical Journey: Homework Submission & Teacher Grading Lifecycle', () => {

  const testSolution = `Automated Pipeline Verification Solution - ${new Date().toISOString()}`;
  const testAttachment = 'https://github.com/ci-cd-pipeline-test/solution-sample.pdf';

  test('End-to-End Critical Journey: Submit homework and verify teacher evaluation', async ({ page, request }) => {
    // 1. Verify API readiness
    const health = await request.get(`${env.apiUrl}/dashboard/stats`);
    expect(health.status()).toBe(200);

    // 2. Student logs in via UI
    await page.goto(env.appUrl);
    await page.click('button:has-text("Student (Alex)")');

    // 3. Wait for homework card
    await expect(page.locator('h2:has-text("Welcome, Alex Rivera")')).toBeVisible({ timeout: 10000 });
    const submitBtn = page.locator('.homework-card button').first();
    await submitBtn.click();

    // 4. Modal opens: Fill solution notes and attachment
    await expect(page.locator('.modal-content')).toBeVisible();
    await page.fill('textarea.form-textarea', testSolution);
    await page.fill('input[type="url"]', testAttachment);

    // 5. Submit homework
    await page.click('.modal-actions button.btn-primary');

    // 6. Verify toast notification appears
    await expect(page.locator('.toast').first()).toBeVisible({ timeout: 5000 });

    // 7. Switch to Teacher via Quick Switch in Navbar
    await page.click('button:has-text("Switch to Teacher")');
    await expect(page.locator('h2:has-text("Teacher Control Center")')).toBeVisible({ timeout: 10000 });

    // 8. Teacher navigates to Submissions & Grading tab
    await page.click('button:has-text("Submissions & Grading")');
    await expect(page.locator('table.modern-table')).toBeVisible();

    // 9. Teacher opens grading modal for submission
    const gradeBtn = page.locator('table.modern-table button:has-text("Grade Work"), table.modern-table button:has-text("Edit Grade")').first();
    await gradeBtn.click();

    // 10. Teacher enters score and feedback
    await expect(page.locator('.modal-content')).toBeVisible();
    await page.fill('input[placeholder*="95"]', '99');
    await page.fill('textarea[placeholder*="remarks"]', 'Automated Verification: Outstanding performance and complete step-by-step solutions.');
    await page.click('.modal-actions button.btn-primary');

    // 11. Verify successful grading confirmation
    await expect(page.locator('.toast').first()).toBeVisible({ timeout: 5000 });

    // 12. Switch back to Student to verify received grade
    await page.click('button:has-text("Switch to Student")');
    await expect(page.locator('h2:has-text("Welcome, Alex Rivera")')).toBeVisible({ timeout: 10000 });

    // 13. Check Submissions & Grades tab
    await page.click('button:has-text("Submissions & Grades")');
    await expect(page.locator('.glass-card').first()).toBeVisible();
    await expect(page.locator('text=99 pts').first()).toBeVisible();
  });

});
