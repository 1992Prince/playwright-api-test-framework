# Framework Architecture & Core Capabilities

This document outlines the architecture of the Playwright API Testing Framework, its core components, and the key capabilities it automates for developers.

## Introduction

This framework is a robust solution for API testing built on top of Playwright. It is designed to be scalable, maintainable, and easy to use, enabling developers to write powerful and reliable API tests with minimal boilerplate code. It follows SOLID design principles and emphasizes clear separation of concerns.

## Core Components

The framework is composed of several key components that work together to provide a seamless testing experience.

#### 1. **Configuration (`playwright.config.ts`, `api-test.config.ts`)**
-   **Purpose:** Provides the central control plane for the entire test suite.
-   **Features:**
    -   Manages test environments (e.g., `dev`, `staging`, `prod`), allowing tests to be run against different deployments.
    -   Defines global settings like `globalSetup` and `globalTeardown` scripts.
    -   Configures test reporters, timeouts, and worker processes.

#### 2. **Global Setup & Teardown (`global-setup.ts`, `global-teardown.ts`)**
-   **Purpose:** Manages the lifecycle of the entire test run.
-   **Features:**
    -   **`global-setup.ts`**: Executes once before any tests begin. It initializes a unique `RUN_ID` for test traceability and sets up the global logger instance.
    -   **`global-teardown.ts`**: Executes once after all tests have finished, used for global cleanup tasks.

#### 3. **Custom Logging (`utils/consoleLogger.ts`, `consoleLoggerSingletonInstance.ts`)**
-   **Purpose:** Provides a standardized, enriched logging mechanism across the framework.
-   **Features:**
    -   A singleton instance ensures the same logger is used everywhere.
    -   Automatically enriches log messages with the `RUN_ID`, timestamp, and severity level (`INFO`, `DEBUG`).
    -   Ensures all logs from tests, helpers, and fixtures are consistent and easily traceable.

#### 4. **API Fixtures (`fixtures/api-fixture.ts`)**
-   **Purpose:** The heart of the framework's usability. It uses Playwright's `test.extend` feature to inject a pre-configured API client into each test.
-   **Features:**
    -   Abstracts away the complexity of creating and managing Playwright's `APIRequestContext`.
    -   Automatically handles environment-specific `baseURL`.
    -   Can be extended to automatically inject authentication tokens.

#### 5. **Request Handler (`utils/request-handler.ts`)**
-   **Purpose:** A wrapper around the core Playwright API calls to standardize behavior.
-   **Features:**
    -   Centralizes logic for logging every outgoing request and incoming response.
    -   Provides a single place to implement cross-cutting concerns like custom error handling or retry logic.

#### 6. **Schema Validation (`utils/schema-validator.ts`)**
-   **Purpose:** Automates API contract testing.
-   **Features:**
    -   Provides a utility to validate the structure of an API response against a predefined JSON schema.
    -   Schemas are neatly organized in `resources/response-schemas/`, making them easy to manage.

#### 7. **Test Data Management (`resources/test-data/`, `utils/test-data-generator.ts`)**
-   **Purpose:** Manages the data required for tests.
-   **Features:**
    -   **Static Data (`.json` files):** Stores fixed test data (e.g., user payloads) in `resources/test-data/`.
    -   **Dynamic Data (`test-data-generator.ts`):** A utility for creating unique, random data on-the-fly to ensure tests are independent.

#### 8. **Custom Error Handling (`errors/ApiError.ts`)**
-   **Purpose:** Provides more descriptive and useful error messages.
-   **Features:**
    -   A custom `ApiError` class can wrap native errors to include more context, such as the HTTP status code, response body, and `RUN_ID`, making debugging failures significantly faster.

## Key Automated Capabilities for Users

This architecture automates several repetitive tasks, allowing developers to focus on writing test logic.

-   **Zero-Setup API Client:** The custom fixture automatically provides a fully configured API client to every test. Developers don't need to worry about the base URL or creating an `APIRequestContext`.
-   **Traceable Logging by Default:** All actions are logged with a unique `RUN_ID` out-of-the-box. This allows a developer to easily filter logs for a specific test run, even in a noisy CI/CD environment.
-   **Simplified & Standardized API Calls:** Users interact with a simple client (e.g., `apiClient.post('/users', { data })`) while the underlying handler automates logging and error reporting.
-   **Effortless Contract Testing:** Validate API responses against a schema with a single function call, ensuring the API contract is never broken unintentionally.
-   **Seamless Environment Switching:** The framework is designed to run against any environment by simply changing a parameter. The configuration and fixtures handle the necessary adjustments automatically.
