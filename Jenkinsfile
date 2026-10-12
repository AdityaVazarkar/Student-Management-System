
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
            description: 'Run smoke checks, API discovery, and quality scoring'
        )
    }

    environment {
        ENVIRONMENT = "${params.TARGET_ENV.toLowerCase()}"
        JAVA_HOME = '/opt/homebrew/Cellar/openjdk@21/21.0.12/libexec/openjdk.jdk/Contents/Home'
        CI = 'true'
    }

    stages {
        stage('Checkout') {
            steps {
                echo "Target environment: ${params.TARGET_ENV}"
                withEnv(['PATH+NODE=/opt/homebrew/bin']) {
                    sh '''
                        echo "Node: $(command -v node)"
                        echo "npm: $(command -v npm)"
                        node --version
                        npm --version
                        java -version
                    '''
                }
            }
        }

        stage('Build & Test Backend') {
            steps {
                echo "Building Spring Boot backend..."
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
                echo "Building React frontend..."
                withEnv(['PATH+NODE=/opt/homebrew/bin']) {
                    dir('Frontend') {
                        sh 'npm ci'
                        sh 'npm run build'
                    }
                }
            }
        }

        stage('Service Readiness Probe') {
            when {
                expression { params.RUN_FULL_REGRESSION }
            }
            steps {
                echo "Checking service readiness..."
                withEnv(['PATH+NODE=/opt/homebrew/bin']) {
                    dir('SMART-STUDENT-POST-RELEASE-CHECKS') {
                        sh 'npm ci'
                        sh 'node --version'
                        sh 'ENVIRONMENT=$ENVIRONMENT node scripts/wait-for-deployment.js'
                    }
                }
            }
        }

        stage('Post-Release Verification & Auto-Discovery') {
            when {
                expression { params.RUN_FULL_REGRESSION }
            }
            steps {
                echo "Running Playwright verification..."
                withEnv(['PATH+NODE=/opt/homebrew/bin']) {
                    dir('SMART-STUDENT-POST-RELEASE-CHECKS') {
                        sh 'ENVIRONMENT=$ENVIRONMENT ./node_modules/.bin/playwright test'
                        sh 'node scripts/calculate-score.js'
                    }
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

            dir('SMART-STUDENT-POST-RELEASE-CHECKS') {
                withEnv(['PATH+NODE=/opt/homebrew/bin']) {
                    sh 'ENVIRONMENT=$ENVIRONMENT node scripts/cleanup-test-data.js || true'
                }
            }
        }

        success {
            echo "Pipeline completed successfully for ${params.TARGET_ENV}."
        }

        failure {
            echo "Pipeline FAILED for ${params.TARGET_ENV}. Review Console Output."
        }
    }
}
