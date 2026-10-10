require('dotenv').config();

const environments = {
  local: {
    name: 'Local Development Environment',
    appUrl: process.env.APP_URL || 'http://localhost:3000',
    apiUrl: process.env.API_URL || 'http://localhost:8080/api',
    timeout: 30000,
    credentials: {
      teacher: {
        email: process.env.TEACHER_EMAIL || 'teacher@school.com',
        password: process.env.TEACHER_PASSWORD || 'admin123',
      },
      student: {
        email: process.env.STUDENT_EMAIL || 'alex@student.com',
        password: process.env.STUDENT_PASSWORD || 'student123',
      },
    },
  },
  dev: {
    name: 'Development Environment (DEV)',
    appUrl: process.env.DEV_APP_URL || process.env.APP_URL || 'http://localhost:3000',
    apiUrl: process.env.DEV_API_URL || process.env.API_URL || 'http://localhost:8080/api',
    timeout: 45000,
    credentials: {
      teacher: {
        email: process.env.DEV_TEACHER_EMAIL || process.env.TEACHER_EMAIL || 'teacher@school.com',
        password: process.env.DEV_TEACHER_PASSWORD || process.env.TEACHER_PASSWORD || 'admin123',
      },
      student: {
        email: process.env.DEV_STUDENT_EMAIL || process.env.STUDENT_EMAIL || 'alex@student.com',
        password: process.env.DEV_STUDENT_PASSWORD || process.env.STUDENT_PASSWORD || 'student123',
      },
    },
  },
  uat: {
    name: 'User Acceptance Testing (UAT)',
    appUrl: process.env.UAT_APP_URL || process.env.APP_URL || 'http://localhost:3000',
    apiUrl: process.env.UAT_API_URL || process.env.API_URL || 'http://localhost:8080/api',
    timeout: 60000,
    credentials: {
      teacher: {
        email: process.env.UAT_TEACHER_EMAIL || process.env.TEACHER_EMAIL || 'teacher@school.com',
        password: process.env.UAT_TEACHER_PASSWORD || process.env.TEACHER_PASSWORD || 'admin123',
      },
      student: {
        email: process.env.UAT_STUDENT_EMAIL || process.env.STUDENT_EMAIL || 'alex@student.com',
        password: process.env.UAT_STUDENT_PASSWORD || process.env.STUDENT_PASSWORD || 'student123',
      },
    },
  },
};

function getEnvironment() {
  const current = (process.env.ENVIRONMENT || 'local').toLowerCase().trim();
  return environments[current] || environments.local;
}

module.exports = {
  environments,
  getEnvironment,
};
