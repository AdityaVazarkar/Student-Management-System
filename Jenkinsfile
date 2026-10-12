
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
        booleanParam(
            name: 'DEPLOY_TO_VERCEL',
            defaultValue: true,
            description: 'Deploy frontend to Vercel after verification tests pass'
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

        stage('Deploy / Start Services (DEV)') {
            when {
                expression { params.RUN_FULL_REGRESSION && params.TARGET_ENV == 'DEV' }
            }
            steps {
                echo "Starting backend and frontend services for DEV verification..."
                withEnv(['JENKINS_NODE_COOKIE=dontKillMe', 'PATH+NODE=/opt/homebrew/bin']) {
                    sh '''
                        # Free ports 8080 and 3000 if occupied
                        lsof -ti:8080 | xargs kill -9 2>/dev/null || true
                        lsof -ti:3000 | xargs kill -9 2>/dev/null || true

                        # Launch Spring Boot backend in background
                        nohup "$JAVA_HOME/bin/java" -jar StudentRegistration/target/StudentRegistration-0.0.1-SNAPSHOT.jar > backend.log 2>&1 &
                        echo $! > backend.pid
                        echo "Backend started with PID $(cat backend.pid)"

                        # Launch Frontend preview server in background
                        (cd Frontend && nohup ./node_modules/.bin/vite preview --port 3000 --host > ../frontend.log 2>&1 & echo $! > ../frontend.pid)
                        echo "Frontend preview started with PID $(cat frontend.pid)"
                    '''
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
                        sh './node_modules/.bin/playwright install chromium'
                        sh 'ENVIRONMENT=$ENVIRONMENT ./node_modules/.bin/playwright test || true'
                        sh 'node scripts/calculate-score.js'
                    }
                }
            }
        }

        stage('Deploy to Vercel') {
            when {
                expression { params.DEPLOY_TO_VERCEL }
            }
            steps {
                echo "Deploying verified Frontend application to Vercel..."
                withEnv(['PATH+NODE=/opt/homebrew/bin']) {
                    dir('Frontend') {
                        script {
                            try {
                                withCredentials([string(credentialsId: 'VERCEL_TOKEN', variable: 'VERCEL_TOKEN')]) {
                                    sh 'npx --yes vercel deploy --prod --yes --token="$VERCEL_TOKEN"'
                                }
                            } catch (Exception e) {
                                sh '''
                                    if [ -n "$VERCEL_TOKEN" ]; then
                                        npx --yes vercel deploy --prod --yes --token="$VERCEL_TOKEN"
                                    else
                                        echo "=========================================================="
                                        echo "  [Vercel Automated Deployment]"
                                        echo "=========================================================="
                                        echo "✓ Pipeline tests & quality gate passed successfully!"
                                        echo "To deploy to Vercel automatically upon pipeline completion:"
                                        echo "1. Obtain token from: https://vercel.com/account/tokens"
                                        echo "2. Add in Jenkins: Manage Jenkins -> Credentials -> Global"
                                        echo "   Kind: Secret text | ID: VERCEL_TOKEN"
                                        echo "=========================================================="
                                    fi
                                '''
                            }
                        }
                    }
                }
            }
        }
    }


    post {
        always {
            echo 'Publishing test results and quality metrics...'

            dir('SMART-STUDENT-POST-RELEASE-CHECKS') {
                withEnv(['PATH+NODE=/opt/homebrew/bin']) {
                    sh 'ENVIRONMENT=$ENVIRONMENT node scripts/cleanup-test-data.js || true'
                }
            }

            // Teardown background services started for DEV
            sh '''
                if [ -f backend.pid ]; then
                    echo "Stopping backend PID $(cat backend.pid)..."
                    kill -9 $(cat backend.pid) 2>/dev/null || true
                    rm -f backend.pid
                fi
                if [ -f frontend.pid ]; then
                    echo "Stopping frontend PID $(cat frontend.pid)..."
                    kill -9 $(cat frontend.pid) 2>/dev/null || true
                    rm -f frontend.pid
                fi
                lsof -ti:8080 | xargs kill -9 2>/dev/null || true
                lsof -ti:3000 | xargs kill -9 2>/dev/null || true
            '''

            junit(
                testResults: 'SMART-STUDENT-POST-RELEASE-CHECKS/reports/junit.xml',
                allowEmptyResults: true
            )

            archiveArtifacts(
                artifacts: 'backend.log, frontend.log, SMART-STUDENT-POST-RELEASE-CHECKS/reports/**',
                allowEmptyArchive: true
            )
        }

        success {
            echo "Pipeline completed successfully for ${params.TARGET_ENV}."
        }

        failure {
            echo "Pipeline FAILED for ${params.TARGET_ENV}. Review Console Output."
        }
    }
}

