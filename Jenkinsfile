
pipeline {
    agent any

    triggers {
        githubPush()
        pollSCM('H/2 * * * *')
    }

    options {
        skipDefaultCheckout(true)
        timestamps()
    }

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
        ENVIRONMENT = 'dev'
        JAVA_HOME = '/opt/java/openjdk'
        CI = 'true'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm

                script {
                    env.ENVIRONMENT = params.TARGET_ENV.toLowerCase()
                }

                echo "Target environment: ${params.TARGET_ENV}"

                sh '''
                    set -e
                    echo "Node: $(command -v node)"
                    echo "npm: $(command -v npm)"
                    node --version
                    npm --version
                    echo "JAVA_HOME=$JAVA_HOME"
                    java -version
                '''
            }
        }

        stage('Build & Test Backend') {
            steps {
                echo 'Building Spring Boot backend...'

                dir('StudentRegistration') {
                    withEnv([
                        'JAVA_HOME=/opt/java/openjdk',
                        'PATH+JAVA=/opt/java/openjdk/bin'
                    ]) {
                        sh '''
                            set -e
                            chmod +x mvnw
                            echo "JAVA_HOME=$JAVA_HOME"
                            java -version
                            ./mvnw -version
                            ./mvnw clean package -DskipTests
                        '''
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                echo 'Building React frontend...'

                dir('Frontend') {
                    sh '''
                        set -e
                        node --version
                        npm --version
                        npm ci
                        npm run build
                    '''
                }
            }
        }

        stage('Install Verification Dependencies') {
            when {
                expression { params.RUN_FULL_REGRESSION }
            }
            steps {
                dir('SMART-STUDENT-POST-RELEASE-CHECKS') {
                    sh '''
                        set -e
                        npm ci
                        npx playwright --version
                        npx playwright install chromium
                    '''
                }
            }
        }

        stage('Deploy / Start Services (DEV)') {
            when {
                expression {
                    params.RUN_FULL_REGRESSION &&
                    params.TARGET_ENV == 'DEV'
                }
            }
            steps {
                echo 'Starting services for DEV verification...'

                withEnv(['JENKINS_NODE_COOKIE=dontKillMe']) {
                    sh '''
                        set -e

                        # Stop stale services on the verification ports.
                        lsof -ti:8080 | xargs -r kill -9 2>/dev/null || true
                        lsof -ti:3000 | xargs -r kill -9 2>/dev/null || true

                        # Start Spring Boot backend.
                        test -f StudentRegistration/target/StudentRegistration-0.0.1-SNAPSHOT.jar

                        nohup "$JAVA_HOME/bin/java" \
                            -jar StudentRegistration/target/StudentRegistration-0.0.1-SNAPSHOT.jar \
                            > backend.log 2>&1 < /dev/null &
                        echo $! > backend.pid

                        # Start the Vite preview server.
                        test -x Frontend/node_modules/.bin/vite

                        (
                            cd Frontend
                            nohup ./node_modules/.bin/vite preview \
                                --port 3000 --host 0.0.0.0 \
                                > ../frontend.log 2>&1 < /dev/null &
                            echo $! > ../frontend.pid
                        )

                        echo "Backend PID: $(cat backend.pid)"
                        echo "Frontend PID: $(cat frontend.pid)"
                    '''
                }
            }
        }

        stage('Service Readiness Probe') {
            when {
                expression { params.RUN_FULL_REGRESSION }
            }
            steps {
                echo 'Checking service readiness...'

                dir('SMART-STUDENT-POST-RELEASE-CHECKS') {
                    sh '''
                        set -e
                        ENVIRONMENT="$ENVIRONMENT" \
                            node scripts/wait-for-deployment.js
                    '''
                }
            }
        }

        stage('Post-Release Verification & Auto-Discovery') {
            when {
                expression { params.RUN_FULL_REGRESSION }
            }
            steps {
                echo 'Running Playwright verification...'

                dir('SMART-STUDENT-POST-RELEASE-CHECKS') {
                    sh '''
                        set -e
                        ENVIRONMENT="$ENVIRONMENT" \
                            ./node_modules/.bin/playwright test
                        node scripts/calculate-score.js
                    '''
                }
            }
        }

        stage('Deploy to Vercel') {
            when {
                expression { params.DEPLOY_TO_VERCEL }
            }
            steps {
                echo 'Deploying frontend to Vercel...'

                dir('Frontend') {
                    script {
                        withCredentials([
                            string(
                                credentialsId: 'VERCEL_TOKEN',
                                variable: 'VERCEL_TOKEN'
                            )
                        ]) {
                            sh '''
                                set -e

                                # Use the project-local CLI when available.
                                if [ ! -x node_modules/.bin/vercel ]; then
                                    npm install --no-save vercel
                                fi

                                LIVE_URL=$(./node_modules/.bin/vercel deploy \
                                    --prod --yes \
                                    --name student-management-system \
                                    --token="$VERCEL_TOKEN")

                                echo "Production deployment successful."
                                echo "Live URL: $LIVE_URL"
                            '''
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
                sh '''
                    if [ -d node_modules ] && [ -f scripts/cleanup-test-data.js ]; then
                        ENVIRONMENT="$ENVIRONMENT" \
                            node scripts/cleanup-test-data.js || true
                    else
                        echo "Skipping cleanup: verification dependencies are unavailable."
                    fi
                '''
            }

            // Stop services started for DEV verification.
            sh '''
                if [ -f backend.pid ]; then
                    kill -9 "$(cat backend.pid)" 2>/dev/null || true
                    rm -f backend.pid
                fi

                if [ -f frontend.pid ]; then
                    kill -9 "$(cat frontend.pid)" 2>/dev/null || true
                    rm -f frontend.pid
                fi

                lsof -ti:8080 | xargs -r kill -9 2>/dev/null || true
                lsof -ti:3000 | xargs -r kill -9 2>/dev/null || true
            '''

            junit(
                testResults: 'SMART-STUDENT-POST-RELEASE-CHECKS/reports/junit.xml',
                allowEmptyResults: true
            )

            archiveArtifacts(
                artifacts: 'backend.log,frontend.log,SMART-STUDENT-POST-RELEASE-CHECKS/reports/**',
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
