# CI/CD Execution Strategy: Jenkins vs. GitHub Actions

This document outlines the generic phases of test automation execution in a CI/CD platform, with a comparison between Jenkins and GitHub Actions.

## Topic: Major Phases in Test Automation in CI

While CI tools like Jenkins, GitHub Actions, GitLab CI, Azure DevOps, and Concourse differ in their syntax, the core execution phases remain consistent.

---

## 1️⃣ CORE CI EXECUTION PHASES (UNIVERSAL)

Here are the universal phases for CI test automation:

### PHASE 1: CHECKOUT

-   **Goal:** Fetch the correct version of the source code.
-   **Actions:**
    -   Clone the repository.
    -   Checkout a specific branch, pull request, or commit.
-   **Examples:**
    -   **Jenkins:** `checkout scm`
    -   **GitHub Actions:** `actions/checkout`
    -   **GitLab CI:** Auto checkout
-   **Note:** The pipeline cannot exist without this checkout phase.

### PHASE 2: BUILD / SETUP

-   **Goal:** Prepare project dependencies and the execution environment.
-   **Playwright (TypeScript):**
    -   `npm install`
    -   `npx playwright install --with-deps`
-   **Maven (Java):**
    -   `mvn clean test` (which handles both build and dependency resolution).
-   **Notes:**
    -   "Build" does not always mean compiling code.
    -   In test automation, "build" typically refers to setting up dependencies and infrastructure.

### PHASE 3: TEST EXECUTION

-   **Goal:** Execute the automated test suites.
-   **Playwright:**
    -   `npx playwright test`
    -   `npm run bvt | smoke | regression` (using npm scripts)
-   **Maven:**
    -   This is covered within the `mvn test` command.
-   **Note:** This is the only phase that directly validates the quality of the product.

### PHASE 4: REPORT / POST-BUILD

-   **Goal:** Act on the test results (whether they PASS or FAIL).
-   **Activities:**
    -   Upload reports and logs.
    -   Publish HTML reports.
    -   Archive artifacts.
    -   Send notifications via email, Slack, or Teams.
    -   Trigger downstream jobs.
-   **Note:** This phase runs even if the tests fail.

---

## 2️⃣ SUPPORTING CONFIGURATIONS (NOT PHASES)

These are configurations that support the execution pipeline but are not part of the core execution flow.

### TRIGGERS

-   **Purpose:** Decide when the pipeline should start.
-   **Examples:**
    -   **Jenkins:** Cron jobs, Webhooks, Manual triggers.
    -   **GitHub Actions:** `push`, `pull_request`, `schedule`.
    -   **Concourse:** `time trigger`, `resource trigger`.
-   **Note:** Triggers initiate the pipeline; they are not part of the execution flow itself.

### SECRETS & CREDENTIALS MANAGEMENT

-   **Purpose:** Securely manage sensitive data.
-   **Tools:**
    -   **Jenkins:** Credentials / Password Manager.
    -   **GitHub Actions:** Encrypted Secrets.
    -   **Concourse:** Vault.
    -   **GitLab CI:** Masked CI Variables.
-   **Used For:**
    -   Database passwords.
    -   API tokens.
    -   Authentication credentials.
    -   Email credentials.
-   **Rule:** Never hardcode secrets directly in the repository.

### ENVIRONMENT VARIABLES

-   **Purpose:** Make the testing framework environment-agnostic.
-   **Examples:**
    -   `TEST_ENV=qa`
    -   `BASE_URL`
    -   `USER_EMAIL`
-   **Tools:**
    -   **Jenkins:** `environment {}` block or parameters.
    -   **GitHub Actions:** `env:` context.
    -   **Concourse:** `vars` file.
-   **Benefit:** Allows the same tests to be run across different environments (e.g., QA, UAT, PROD) without code changes.

### NOTIFICATIONS

-   **Purpose:** Communicate the results of the execution.
-   **Includes:**
    -   Dynamic email subjects (e.g., "Build PASSED" or "Build FAILED").
    -   HTML email bodies with a summary of the results.
    -   Links to detailed reports.
    -   Attachments (e.g., log files).
-   **Note:** Notifications are typically executed in the Post-Build phase.

---

## 3️⃣ JENKINS EXECUTION MODEL

-   **Execution Unit:** Agent (Physical / VM / Docker / K8s)
-   **Description:**
    -   Jenkins does not provide hosted runners like GitHub Actions.
    -   Jobs run on Jenkins agents (machines).
-   **Agent Types:**
    -   Physical machine
    -   VM
    -   Docker container
    -   Kubernetes pod
-   **Note:** The pipeline executes on an agent where the necessary tools and runtime are available.

---

## Jenkins CI – Execution Infrastructure Pattern

### 1️⃣ Jenkins Agent Setup

-   Jenkins does not execute jobs on its own.
-   First, we must add **agents (nodes)** to Jenkins.
-   These agents are usually:
    -   Linux-based
    -   Ubuntu-based
-   All actual build and test execution happens on these agents.

---

### 2️⃣ Agent Selection in Jenkins Jobs

-   Jenkins supports **label-based execution**.
-   If we want our job to run on a specific agent, we assign a label to that agent (e.g., `linux`, `ubuntu`, `playwright-node`).

#### FreeStyle Project Behavior:

-   While creating a FreeStyle job, we can:
    -   Select "**Restrict where this project can be run**"
    -   Provide the agent label.
-   **Result:**
    -   The job will execute only on agents matching that label.
-   If no label is provided:
    -   Jenkins will run the job on any available agent.

---

### 3️⃣ CI Execution Flow in Jenkins

Jenkins does NOT provide hosted runners. Execution happens on Jenkins-managed agents (machines). Once the agents are added, Jenkins follows the below execution flow. If in a freestyle project you are not giving any agent label name, then execution will happen on any agent. Else, if you want to run your scripts in a particular agent machine, specify the agent label name.

#### 🔹 Phase 1: Agent Availability

-   An agent (Linux/Ubuntu) must be:
    -   Online
    -   Connected to Jenkins
-   Without an agent, the job cannot start.

---

#### 🔹 Phase 2: Checkout Phase

-   Jenkins clones the repository from SCM.
-   The configured branch or commit is checked out.
-   At this point, the source code is available on the agent machine.

---

#### 🔹 Phase 3: Build / Setup Phase

-   After cloning the repo:
    -   Project-level dependencies must be installed to build the project.
-   For Playwright + TypeScript projects:
    -   `npm install` is required because `node_modules` is not part of the repo.
-   In many enterprise setups:
    -   Common tools (Node.js, browsers, Java, etc.) are already installed on agents.
    -   So global dependency installation is often skipped.
-   However:
    -   Project dependencies still need to be installed after checkout.

---

#### 🔹 Phase 4: Test Execution Phase

-   Tests are executed using commands such as:
    -   `npx playwright test`
    -   `npm run bvt / smoke / regression`
-   If Playwright browser dependencies need installation or update:
    -   `npx playwright install` can be executed.

---

#### 🔹 Phase 5: Report / Post-Build Phase

-   After test execution (PASS or FAIL):
    -   Test reports are generated.
    -   Reports and logs are:
        -   Uploaded
        -   Archived
        -   Sent via email or notifications
-   This phase runs even if tests fail.

---

### Summary of Jenkins CI Phases

1.  Agent must be available (Linux / Ubuntu)
2.  Checkout phase
3.  Build / setup phase
4.  Test execution phase
5.  Report / post-build phase

---

### Cons of Jenkins Agent-Based Execution

-   **High maintenance:**
    -   Agents need regular OS updates.
    -   Security patches and vulnerability fixes are required.
-   **Scalability issues:**
    -   Larger projects require more agents for parallel execution.
-   **Cost:**
    -   Enterprise Linux/Ubuntu machines are expensive.
-   **Idle resource problem:**
    -   Agents remain running even when no jobs are executing.
    -   Idle machines still consume cost and resources.

---

## GitHub Actions / Concourse – Execution Infrastructure Pattern

### 1️⃣ Execution Model (Runner / Container-Based)

-   Unlike Jenkins, GitHub Actions, Concourse, and similar CI platforms do not use persistent agents.
-   These platforms use **ephemeral runners or containers** for execution.
-   We only need to specify what type of machine or OS is required for execution.
-   **Example (GitHub Actions):**
    ```yaml
    runs-on: ubuntu-latest
    ```

---

### 2️⃣ Runner / Container Provisioning

-   The CI platform:
    -   Provisions a fresh runner or container.
    -   Based on the specified OS or Docker image.
-   These runners are:
    -   Managed by the CI platform itself.
    -   Often backed by Docker images.
    -   Pulled automatically (commonly from Docker Hub or the platform's registry).
-   There is **no manual agent setup or maintenance** required by the user.

---

### 3️⃣ CI Execution Flow

Once the runner/container is provisioned, the workflow follows standard CI phases:

#### 🔹 Phase 1: Runner Allocation

-   A new runner/container is created for the job.
-   The environment is clean and isolated for each execution.

---

#### 🔹 Phase 2: Checkout Phase

-   The repository is cloned into the runner/container.
-   The correct branch or commit is checked out.

---

#### 🔹 Phase 3: Build / Setup Phase

-   Project dependencies are installed.
-   **Example:**
    -   `npm install`
    -   `npx playwright install --with-deps`
-   Since the runner is fresh, dependencies must usually be installed every time.

---

#### 🔹 Phase 4: Test Execution Phase

-   Automated tests are executed using:
    -   `npx playwright test`
    -   or `npm run bvt / smoke / regression`

---

#### 🔹 Phase 5: Report / Post-Execution Phase

-   Test reports and logs are generated.
-   Reports are:
    -   Uploaded as artifacts.
    -   Used for notifications (email, Slack, etc.).

---

### 4️⃣ Runner / Container Cleanup

-   After all workflow steps are completed:
    -   The runner/container is **automatically destroyed**.
-   No idle machines remain running.
-   Each pipeline execution starts with a fresh environment.

---

### Key Benefits of This Model

-   No agent maintenance.
-   No OS patching or vulnerability management.
-   Easy scalability.
-   Cost-efficient (pay only for execution time).
-   Clean and repeatable execution environment.

---

### Local vs. CI Execution Consistency

Most modern companies use CI/CD platforms like GitHub Actions, Concourse, or GitLab. To avoid the common issue of "it works on my machine" where scripts pass locally but fail in CI, a best practice is to use Docker.

By pulling the **same Docker image** that the CI pipeline uses, developers can install dependencies and run tests locally. This ensures that the environment and infrastructure are identical for both local and CI script execution, leading to greater confidence in the test results.
