# CI/CD Setup Guide

This document explains how to configure Jenkins and SonarQube for the microservices project.

## Prerequisites

- Jenkins installed and running on localhost
- SonarQube server running and accessible
- JDK 17 installed and configured in Jenkins
- Maven installed and configured in Jenkins
- Node.js installed and configured in Jenkins
- Python 3 installed on the Jenkins agent
- SonarQube Scanner installed and available in PATH

## Jenkins Configuration

### 1. Install Required Jenkins Plugins

Go to **Manage Jenkins** → **Manage Plugins** → **Available** and install:

- **Pipeline** (usually pre-installed)
- **SonarQube Scanner** (for SonarQube integration)
- **NodeJS Plugin** (for React builds)
- **Maven Integration** (for Spring Boot builds)

### 2. Configure Tools in Jenkins

Go to **Manage Jenkins** → **Global Tool Configuration**:

#### JDK Configuration
- **Name**: `JDK17`
- **JAVA_HOME**: Path to JDK 17 installation (e.g., `C:\Program Files\Java\jdk-17`)

#### Maven Configuration
- **Name**: `Maven`
- **MAVEN_HOME**: Path to Maven installation (e.g., `C:\Program Files\Apache\maven`)

#### Node.js Configuration
- **Name**: `NodeJS`
- **Version**: Select or install Node.js LTS version

### 3. Configure SonarQube Server in Jenkins

1. Go to **Manage Jenkins** → **Configure System**
2. Scroll to **SonarQube servers** section
3. Click **Add SonarQube**
4. Configure:
   - **Name**: `SonarQube`
   - **Server URL**: `http://localhost:9000` (or your SonarQube URL)
   - **Server authentication token**: (See step 4 below)

### 4. Create SonarQube Token and Add to Jenkins

#### In SonarQube:
1. Log in to SonarQube (default: admin/admin)
2. Go to **My Account** → **Security**
3. Generate a new token (e.g., `jenkins-token`)
4. Copy the token

#### In Jenkins:
1. Go to **Manage Jenkins** → **Credentials** → **System** → **Global credentials**
2. Click **Add Credentials**
3. Configure:
   - **Kind**: Secret text
   - **Secret**: Paste the SonarQube token
   - **ID**: `sonar-token`
   - **Description**: `SonarQube Authentication Token`
4. Click **OK**

### 5. Create Jenkins Pipeline Job

1. Go to **New Item** in Jenkins
2. Enter job name (e.g., `microservices-ci-cd`)
3. Select **Pipeline**
4. Click **OK**
5. In **Pipeline** section:
   - **Definition**: Pipeline script from SCM
   - **SCM**: Git
   - **Repository URL**: `https://github.com/RACHIDOV10/projet-microservice-dechets.git`
   - **Branch**: `*/main` or `*/master` (adjust as needed)
   - **Script Path**: `Jenkinsfile`
6. Click **Save**

## SonarQube Configuration

### 1. Verify SonarQube is Running

- Access SonarQube at `http://localhost:9000`
- Default credentials: `admin` / `admin`
- Change password on first login

### 2. Install SonarQube Plugins (if needed)

Go to **Administration** → **Marketplace** and ensure:
- **Java Plugin** is installed
- **Python Plugin** is installed
- **JavaScript/TypeScript Plugin** is installed

### 3. Verify SonarQube Scanner

Ensure `sonar-scanner` command is available in PATH:
```bash
sonar-scanner --version
```

If not installed:
- Download from: https://docs.sonarqube.org/latest/analysis/scan/sonarscanner/
- Add to PATH or configure in Jenkins

## Pipeline Overview

The Jenkinsfile defines a pipeline with the following stages:

1. **Checkout**: Clones the repository
2. **Build & Test Spring Boot Services**: Builds and tests all 4 Spring Boot services in parallel
3. **SonarQube Analysis - Spring Boot Services**: Runs SonarQube analysis for all Spring Boot services in parallel
4. **Build & Test FastAPI Service**: Installs dependencies and runs tests for the Python service
5. **SonarQube Analysis - FastAPI**: Runs SonarQube analysis for the Python service
6. **Build React Frontend**: Installs npm dependencies, builds, and runs tests
7. **SonarQube Analysis - React**: Runs SonarQube analysis for the React frontend
8. **Package Artifacts**: Creates JAR files for all Spring Boot services in parallel

## File Structure

The following files have been added to the repository:

```
├── Jenkinsfile                          # Main CI/CD pipeline
├── CI_CD_SETUP.md                       # This setup guide
├── admin-service/
│   └── sonar-project.properties         # SonarQube config for admin-service
├── gatewayy-service/
│   └── sonar-project.properties         # SonarQube config for gateway-service
├── robot-service/
│   └── sonar-project.properties         # SonarQube config for robot-service
├── waste-service/
│   └── sonar-project.properties         # SonarQube config for waste-service
├── ai-service/
│   ├── sonar-project.properties         # SonarQube config for ai-service
│   └── requirements.txt                 # Python dependencies
└── wastebot-frontend/
    └── sonar-project.properties         # SonarQube config for frontend
```

## Running the Pipeline

1. In Jenkins, go to your pipeline job
2. Click **Build Now**
3. Monitor the build progress in the console output
4. View SonarQube results at `http://localhost:9000`

## Troubleshooting

### Maven Build Fails
- Verify JDK 17 is correctly configured
- Check Maven installation and settings
- Ensure all dependencies can be downloaded

### SonarQube Analysis Fails
- Verify SonarQube server is running and accessible
- Check that the token is correctly configured in Jenkins credentials
- Ensure sonar-scanner is in PATH
- Verify sonar-project.properties files are in correct locations

### Python Service Fails
- Verify Python 3 is installed
- Check that pip is available
- Ensure virtual environment can be created

### React Build Fails
- Verify Node.js is installed and configured
- Check npm is available
- Ensure all dependencies can be installed

## Notes

- The pipeline runs all services independently and in parallel where possible
- No application source code has been modified
- All CI/CD configuration is external to the application code
- Artifacts (JAR files) are archived after successful builds

