const { test, expect } = require('@playwright/test');
const { getEnvironment } = require('../../config/environments');

const env = getEnvironment();

test.describe('Read-Only API Smoke Verification', () => {

  test('Teacher authentication endpoint returns ADMIN role', async ({ request }) => {
    const response = await request.post(`${env.apiUrl}/auth/login`, {
      data: {
        email: env.credentials.teacher.email,
        password: env.credentials.teacher.password,
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.role).toBe('ADMIN');
    expect(body.email).toBe(env.credentials.teacher.email);
  });

  test('Student authentication endpoint returns STUDENT role and assigned class', async ({ request }) => {
    const response = await request.post(`${env.apiUrl}/auth/login`, {
      data: {
        email: env.credentials.student.email,
        password: env.credentials.student.password,
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.role).toBe('STUDENT');
    expect(body.className).toBeDefined();
    expect(body.rollNumber).toBeDefined();
  });

  test('Classrooms endpoint returns active sections', async ({ request }) => {
    const response = await request.get(`${env.apiUrl}/classes`);
    expect(response.status()).toBe(200);

    const classes = await response.json();
    expect(Array.isArray(classes)).toBeTruthy();
    expect(classes.length).toBeGreaterThanOrEqual(1);

    const classNames = classes.map(c => c.name);
    expect(classNames.some(name => name.includes('Grade 10'))).toBeTruthy();
  });

  test('Homework list endpoint returns active curriculum assignments', async ({ request }) => {
    const response = await request.get(`${env.apiUrl}/homework`);
    expect(response.status()).toBe(200);

    const homework = await response.json();
    expect(Array.isArray(homework)).toBeTruthy();
    expect(homework.length).toBeGreaterThanOrEqual(1);
    expect(homework[0].title).toBeDefined();
    expect(homework[0].subject).toBeDefined();
  });

});
