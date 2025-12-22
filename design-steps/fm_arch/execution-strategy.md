# Playwright project, folder structure, and test execution explained

## Project configuration and test discovery

In Playwright, whenever we create any folder under `tests/` and add spec files, the first and most important step is to ensure that this folder is mapped to a project in `playwright.config.ts`.

Playwright discovers and executes tests only through projects defined in the config file.

You can:

*   Create a generic project using a regular expression to include all spec files under `tests/`
*   Or create specific projects that point to specific folders

## Microservices-based project structure

In a microservices-based application, it is a best practice to create:

*   Separate folders under `tests/` for each service
*   Separate projects in the config file for each service

### Example folder structure:

```
tests/
 ├─ auth/
 ├─ vehicle/
 ├─ policy/
 ├─ coverage/
 └─ e2e/
```

### Corresponding projects in playwright.config.ts:

*   `auth`
*   `vehicle`
*   `policy`
*   `coverage`
*   `e2e`

Each project points to its own folder using `testDir` or `testMatch`.

## Important rule (very important for interviews)

If you create a folder or spec file under `tests/` but do not map it to any project in the config file, then:

*   Playwright runner will NOT detect the spec
*   The test cannot be executed in any way
*   Even running `npx playwright test` will not pick it up

👉 Playwright executes tests only via configured projects.

## Running tests project-wise

### Run all tests for all projects

```bash
npx playwright test
```

This runs:

*   All projects
*   All specs mapped to those projects

### Run tests for a specific project (example: vehicle)

```bash
npx playwright test --project=vehicle
```

This runs:

*   All spec files inside the vehicle project
*   No other project tests are executed

## Using tags for smoke, sanity, and regression

Tests can be tagged inside spec files:

```typescript
test('@smoke Add vehicle flow', async () => {});

test('@sanity Validate policy creation', async () => {});

test('@regression Full coverage flow', async () => {});
```

### Run only regression tests (across all projects)

```bash
npx playwright test --grep "@regression"
```

This will:

*   Run tests from all projects
*   Execute only tests with `@regression` tag
*   Not be limited to a single project

### Run only smoke tests

```bash
npx playwright test --grep "@smoke"
```

### Run only sanity tests

```bash
npx playwright test --grep "@sanity"
```

### Run multiple tags (sanity OR smoke OR regression)

```bash
npx playwright test --grep "@sanity|@smoke|@regression"
```

### Run tests that have both tags (sanity AND smoke)

```bash
npx playwright test --grep "(?=.*@sanity)(?=.*@smoke)"
```

## Combining project and tags

### Run only sanity tests for vehicle project

```bash
npx playwright test --project=vehicle --grep "@sanity"
```

### Run regression tests for multiple projects

```bash
npx playwright test --project=vehicle --project=policy --grep "@regression"
```

## Running a particular spec file

```bash
npx playwright test tests/vehicle/add-vehicle.spec.ts
```

## Running a particular test inside a spec file

Use `test.only`:

```typescript
test.only('Add vehicle happy path', async () => {});
```

Or run by test title:

```bash
npx playwright test --grep "Add vehicle happy path"
```

## Skipping tests

### Skip a specific test

```typescript
test.skip('Negative scenario', async () => {});
```

### Skip conditionally

```typescript
test.skip(process.env.ENV === 'prod', 'Skipping in prod');
```

## Scaling Execution with npm Scripts

We can also scale execution by keeping commands inside the `scripts` section of `package.json`.

**Benefits:**

*   **Simplicity:** Simplifies long and complex Playwright commands into short, memorable npm scripts.
*   **Consistency:** Ensures that the same commands are run by everyone on the team, reducing "it works on my machine" issues.
*   **Maintainability:** If a command needs to be updated, you only need to change it in one place (`package.json`), and everyone automatically gets the update.
*   **CI/CD Integration:** CI/CD pipelines can easily execute these scripts, making the integration process smoother.

### Example `package.json` scripts:

```json
"scripts": {
    "conduit-bvt": "npx playwright test --grep \"@sanity|@smoke1|@regression1\"",
    "conduit-sanity": "npx playwright test --grep \"@sanity\"",
    "conduit-smoke": "npx playwright test --grep \"@smoke1\"",
    "conduit-regression": "npx playwright test --grep \"@regression1\"",
    "conduit-e2e": "npx playwright test --project=conduit-ci"
}
```

Now, you can run these scripts like this:

```bash
# Run all BVT tests
npm run conduit-bvt

# Run only sanity tests
npm run conduit-sanity
```

## Ensuring Consistency with Docker

To avoid issues where a script passes locally but fails in the Continuous Integration (CI) environment, you should run your developed scripts in the same Docker image that is used by the CI pipeline. This ensures that your local execution environment is a replica of the CI environment.

Our framework is equipped with a `Dockerfile` and a `docker-compose.yaml` file to facilitate this.

### How it works:

1.  **Docker Compose:** The `docker-compose.yaml` file is configured to build the Docker image using the `Dockerfile` and then run a specific test script inside the container.
2.  **Build and Run:** You can build the image and run the tests with a single command:
    ```bash
    docker-compose up --build
    ```
3.  **Volume Mounting:** The compose file uses volume mounting to copy the test results (`playwright-report` and `test-results`) from the Docker container back to your local framework directory.

This process guarantees that if a script passes in your local Docker container, it will also pass in the CI environment, effectively eliminating "it works on my machine" problems and flaky scripts caused by environment differences.

## What is a Dockerized Framework and Its Benefits?

A "dockerized framework" means that the entire test automation framework, including all its dependencies, configurations, and the browser binaries, is packaged into a self-contained Docker image.

**Key Benefits:**

*   **Portability:** The framework can run on any machine that has Docker installed, regardless of the underlying operating system or local configurations.
*   **Consistency:** Every team member and CI/CD agent runs tests in the exact same environment, eliminating environment-related test failures.
*   **Isolation:** The framework runs in an isolated container, so it doesn’t interfere with or get affected by other applications or dependencies on the host machine.
*   **Simplified Setup:** New team members can get up and running by simply pulling the Docker image and running it, without having to manually install dependencies like Node.js, browsers, or libraries.

## Manual Docker Execution (Without Docker Compose)

If you prefer not to use `docker-compose.yaml`, you can still dockerize the framework and run your tests manually.

### Steps:

1.  **Build the Docker Image:**
    First, build the Docker image from the `Dockerfile`. You can give it a custom tag, for example, `pw-api-test`.
    ```bash
    docker build -t pw-api-test .
    ```

2.  **Run in Interactive Mode:**
    Next, run the container in interactive mode (`-it`), which gives you a shell inside the container.
    ```bash
    docker run -it pw-api-test
    ```

3.  **Execute Tests:**
    Once you are inside the container's shell, you can execute any `npm` or `npx` command as you would on your local machine.
    ```bash
    # Run a specific npm script
    npm run conduit-sanity

    # Or run a direct npx command
    npx playwright test --project=vehicle --grep "@regression"
    ```
This approach still provides the core benefits of a consistent and isolated test environment.

