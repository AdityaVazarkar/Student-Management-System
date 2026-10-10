// fixtures/test-data.fixture.js

function generateTestStudent(prefix = 'smoke_test') {
  const timestamp = Date.now();
  const randomSuffix = Math.floor(Math.random() * 1000);

  return {
    name: `Test Student ${randomSuffix}`,
    email: `${prefix}_${timestamp}_${randomSuffix}@student.test`,
    rollNumber: `STU-TEST-${randomSuffix}`,
    phone: `+1-555-${String(randomSuffix).padStart(4, '0')}`,
    className: 'Grade 10 - Section A',
  };
}

function generateHomeworkSubmission(studentId, homeworkId) {
  return {
    studentId,
    homeworkId,
    content: `Automated Post-Release Verification Answer submitted at ${new Date().toISOString()}`,
    attachmentUrl: 'https://github.com/ci-cd-test/sample-solution.pdf',
  };
}

module.exports = {
  generateTestStudent,
  generateHomeworkSubmission,
};
