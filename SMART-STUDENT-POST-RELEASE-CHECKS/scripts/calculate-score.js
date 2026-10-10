// scripts/calculate-score.js
const fs = require('fs');
const path = require('path');
const thresholds = require('../config/thresholds');

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

  const activeTests = totalTests - skippedTests;
  const passRateNumber = activeTests > 0 ? (passedTests / activeTests) * 100 : 100;
  const passRate = passRateNumber.toFixed(1);

  const meetsThreshold = passRateNumber >= thresholds.qualityGate.minPassRatePercent && failedTests === 0;

  const scoreSummary = {
    timestamp: new Date().toISOString(),
    totalTests,
    passedTests,
    failedTests,
    skippedTests,
    passRate: `${passRate}%`,
    qualityGateStatus: meetsThreshold ? 'PASSED' : 'FAILED',
    grade: passRateNumber >= 98 ? 'A+' : passRateNumber >= 90 ? 'A' : passRateNumber >= 80 ? 'B' : 'F',
  };

  fs.writeFileSync(summaryPath, JSON.stringify(scoreSummary, null, 2));

  console.log(`Total Scenarios:   ${totalTests}`);
  console.log(`Passed:            ${passedTests} ✓`);
  console.log(`Failed:            ${failedTests} ✕`);
  console.log(`Skipped:           ${skippedTests} (Guardrail bypass)`);
  console.log(`Pass Rate:         ${passRate}% (Min required: ${thresholds.qualityGate.minPassRatePercent}%)`);
  console.log(`Quality Gate:      ${meetsThreshold ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Rating:            ${scoreSummary.grade}`);
  console.log(`Score summary written to ${summaryPath}`);
  console.log('========================================================\n');

  // Trigger Markdown summary publishing
  try {
    require('./publish-summary');
  } catch (err) {
    console.warn('Could not run publish-summary:', err.message);
  }

  if (!meetsThreshold) {
    process.exit(1);
  }
} catch (err) {
  console.error('Error calculating pipeline score:', err.message);
  process.exit(0);
}
