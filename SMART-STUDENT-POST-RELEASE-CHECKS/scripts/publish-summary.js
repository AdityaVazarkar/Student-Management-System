// scripts/publish-summary.js
const fs = require('fs');
const path = require('path');
const { getEnvironment } = require('../config/environments');

const env = getEnvironment();
const scoreFile = path.join(__dirname, '..', 'reports', 'pipeline-score-summary.json');
const summaryMdFile = path.join(__dirname, '..', 'reports', 'summary.md');

let scoreData = {
  totalTests: 0,
  passedTests: 0,
  failedTests: 0,
  skippedTests: 0,
  passRate: '0%',
  qualityGateStatus: 'UNKNOWN',
  grade: 'N/A',
};

if (fs.existsSync(scoreFile)) {
  try {
    scoreData = JSON.parse(fs.readFileSync(scoreFile, 'utf8'));
  } catch (err) {
    console.error('Could not parse score file:', err.message);
  }
}

const statusBadge = scoreData.qualityGateStatus === 'PASSED' ? '🟢 PASSED' : '🔴 FAILED';

const markdown = `# Post-Release Verification & Quality Gate Summary

**Target Environment:** \`${env.name}\`  
**Execution Timestamp:** \`${scoreData.timestamp || new Date().toISOString()}\`  
**Quality Gate Verdict:** **${statusBadge}**  
**SLA Rating:** \`${scoreData.grade}\`  

---

## 📊 Test Execution Breakdown

| Metric | Result | Target / Standard |
|---|---|---|
| **Quality Gate Status** | **${scoreData.qualityGateStatus}** | PASSED |
| **Pass Rate** | **${scoreData.passRate}** | ≥ 95.0% |
| **Total Checks** | \`${scoreData.totalTests}\` | All Scenarios |
| **Passed Checks** | \`${scoreData.passedTests}\` | Maximize |
| **Failed Checks** | \`${scoreData.failedTests}\` | 0 |
| **Skipped Checks** | \`${scoreData.skippedTests}\` | Production Guardrails |

---

## 🔍 Verification Layers Covered
- **Layer 1 (Pre-Flight Health):** API & UI Response Times (< 2000ms SLA)
- **Layer 2 (API Smoke Checks):** Read-only checks (\`@prod-safe\`), Mutations with cleanup (\`@write\`), and Zero-Config Route Discovery
- **Layer 3 (UI Smoke Checks):** App Shell mount, Student & Teacher Portal navigation, zero unhandled errors
- **Layer 4 (End-to-End Journeys):** Full submission-to-grading lifecycle

---
*Report generated automatically by \`SMART-STUDENT-POST-RELEASE-CHECKS\` for Jenkins CI/CD.*
`;

fs.writeFileSync(summaryMdFile, markdown);
console.log(`[Summary Publisher] ✓ Markdown summary successfully written to ${summaryMdFile}`);
