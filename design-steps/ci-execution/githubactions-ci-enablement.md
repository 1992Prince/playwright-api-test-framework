# GitHub Actions CI Enablement

## What is GitHub Actions?

GitHub Actions is GitHub's built-in CI/CD system. In simple terms, as soon as you push code, create a pull request, or set a schedule, GitHub automatically runs your tasks, such as running tests, creating a build, or deploying your application.

With GitHub Actions, you:
*   Do not need to install and manage a separate CI server like Jenkins.
*   Do not need to maintain any server infrastructure.

GitHub provides a virtual machine and runs the jobs for you.

---

## What is the `.github` folder?

`.github` is a special folder that GitHub automatically recognizes. Inside this folder, you define the configuration for your repository, including:
*   How CI should run.
*   When it should run.
*   Which commands should be executed.

In this Playwright framework, this folder is used for automation infrastructure configuration, not for the tests themselves.

---

## What is the `.github/workflows` folder?

The `.github/workflows` directory is where you define your CI/CD pipelines. Each `.yml` or `.yaml` file in this folder represents a separate workflow. A workflow file tells GitHub: "Follow these steps when a specific event occurs."

---

## What is `playwright.yml`?

`playwright.yml` is a GitHub Actions workflow file. This file contains the instructions for the CI pipeline, including:
*   **When the pipeline will be triggered** (e.g., on a `push`, `pull_request`, manually, or on a `schedule`).
*   **Which machine to use** (e.g., `ubuntu-latest` or `windows-latest`).
*   **Setup instructions** for Node.js, Docker, or other environments.
*   **Which commands to run** (e.g., `npm run test`, `docker run`).

In simple words, `playwright.yml` tells GitHub how your Playwright tests should be executed in the CI environment.

---

## Simple Execution Flow

1.  Developer pushes code to the repository.
2.  GitHub detects the change and reads the `.github/workflows/playwright.yml` file.
3.  GitHub provisions a fresh virtual machine (e.g., Linux).
4.  The steps defined in the workflow file are executed on that machine.
5.  Tests are run.
6.  Reports are generated and can be saved as artifacts.

---

## What's in a Typical `playwright.yml`? (High-Level)

A standard workflow for running Playwright tests includes these steps:
1.  **Checkout Repository:** Download the code into the CI environment.
2.  **Setup Environment:** Set up Node.js, Docker, or any other required tools.
3.  **Install Dependencies:** Run `npm install` or `npm ci`.
4.  **Run Playwright Tests:** Execute the test suite using an `npx` or `npm` command.
5.  **Upload Reports:** Save test results and reports as artifacts.

The Docker-based approach you use for local validation is often replicated here for consistency, just in an automated fashion.

---

## Important Point (Often Missed)

*   The code inside the `.github/workflows` directory is **not** part of your test suite.
*   It is **execution infrastructure configuration**.
*   It has no impact on how you run your tests locally.

For this reason, you do not need to copy the `.github` folder into your Docker image.

---

## One-Line Summary

*   **GitHub Actions** → The CI engine.
*   **.github** → The folder for GitHub-specific configurations.
*   **workflows** → The folder for your CI pipeline files.
*   **playwright.yml** → The CI execution plan for your Playwright tests.

---

## Lead-Level Thinking (Important)

Your framework should be designed with three execution contexts in mind:
*   **Local Run:** For developer comfort and quick feedback.
*   **Docker Run:** To ensure environment parity between local and CI.
*   **GitHub Actions:** For full automation, governance, and scheduled runs.

Combining these three transforms a simple framework into a professional automation platform.

---

## CI Requirements for Automation Execution

When executing automation scripts in a CI environment, simply running `npm test` is not enough. Since CI runs on a fresh machine every time, you must explicitly define the entire execution context.

This includes:
*   **Environment Overrides:** Specifying the target environment (`dev`, `qa`, `prod`), test tags, and other CI-specific flags.
*   **Secrets Management:** Injecting passwords, tokens, and API keys in a secure manner.
*   **Image Name:** Using the exact same Docker image that was validated locally.
*   **Commands:** Defining which `npm` script or command to execute.
*   **Execution Configuration:** Setting options like `headed`/`headless` mode, parallelism, and using display servers like `Xvfb`.
*   **Reports:** Configuring the generation and storage of HTML reports and test results.
*   **Logs:** Preserving logs for debugging purposes.
*   **Notifications:** Sending success or failure signals to stakeholders via email or Slack.

All these responsibilities are centrally managed through the GitHub Actions workflow file (`playwright.yml`).

---

## ✅ Complete `playwright.yml` (All Features Enabled)

```yaml
name: Playwright CI Execution (Docker + Reports + Notifications)

on:
  push:
    branches: [ main ]
  pull_request:
  workflow_dispatch:

jobs:
  playwright-tests:
    runs-on: ubuntu-latest

    container:
      image: mcr.microsoft.com/playwright:v1.57.0-noble

    env:
      TEST_ENV: qa
      TAGS: "@sanity|@smoke"
      CI: true
      BASE_URL: ${{ secrets.BASE_URL }}
      USER_EMAIL: ${{ secrets.USER_EMAIL }}
      USER_PASSWORD: ${{ secrets.USER_PASSWORD }}

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers & OS deps
        run: npx playwright install --with-deps

      - name: Run Playwright tests (headed with Xvfb)
        run: |
          xvfb-run -s "-screen 0 1920x1080x24" \
          npx playwright test \
          --grep "$TAGS" \
          --reporter=html

      - name: Upload Playwright HTML Report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/

      - name: Upload Test Results & Logs
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: test-results
          path: |
            test-results/
            logs/

      - name: Notify on Failure (Email/Slack placeholder)
        if: failure()
        run: echo "Trigger notification – Email/Slack integration here"
```

---

### Explanation of the Workflow

*   **Triggers:** The workflow is triggered on pushes to the `main` branch, on pull requests targeting `main`, and can also be run manually (`workflow_dispatch`). This ensures tests are run for all code changes and allows for on-demand execution.
*   **Execution Environment:** The job runs on a GitHub-hosted Ubuntu runner but executes inside a specific Playwright Docker `container`. This guarantees the same execution environment as local Docker validation and avoids OS-level inconsistencies.
*   **Environment Variables and Secrets:**
    *   `env`: Environment variables like the test environment (`TEST_ENV`), `TAGS`, and a `CI` flag are defined at the job level for all steps to use.
    *   `secrets`: Sensitive values like URLs and credentials are injected securely using GitHub Secrets (`${{ secrets.SECRET_NAME }}`), ensuring no hardcoded secrets are stored in the repository.
*   **Dependency and Browser Setup:** Dependencies are installed using `npm ci` for faster, more reliable, and reproducible builds. The `npx playwright install --with-deps` command ensures all necessary browser binaries and OS dependencies are present inside the container.
*   **Test Execution:** Tests are executed in `headed` mode using `Xvfb` (X Virtual Framebuffer) to simulate a display in a headless CI environment. This can be useful for certain types of tests. Test selection is controlled dynamically using the `TAGS` environment variable with `--grep`, allowing for flexible test runs without changing the pipeline code.
*   **Reports and Logs:** The `if: always()` condition ensures that artifacts (HTML reports, test results, logs) are uploaded even if the test step fails. This is crucial for post-execution debugging.
*   **Notifications:** The `if: failure()` condition ensures the notification step only runs when a previous step in the job has failed. This is where you would integrate with services like email, Slack, or Microsoft Teams to alert stakeholders.

---

### Outcome

This setup ensures:
*   **Consistent Execution:** The infrastructure is the same across local Docker runs and CI.
*   **Secure Configuration:** Environment-specific secrets are handled securely.
*   **Reduced Flakiness:** Failures caused by environment mismatches are minimized.
*   **Full Observability:** You always have reliable access to reports, logs, and failure notifications.

---

## Walkthrough of Our Current `playwright.yml`

Here is a breakdown of the `playwright.yml` file currently used in our project.

```yaml
name: Playwright Tests
on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: lts/*
    - name: Install dependencies
      run: npm install
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    - name: Run Playwright tests
      run: npm run conduit-bvt
      env:
        DB_HOST: localhost
        DB_USER: root
        DB_PASSWORD: root123
        DB_NAME: testdb
        APP_URL: http://uitestingplayground.com/ajax
        TEST_ENV: qa
        authTokenBaseUrl: https://qa-dj4vuaaxgimt7erd.us.auth0.com/oaut4h/token
        apiUrl: https://conduit-api.bondaracademy.com/api
        USER_EMAIL: testbondar1@gmail.com
        USER_PASSWORD: testbondar1
    - uses: actions/upload-artifact@v4
      if: ${{ !cancelled() }}
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
    - uses: actions/upload-artifact@v4
      if: ${{ !cancelled() }}
      with:
        name: test-results
        path: test-results/
        retention-days: 30
```

### Explanation of the File

#### `name: Playwright Tests`
This sets the name of the workflow, which is displayed in the GitHub Actions UI.

#### `on`
This section defines the events that trigger the workflow. In our case:
*   `push`: The workflow runs every time code is pushed to the `main` or `master` branch.
*   `pull_request`: The workflow also runs when a pull request is created that targets the `main` or `master` branch.

#### `jobs`
This section defines one or more jobs to be executed. We have a single job named `test`.

*   `timeout-minutes: 60`: The job will be automatically cancelled if it runs for more than 60 minutes. This prevents stuck jobs from consuming resources indefinitely.
*   `runs-on: ubuntu-latest`: The job will run on a fresh, GitHub-hosted virtual machine running the latest version of Ubuntu.

#### `steps`
This is the sequence of tasks that the `test` job will execute.

1.  **`uses: actions/checkout@v4`**
    This is a pre-built action that downloads (checks out) your repository's code into the CI runner, so the subsequent steps can access it.

2.  **`uses: actions/setup-node@v4`**
    This action sets up a Node.js environment. We've configured it to use the latest Long-Term Support (`lts/*`) version of Node.js.

3.  **`name: Install dependencies`**
    This step runs the command `npm install` to download and install all the project dependencies defined in `package.json` and `package-lock.json`.

4.  **`name: Install Playwright Browsers`**
    This runs `npx playwright install --with-deps` to download the browser binaries (Chromium, Firefox, WebKit) and their operating system dependencies required by Playwright.

5.  **`name: Run Playwright tests`**
    This is the main testing step.
    *   `run: npm run conduit-bvt`: It executes the `conduit-bvt` script defined in our `package.json`. This script contains the actual `npx playwright test` command.
    *   `env`: This block sets a number of environment variables that will be available to the test execution process. These are used to configure the tests for the CI environment, providing database credentials, API URLs, and user login information.

6.  **`uses: actions/upload-artifact@v4`** (for `playwright-report`)
    This action uploads the contents of the `playwright-report/` directory as a CI artifact named "playwright-report".
    *   `if: ${{ !cancelled() }}`: This condition ensures the artifact is uploaded only if the job was not cancelled.
    *   `retention-days: 30`: The uploaded artifact will be stored for 30 days.

7.  **`uses: actions/upload-artifact@v4`** (for `test-results`)
    Similarly, this step uploads the `test-results/` directory, which contains raw test outputs, under the artifact name "test-results". This provides access to detailed logs and traces for debugging failed tests.
