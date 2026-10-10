# SMART-STUDENT-POST-RELEASE-CHECKS

Automated Post-Release Verification, Smoke Checks, Dynamic Endpoint Auto-Discovery, and Quality-Gate Testing Suite for the **Student Management System & Student API** in **Jenkins CI/CD Pipelines**.

Written exclusively in **JavaScript** (`.js` / Node.js LTS) using the **Playwright** test runner.

---

## 📁 Project Architecture & Layout

```text
SMART-STUDENT-POST-RELEASE-CHECKS/
├── package.json                   # Test dependencies & execution scripts
├── playwright.config.js          # Playwright runner configuration (JUnit, HTML, JSON)
├── config/
│   ├── environments.js           # Multi-tier configs for DEV, SIT, UAT, and PROD
│   └── thresholds.js             # Quality gates, SLAs (<2000ms), and scoring metrics
├── tests/
│   ├── health/
│   │   └── student-health.spec.js    # Layer 1: UI & API health, DNS/reachability, DB probe
│   ├── api/
│   │   ├── student-queries.spec.js   # Layer 2: Read-only API smoke checks (@prod-safe)
│   │   ├── student-mutations.spec.js # Layer 2: Write checks with auto-cleanup (lower envs)
│   │   └── dynamic-auto-discovery.spec.js # Zero-Config Auto-Discovery of all runtime APIs
│   ├── ui/
│   │   └── student-journey.spec.js   # Layer 3: Student Portal & Teacher Console smoke tests
│   └── journeys/
│       └── student-e2e.spec.js       # Layer 4: Full UI -> Student API -> Grading lifecycle
├── fixtures/
│   ├── auth.fixture.js               # Reusable test identity session contexts
│   ├── student-api.fixture.js        # Wrapped Playwright request client
│   └── test-data.fixture.js          # Dynamic data generators for student tests
├── scripts/
│   ├── wait-for-deployment.js        # Layer 1: Pre-flight readiness polling with SLA check
│   ├── calculate-score.js            # Quality Gate evaluator and score summary generator
│   ├── cleanup-test-data.js          # Post-run test data teardown routine
│   └── publish-summary.js            # CI/CD Markdown summary report publisher
└── reports/                          # Generated test reports (JUnit XML, HTML, JSON)
```

---

## ⚡ Zero-Config Dynamic API Auto-Discovery

When backend developers add new API endpoints or update routes in Spring Boot, **NO MANUAL TEST UPDATES ARE REQUIRED**:
- `tests/api/dynamic-auto-discovery.spec.js` queries Spring Boot's runtime route mapping table (`/api/system/routes`).
- Automatically scans, probes, and tests every registered REST endpoint (GET, POST, PUT, DELETE).
- Flags any 404 Not Found or 500 Internal Server Errors in real-time.
- Feeds newly discovered routes directly into the Quality Gate scoring engine for DEV and UAT.

---

## 🎯 Production Guardrails & Safety

- **`@prod-safe`**: Safe, read-only smoke checks allowed against `PROD`, `UAT`, `SIT`, and `DEV`.
- **`@write`**: Data mutation checks (`POST`, `PUT`) are strictly blocked/skipped on `PROD`. They only execute on lower environments (`DEV`, `UAT`) and automatically clean up created test data immediately upon test completion.
- **`@critical`**: Core mission-critical regression scenarios that must pass 100% to clear the Jenkins pipeline gate.

---

## 🚀 Execution Commands

### 1. Run Complete Quality Gate Pipeline
```bash
# Development (DEV)
ENVIRONMENT=dev npm run test:all

# User Acceptance Testing (UAT)
ENVIRONMENT=uat npm run test:all

# Production Safe Smoke (PROD)
ENVIRONMENT=prod npm run test:prod-safe
```

### 2. Run Filtered Test Layers
```bash
# Critical priority checks only
npm run test:critical

# Production-safe read-only checks
npm run test:prod-safe

# API layer only (includes dynamic auto-discovery)
npm run test:api

# UI layer only (Student Portal & Teacher Console)
npm run test:ui

# Layer 1 Health & Pre-flight checks
npm run test:health

# Layer 4 End-to-End User Journeys
npm run test:journeys
```

### 3. Utility Scripts
```bash
# Pre-flight deployment probe (< 2000ms latency validation)
node scripts/wait-for-deployment.js

# Calculate score & evaluate Quality Gate
node scripts/calculate-score.js

# Publish Markdown summary for Jenkins
node scripts/publish-summary.js

# Clean up leftover test data
node scripts/cleanup-test-data.js
```

---

## 🏗️ Jenkins CI/CD Pipeline Integration

The workspace includes a production-grade `Jenkinsfile` configured with:
- **`TARGET_ENV` Parameter:** Select `DEV`, `UAT`, or `PROD` from the Jenkins UI.
- **Stage: Pre-Flight Health Checks:** Polls endpoints until ready before running tests.
- **Stage: Post-Release Automated Verification:** Runs the Playwright suite.
- **Stage: Quality Gate Evaluation:** Enforces a minimum 95% pass rate SLA.
- **Post Actions:** Publishes JUnit XML test results (`reports/junit.xml`), archives the Playwright HTML report (`reports/html/index.html`), and injects the summary Markdown into the Jenkins build description.
