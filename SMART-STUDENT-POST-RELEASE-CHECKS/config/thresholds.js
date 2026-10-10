// config/thresholds.js

const thresholds = {
  // Performance response time thresholds
  performance: {
    healthCheckMaxMs: 2000,       // Pre-flight health response time < 2000ms
    apiQueryMaxMs: 2500,          // Read queries response time
    mutationMaxMs: 3500,          // Write operations response time
    uiPageLoadMaxMs: 5000,        // Frontend page load max time
  },

  // Quality gate pass rate targets
  qualityGate: {
    minPassRatePercent: 95.0,     // Minimum pass rate required to pass pipeline Quality Gate
    prodSafeStrictPass: 100.0,    // Production safe tests must be 100% passing
    allowedFailures: 0,
  },

  // Environment Guardrails
  environments: {
    prod: {
      allowMutations: false,      // Strict: No data mutations allowed against PROD
      enforceTags: ['@prod-safe'],
    },
    uat: {
      allowMutations: true,       // Mutations allowed with mandatory automatic cleanup
    },
    dev: {
      allowMutations: true,
    },
    sit: {
      allowMutations: true,
    },
  },
};

module.exports = thresholds;
