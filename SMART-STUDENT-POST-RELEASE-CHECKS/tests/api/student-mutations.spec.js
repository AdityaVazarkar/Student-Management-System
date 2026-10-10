// tests/api/student-mutations.spec.js
const { test, expect } = require('../../fixtures/auth.fixture');
const { generateTestStudent } = require('../../fixtures/test-data.fixture');
const { getEnvironment } = require('../../config/environments');

const env = getEnvironment();

test.describe('Layer 2: Student API Mutation Checks (Non-Production Only)', () => {

  let createdStudentId = null;

  test.beforeEach(({}, testInfo) => {
    // Production Guardrail: Skip mutation tests if targeting PROD
    if (env.isProduction) {
      testInfo.skip(true, 'Data mutation tests are strictly prohibited on PROD environment');
    }
  });

  test.afterEach(async ({ studentApi }) => {
    // Automatic cleanup of created student record
    if (createdStudentId) {
      console.log(`[Cleanup] Deleting test student ID: ${createdStudentId}...`);
      await studentApi.deleteStudent(createdStudentId);
      createdStudentId = null;
    }
  });

  test('[@api @write] POST /api/v1/students -> HTTP 201 Created', async ({ studentApi }) => {
    const payload = generateTestStudent('post_smoke');
    const { status, data } = await studentApi.createStudent(payload);

    expect(status, 'POST /api/v1/students should return HTTP 201 Created').toBe(201);

    const created = await data();
    expect(created.id).toBeDefined();
    expect(created.name).toBe(payload.name);
    expect(created.email).toBe(payload.email);

    // Save ID for teardown
    createdStudentId = created.id;
    console.log(`[Mutation Check] ✓ Successfully created student record ID ${created.id} (HTTP 201)`);
  });

  test('[@api @write] PUT /api/v1/students/{id} -> HTTP 200 Updated', async ({ studentApi }) => {
    // 1. Create temporary student
    const initial = generateTestStudent('put_smoke');
    const createRes = await studentApi.createStudent(initial);
    const student = await createRes.data();
    createdStudentId = student.id;

    // 2. Perform update
    const updatePayload = {
      name: `${initial.name} - Updated`,
      email: initial.email,
      rollNumber: `${initial.rollNumber}-MOD`,
      phone: '+1-555-8888',
      className: 'Grade 11 - Science',
    };

    const { status, data } = await studentApi.updateStudent(student.id, updatePayload);
    expect([200, 204]).toContain(status);

    const updated = await data();
    expect(updated.name).toBe(updatePayload.name);
    expect(updated.className).toBe('Grade 11 - Science');
    console.log(`[Mutation Check] ✓ Successfully updated student ID ${student.id} (HTTP ${status})`);
  });

});
