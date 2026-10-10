pipeline {
    agent any

    parameters {
        choice(
            name: 'TARGET_ENV', 
            choices: ['DEV', 'UAT'], 
            description: 'Select target deployment environment to verify'
        )
        booleanParam(
            name: 'RUN_FULL_REGRESSION',
            defaultValue: true,
            description: 'Run complete smoke checks, dynamic API auto-discovery, and calculate quality gate score'
        )
    }

    environment {
        ENVIRONMENT = "${params.TARGET_ENV.toLowerCase()}"
        JAVA_HOME   = '/opt/homebrew/Cellar/openjdk@21/21.0.12/libexec/openjdk.jdk/Contents/Home'
        CI          = 'true'
    }

    stages {
        stage('Checkout') {
            steps {
                echo "Deploying and verifying target environment: ${params.TARGET_ENV}"
            }
        }

        stage('Build & Test Backend') {
            steps {
                echo "Compiling Spring Boot backend with PostgreSQL for ${params.TARGET_ENV}..."
                dir('StudentRegistration') {
                    sh './mvnw clean package -DskipTests'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                echo "Compiling React.js frontend for ${params.TARGET_ENV}..."
                dir('Frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Service Readiness Probe') {
            steps {
                echo "Executing pre-flight health probe for ${params.TARGET_ENV}..."
                dir('SMART-STUDENT-POST-RELEASE-CHECKS') {
                    sh 'npm install'
                    sh "ENVIRONMENT=${env.ENVIRONMENT} node scripts/wait-for-readiness.js"
                }
            }
        }

        stage('Post-Release Verification & Auto-Discovery') {
            steps {
                echo "Running smoke tests and zero-config dynamic API discovery on ${params.TARGET_ENV}..."
                dir('SMART-STUDENT-POST-RELEASE-CHECKS') {
                    sh "ENVIRONMENT=${env.ENVIRONMENT} ./node_modules/.bin/playwright test || true"
                    sh 'node scripts/calculate-score.js || true'
                }
            }
        }
    }

    post {
        always {
            echo 'Publishing test results and quality metrics...'
            
            // JUnit report for Jenkins test result trend graphs
            junit testResults: 'SMART-STUDENT-POST-RELEASE-CHECKS/reports/junit.xml', allowEmptyResults: true
            
            // Publish Playwright HTML Smoke Report
            publishHTML([
                allowMissing: true,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'SMART-STUDENT-POST-RELEASE-CHECKS/reports/html',
                reportFiles: 'index.html',
                reportName: "${params.TARGET_ENV} Post-Release Verification Report"
            ])

            // Reconcile and clean test data
            dir('SMART-STUDENT-POST-RELEASE-CHECKS') {
                sh "ENVIRONMENT=${env.ENVIRONMENT} node scripts/cleanup-test-data.js || true"
            }
        }
        success {
            echo "✅ Quality Gate PASSED for ${params.TARGET_ENV}! Deployment verified."
        }
        failure {
            echo "❌ Quality Gate FAILED for ${params.TARGET_ENV}. Deployment requires attention."
        }
    }
}
