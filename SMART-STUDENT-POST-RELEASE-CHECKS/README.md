# SMART-STUDENT-POST-RELEASE-CHECKS

Automated post-release verification, smoke checks, and quality-gate testing suite for the **Student Management System** in a **Jenkins CI/CD Pipeline**.

---

## 📁 Directory Structure

```text
SMART-STUDENT-POST-RELEASE-CHECKS/
├── package.json               # Test suite dependencies & npm scripts
├── package-lock.json          # Dependency lockfile
├── playwright.config.js       # Playwright configuration with JUnit & HTML reporters
├── .gitignore                 # Ignored reports & node_modules
├── .env.example               # Template environment configuration
├── README.md                  # Documentation and execution guide
├── config/
│   └── environments.js        # Environment profiles (local, dev, staging, prod)
├── tests/
│   ├── health/
│   │   └── health.spec.js     # Backend, frontend & database readiness checks
│   ├── api/
│   │   └── esg-readonly.spec.js # API smoke tests (Auth, Students, Homework)
│   ├── ui/
│   │   └── application.spec.js # UI smoke tests (Login, Navigation, Themes)
│   ├── journeys/
│   │   └── critical-upload.spec.js # E2E student submission & grading flow
│   ├── fixtures/
│   │   └── auth.fixture.js    # Reusable authenticated session fixtures
│   └── test-data/
│       └── safe-files/        # Safe fixture uploads
│           └── sample-homework-submission.txt
├── scripts/
│   ├── wait-for-readiness.js  # Pre-test probe with exponential retries
│   ├── cleanup-test-data.js   # Post-test state reconciliation
│   └── calculate-score.js     # Test pass-rate & quality gate calculator
└── reports/                   # Output folder for JUnit XML & HTML reports
```

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
cd SMART-STUDENT-POST-RELEASE-CHECKS
npm install
npx playwright install --with-deps chromium
```

### 2. Configure Environment
```bash
cp .env.example .env
```

### 3. Run Checks
```bash
# Wait for services to be ready and run full suite
npm run test:all

# Or run specific layers
npm run test:health     # Health checks
npm run test:api        # API checks
npm run test:ui         # UI checks
npm run test:journeys   # End-to-end critical journey
```

---

## 🏗️ Jenkins Integration

In Jenkins, this folder is executed in the `Post-Release Verification` stage:

```groovy
stage('Post-Release Verification') {
    steps {
        dir('SMART-STUDENT-POST-RELEASE-CHECKS') {
            sh 'npm install'
            sh 'npx playwright install chromium'
            sh 'npm run test:all'
        }
    }
    post {
        always {
            junit 'SMART-STUDENT-POST-RELEASE-CHECKS/reports/junit.xml'
            publishHTML([
                reportDir: 'SMART-STUDENT-POST-RELEASE-CHECKS/reports/html',
                reportFiles: 'index.html',
                reportName: 'Playwright Smoke Report'
            ])
        }
    }
}
```
