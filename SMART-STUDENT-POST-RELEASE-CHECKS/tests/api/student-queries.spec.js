// tests/api/student-queries.spec.js
const { test, expect } = require('../../fixtures/auth.fixture');
const { getEnvironment } = require('../../config/environments');

const env = getEnvironment();

test.describe('Layer 2: Read-Only Student API Checks', () => {

  test('[@api @prod-safe @critical] GET /api/v1/students/health -> HTTP 200 OK', async ({ studentApi }) => {
    const { status, data } = await studentApi.getHealth();
    expect(status).toBe(200);

    const body = await data();
    expect(body.status).toBe('UP');
  });

  test('[@api @prod-safe @critical] GET /api/v1/students -> Valid schema & HTTP 200', async ({ studentApi }) => {
    const { status, data } = await studentApi.getAllStudents();
    expect(status).toBe(200);

    const students = await data();
    expect(Array.isArray(students)).toBeTruthy();
    expect(students.length).toBeGreaterThan(0);

    const firstStudent = students[0];
    expect(firstStudent).toHaveProperty('id');
    expect(firstStudent).toHaveProperty('name');
    expect(firstStudent).toHaveProperty('email');
    expect(firstStudent).toHaveProperty('role', 'STUDENT');
    expect(firstStudent).toHaveProperty('className');
  });

  test('[@api @prod-safe] GET /api/v1/students/{id} -> Returns expected student structure', async ({ studentApi }) => {
    const { data: allData } = await studentApi.getAllStudents();
    const students = await allData();
    const targetId = students[0].id;

    const { status, data } = await studentApi.getStudentById(targetId);
    expect(status).toBe(200);

    const student = await data();
    expect(student.id).toBe(targetId);
    expect(typeof student.name).toBe('string');
    expect(student.email).toContain('@');
    expect(student.role).toBe('STUDENT');
  });

  test('[@api @prod-safe] Negative auth check: Invalid credentials rejected with 4xx', async ({ request }) => {
    const response = await request.post(`${env.apiUrl}/auth/login`, {
      data: {
        email: 'unauthorized_hacker@invalid.com',
        password: 'wrong_password_123',
      },
    });

    expect(response.status()).toBeGreaterThanOrEqual(400);
    expect(response.status()).toBeLessThan(500);

    const body = await response.json();
    expect(body.error).toBeDefined();
    console.log(`[Security Check] ✓ Invalid authentication correctly rejected with HTTP ${response.status()}`);
  });

});
