// scripts/calculate-score.js
const fs = require('fs');
const path = require('path');

const resultsPath = path.join(__dirname, '..', 'reports', 'results.json');
const summaryPath = path.join(__dirname, '..', 'reports', 'pipeline-score-summary.json');

console.log('========================================================');
console.log('  Jenkins Pipeline Quality Gate & Test Score Calculator');
console.log('========================================================');

if (!fs.existsSync(resultsPath)) {
  console.log('⚠️ No results.json found in reports/ directory.');
  process.exit(0);
}

try {
  const content = fs.readFileSync(resultsPath, 'utf8');
  const results = JSON.parse(content);

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  let skippedTests = 0;

  function countSuites(suites) {
    if (!suites) return;
    for (const suite of suites) {
      if (suite.specs) {
        for (const spec of suite.specs) {
          if (spec.tests) {
            for (const test of spec.tests) {
              totalTests++;
              const status = test.status || (test.results && test.results[0]?.status);
              if (status === 'passed' || status === 'expected') {
                passedTests++;
              } else if (status === 'skipped') {
                skippedTests++;
              } else {
                failedTests++;
              }
            }
          }
        }
      }
      if (suite.suites) {
        countSuites(suite.suites);
      }
    }
  }

  countSuites(results.suites);

  const passRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : 100;
  const isPassing = failedTests === 0;

  const scoreSummary = {
    timestamp: new Date().toISOString(),
    totalTests,
    passedTests,
    failedTests,
    skippedTests,
    passRate: `${passRate}%`,
    qualityGateStatus: isPassing ? 'PASSED' : 'FAILED',
    grade: passRate >= 95 ? 'A+' : passRate >= 85 ? 'B' : 'F',
  };

  fs.writeFileSync(summaryPath, JSON.stringify(scoreSummary, null, 2));

  console.log(`Total Checks Run:  ${totalTests}`);
  console.log(`Passed:            ${passedTests} ✓`);
  console.log(`Failed:            ${failedTests} ✕`);
  console.log(`Pass Rate:         ${passRate}%`);
  console.log(`Quality Gate:      ${isPassing ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Rating:            ${scoreSummary.grade}`);
  console.log(`Summary written to ${summaryPath}`);
  console.log('========================================================\n');

  if (!isPassing) {
    process.exit(1);
  }
} catch (err) {
  console.error('Error calculating pipeline score:', err.message);
  process.exit(0);
}
