# Playwright Test Execution Flow Analysis

This document breaks down the sequence of events that occur when a Playwright test is executed in this framework, based on the command `npx playwright test tests/drivers/create.driver.spec.ts`.

### 1. Playwright Test Runner Initialization

-   **Action:** The user runs `npx playwright test ...`.
-   **Details:** Playwright's test runner initializes and reads its primary configuration file to understand the project setup, environments, and global settings.
-   **File Triggered:** `playwright.config.ts`

### 2. Global Setup Execution

-   **Action:** Playwright executes the global setup script defined in the configuration.
-   **Details:** This script runs *once* before any test files are processed. Its primary jobs are to generate a unique `RUN_ID` for the entire session and to initialize the centralized console logger. This ensures all subsequent logs are standardized and traceable to this specific run.
-   **File Triggered:** `global-setup.ts`
-   **Resulting Logs:**
    ```
    [...INFO: ✅ Test Execution Started
    [...INFO: 🆔 RUN_ID: RUN_20251219_161340_256
    ```

### 3. Test File Execution & Fixture Setup

-   **Action:** Playwright identifies and begins processing the target test file.
-   **Details:** Before running the actual tests within the file, Playwright sets up the necessary context. This includes executing `beforeAll` hooks defined in the test file. These hooks are used for file-level setup, such as initializing API clients or preparing test data.
-   **File Triggered:** `tests/drivers/create.driver.spec.ts`
-   **Resulting Logs:**
    ```
    [...INFO: ----- Before Get Driver spec all tests begins ------
    [...INFO: beforeAll: Get Driver Tests https://generalinsurance-ff4b.restdb.io...
    [...INFO: ----- Before all setup is over -----
    ```

### 4. Individual Test Execution

-   **Action:** The test runner executes the test blocks (e.g., `test('Create And Delete Test', ...)`).
-   **Details:** The code inside the test function runs sequentially. This is where the application's business logic is tested—in this case, making API calls. The framework's request handler and logger intercept these actions to provide detailed debug and info logs for each step.
-   **File Triggered:** `tests/drivers/create.driver.spec.ts`
-   **Resulting Logs:**
    ```
    [...INFO: Test start: Create And Delete Test
    [...DEBUG: POST /driver baseUrl=...
    [...INFO: POST /driver status=201
    [...INFO: Step success: Created Driver and Deleted Driver
    ```

### 5. Global Teardown Execution

-   **Action:** After all test files have completed, Playwright executes the global teardown script.
-   **Details:** This script is intended for cleanup activities that should happen once at the very end of the test run. In the provided log, this step failed because the file did not adhere to Playwright's requirement of exporting a single default function.
-   **File Triggered:** `global-teardown.ts`
-   **Resulting Log:**
    ```
    Error: global-teardown.ts: file must export a single function.
    ```

### Summary

The framework follows a clear, structured lifecycle managed by Playwright: **Global Setup → Test File Setup (Hooks/Fixtures) → Test Execution → Global Teardown**. The custom logger, initialized at the start, provides consistent, traceable logging throughout this entire flow.
