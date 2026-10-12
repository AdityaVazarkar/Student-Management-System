
/* config/environments.js */
require('dotenv').config();

const environments = {
  dev: {
    name: 'Development Environment (DEV)',
    appUrl:
      process.env.DEV_APP_URL ||
      process.env.APP_URL ||
      'http://localhost:3000',
    apiUrl:
      process.env.DEV_API_URL ||
      process.env.API_URL ||
      'http://localhost:8080/api',
    isProduction: false,
    timeout: 30000,
    credentials: {
      teacher: {
        email:
          process.env.DEV_TEACHER_EMAIL ||
          process.env.TEACHER_EMAIL ||
          'teacher@school.com',
        password:
          process.env.DEV_TEACHER_PASSWORD ||
          process.env.TEACHER_PASSWORD ||
          'admin123',
      },
      student: {
        email:
          process.env.DEV_STUDENT_EMAIL ||
          process.env.STUDENT_EMAIL ||
          'alex@student.com',
        password:
          process.env.DEV_STUDENT_PASSWORD ||
          process.env.STUDENT_PASSWORD ||
          'student123',
      },
    },
  },

  sit: {
    name: 'System Integration Testing (SIT)',
    appUrl:
      process.env.SIT_APP_URL ||
      process.env.APP_URL ||
      'http://localhost:3000',
    apiUrl:
      process.env.SIT_API_URL ||
      process.env.API_URL ||
      'http://localhost:8080/api',
    isProduction: false,
    timeout: 35000,
    credentials: {
      teacher: {
        email: process.env.SIT_TEACHER_EMAIL || 'teacher@school.com',
        password: process.env.SIT_TEACHER_PASSWORD || 'admin123',
      },
      student: {
        email: process.env.SIT_STUDENT_EMAIL || 'alex@student.com',
        password: process.env.SIT_STUDENT_PASSWORD || 'student123',
      },
    },
  },

  uat: {
    name: 'User Acceptance Testing (UAT)',
    appUrl:
      process.env.UAT_APP_URL ||
      process.env.APP_URL ||
      'http://localhost:3000',
    apiUrl:
      process.env.UAT_API_URL ||
      process.env.API_URL ||
      'http://localhost:8080/api',
    isProduction: false,
    timeout: 45000,
    credentials: {
      teacher: {
        email: process.env.UAT_TEACHER_EMAIL || 'teacher@school.com',
        password: process.env.UAT_TEACHER_PASSWORD || 'admin123',
      },
      student: {
        email: process.env.UAT_STUDENT_EMAIL || 'alex@student.com',
        password: process.env.UAT_STUDENT_PASSWORD || 'student123',
      },
    },
  },

  prod: {
    name: 'Production Environment (PROD)',
    appUrl:
      process.env.PROD_APP_URL ||
      'https://student.school.edu',
    apiUrl:
      process.env.PROD_API_URL ||
      'https://api.student.school.edu/api',
    isProduction: true,
    timeout: 60000,
    credentials: {
      teacher: {
        email: process.env.PROD_TEACHER_EMAIL || 'teacher@school.com',
        password: process.env.PROD_TEACHER_PASSWORD || 'admin123',
      },
      student: {
        email: process.env.PROD_STUDENT_EMAIL || 'alex@student.com',
        password: process.env.PROD_STUDENT_PASSWORD || 'student123',
      },
    },
  },
};

function getEnvironment() {
  const current = (process.env.ENVIRONMENT || 'dev')
    .toLowerCase()
    .trim();

  return environments[current] || environments.dev;
}

module.exports = {
  environments,
  getEnvironment,
};
