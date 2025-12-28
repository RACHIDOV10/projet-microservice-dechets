pipeline {
    agent any

    tools {
        maven 'Maven'
        jdk 'JDK17'
        nodejs 'NodeJS'
    }

    environment {
        SONAR_TOKEN = credentials('projet3d-token')
        SONAR_HOST_URL = 'http://localhost:9000'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build & Test Spring Boot Services') {
            parallel {
                stage('Admin Service') {
                    steps {
                        dir('admin-service') {
                            bat 'mvn clean compile test'
                        }
                    }
                }
                stage('Gateway Service') {
                    steps {
                        dir('gatewayy-service') {
                            bat 'mvn clean compile test'
                        }
                    }
                }
                stage('Robot Service') {
                    steps {
                        dir('robot-service') {
                            bat 'mvn clean compile test'
                        }
                    }
                }
                stage('Waste Service') {
                    steps {
                        dir('waste-service') {
                            bat 'mvn clean compile test'
                        }
                    }
                }
            }
        }

        stage('SonarQube Analysis') {
            parallel {
                // ---- Spring Boot Services ----
                stage('SonarQube - Admin Service') {
                    steps {
                        dir('admin-service') {
                            bat "mvn sonar:sonar -Dsonar.host.url=%SONAR_HOST_URL% -Dsonar.login=%SONAR_TOKEN%"
                        }
                    }
                }
                stage('SonarQube - Gateway Service') {
                    steps {
                        dir('gatewayy-service') {
                            bat "mvn sonar:sonar -Dsonar.host.url=%SONAR_HOST_URL% -Dsonar.login=%SONAR_TOKEN%"
                        }
                    }
                }
                stage('SonarQube - Robot Service') {
                    steps {
                        dir('robot-service') {
                            bat "mvn sonar:sonar -Dsonar.host.url=%SONAR_HOST_URL% -Dsonar.login=%SONAR_TOKEN%"
                        }
                    }
                }
                stage('SonarQube - Waste Service') {
                    steps {
                        dir('waste-service') {
                            bat "mvn sonar:sonar -Dsonar.host.url=%SONAR_HOST_URL% -Dsonar.login=%SONAR_TOKEN%"
                        }
                    }
                }

                // ---- FastAPI Service ----
                stage('SonarQube - FastAPI Service') {
                    steps {
                        dir('ai-service') {
                            bat '''
                                call venv\\Scripts\\activate.bat
                                sonar-scanner -Dsonar.host.url=%SONAR_HOST_URL% -Dsonar.login=%SONAR_TOKEN%
                            '''
                        }
                    }
                }

                // ---- React Frontend ----
                stage('SonarQube - React Frontend') {
                    steps {
                        dir('wastebot-frontend') {
                            bat 'sonar-scanner -Dsonar.host.url=%SONAR_HOST_URL% -Dsonar.login=%SONAR_TOKEN%'
                        }
                    }
                }
            }
        }

        stage('Build & Test FastAPI Service') {
            steps {
                dir('ai-service') {
                    bat '''
                        python -m venv venv
                        call venv\\Scripts\\activate.bat
                        pip install --upgrade pip
                        pip install -r requirements.txt
                        pytest --cov=. --cov-report=xml --cov-report=html
                    '''
                }
            }
        }

        stage('Build React Frontend') {
            steps {
                dir('wastebot-frontend') {
                    bat 'npm ci'
                    bat 'npm run build'
                    bat 'npm test -- --watchAll=false --coverage --coverageReporters=lcov'
                }
            }
        }

        stage('Package Artifacts') {
            parallel {
                stage('Package Admin Service') {
                    steps {
                        dir('admin-service') {
                            bat 'mvn package -DskipTests'
                            archiveArtifacts artifacts: 'target/*.jar', fingerprint: true
                        }
                    }
                }
                stage('Package Gateway Service') {
                    steps {
                        dir('gatewayy-service') {
                            bat 'mvn package -DskipTests'
                            archiveArtifacts artifacts: 'target/*.jar', fingerprint: true
                        }
                    }
                }
                stage('Package Robot Service') {
                    steps {
                        dir('robot-service') {
                            bat 'mvn package -DskipTests'
                            archiveArtifacts artifacts: 'target/*.jar', fingerprint: true
                        }
                    }
                }
                stage('Package Waste Service') {
                    steps {
                        dir('waste-service') {
                            bat 'mvn package -DskipTests'
                            archiveArtifacts artifacts: 'target/*.jar', fingerprint: true
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
