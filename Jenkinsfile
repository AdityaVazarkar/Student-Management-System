
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
        PATH+NODE   = '/opt/homebrew/bin'
        CI          = 'true'
    }

    stages {
        stage('Checkout') {
            steps {
                echo "Deploying and verifying target environment: ${params.TARGET_ENV}"
                sh '''
                    echo "Node: $(command -v node || true)"
                    echo "npm: $(command -v npm || true)"
                    node --version
                    npm --version
                    java -version
                '''
            }
        }

        stage('Build & Test Backend') {
            steps {
                echo "Building Spring Boot backend for ${params.TARGET_ENV}..."
                dir('StudentRegistration') {
                    sh '''
                        chmod +x mvnw
                        ./mvnw clean package
                    '''
                }
            }
        }

        stage('Build Frontend') {
            steps {
                echo "Building React frontend for ${params.TARGET_ENV}..."
                dir('Frontend') {
                    sh 'npm ci'
                    sh 'npm run build'
                }
            }
        }

        stage('Service Readiness Probe') {
            when {
                expression { params.RUN_FULL_REGRESSION }
            }
            steps {
                echo "Executing readiness probe for ${params.TARGET_ENV}..."
                dir('SMART-STUDENT-POST-RELEASE-CHECKS') {
                    sh 'npm ci'
                    sh "ENVIRONMENT=${env.ENVIRONMENT} node scripts/wait-for-deployment.js"
                }
            }
        }

        stage('Post-Release Verification & Auto-Discovery') {
            when {
                expression { params.RUN_FULL_REGRESSION }
            }
            steps {
                echo "Running smoke tests and API discovery for ${params.TARGET_ENV}..."
                dir('SMART-STUDENT-POST-RELEASE-CHECKS') {
                    sh "ENVIRONMENT=${env.ENVIRONMENT} ./node_modules/.bin/playwright test"
                    sh 'node scripts/calculate-score.js'
                }
            }
        }
    }

    post {
        always {
            echo 'Publishing test results and quality metrics...'

            junit(
                testResults: 'SMART-STUDENT-POST-RELEASE-CHECKS/reports/junit.xml',
                allowEmptyResults: true
            )

            archiveArtifacts(
                artifacts: 'SMART-STUDENT-POST-RELEASE-CHECKS/reports/**',
                allowEmptyArchive: true
            )

            // Publish HTML only after installing the HTML Publisher plugin.
            script {
                def htmlPublisherAvailable =
                    Jenkins.instance.pluginManager.getPlugin('htmlpublisher') != null

                if (htmlPublisherAvailable) {
                    publishHTML([
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'SMART-STUDENT-POST-RELEASE-CHECKS/reports/html',
                        reportFiles: 'index.html',
                        reportName: "${params.TARGET_ENV} Post-Release Verification Report"
                    ])
                } else {
                    echo 'HTML Publisher plugin is not installed; skipping HTML report publishing.'
                }
            }

            dir('SMART-STUDENT-POST-RELEASE-CHECKS') {
                sh 'ENVIRONMENT=$ENVIRONMENT node scripts/cleanup-test-data.js || true'
            }
        }

        success {
            echo "Quality Gate PASSED for ${params.TARGET_ENV}."
        }

        failure {
            echo "Quality Gate FAILED for ${params.TARGET_ENV}. Review Console Output."
        }
    }
}
