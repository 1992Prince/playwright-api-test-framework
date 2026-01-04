🚀 Playwright API Automation Framework
=================================

A scalable, production-ready Playwright API Automation Framework designed for microservices-based applications, with built-in support for authentication handling, database validation, Dockerized execution, and CI/CD integration using GitHub Actions.

This framework is designed with Shift-Left testing, CI readiness, and enterprise-scale execution in mind.

📌 Key Objectives
-----------------

- Early defect detection through CI integration
- Clean separation of concerns using fixtures & dependency injection
- Support for API E2E testing with DB validation
- Environment-agnostic execution (Local, Docker, CI)
- High observability through logs, reports, and tracing
- Easy scalability for growing test suites

🧱 Tech Stack
-------------

- **Automation Tool**: Playwright (API Testing)
- **Language**: TypeScript
- **Runtime**: Node.js
- **Database**: MySQL (via `mysql2`)
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Reporting**: Playwright HTML + JSON
- **Logging**: Custom API & framework logs
- **Auth**: Token-based & OAuth 2.0

📂 Framework Structure
---------------------

```
.
├── fixtures/
│   └── api.fixture.ts        # API, Config, DB & Auth fixtures
│
├── constants/
│   └── api-error-codes.constants.ts # Centralized API error codes
│
├── helpers/
│   ├── createToken.ts        # Token-based auth (Conduit)
│   └── autoAuthCreateToken.ts# OAuth2 auth (Vehicle service)
│
├── utils/
│   ├── request-handler.ts    # Reusable API client
│   ├── logger.ts             # Custom API & framework logging
│
├── db/
│   └── queries.ts            # Reusable DB query utilities
│
├── tests/
│   └── api/
│       └── articles.spec.ts  # API tests with DB validation
│
├── global-setup.ts           # Execution-wide setup (RUN_ID)
├── global-teardown.ts        # Execution-wide teardown
│
├── playwright.config.ts      # Playwright configuration
│
├── Dockerfile                # Docker image for CI parity
├── docker-compose.yml        # Container orchestration
├── .dockerignore             # Docker optimization
│
├── .github/
│   └── workflows/
│       └── playwright.yml    # GitHub Actions CI pipeline
│
└── README.md
```

🧪 Test Design Principles
------------------------

- Fixtures over hooks for scalability and reusability
- Dependency Injection for clean test design
- Query utilities for DB validation (no SQL in specs)
- Worker-level auth tokens for performance
- Test-level isolation for stability

🔐 Authentication Handling
-------------------------

### Supported Auth Mechanisms

#### Token-based Authentication
- Email + Password login
- JWT token returned
- Injected via worker-level fixture

#### OAuth 2.0 (Password Grant)
- Client ID & Secret
- Access token retrieval
- Used for secured microservices

Authentication logic is fully abstracted into `helpers` + `fixtures`, keeping tests clean.

🧩 Fixtures & Dependency Injection
---------------------------------

### Fixtures Provided

- `api` → API client
- `config` → Environment configuration
- `db` → Database connection
- `authToken` → Worker-level authentication token

### Benefits

- No duplicate setup code
- Centralized lifecycle management
- Cleaner spec files
- Easy scaling across test suites

🗄️ Database Validation
---------------------

The framework supports post-API persistence checks.

### How DB Validation Works

1.  API request is executed
2.  API response is validated
3.  DB query utility is invoked
4.  Assertions are performed on DB records

### Example Use Case

- Validate user/account creation
- Verify status updates
- Confirm timestamps and audit fields

DB connections are safely managed using fixtures with automatic teardown.

⚙️ Global Setup & Teardown
-------------------------

### Global Setup (`global-setup.ts`)

- Runs **once** before all tests
- Generates a unique `RUN_ID`
- Used for log correlation and tracing

Configured in Playwright:
```typescript
globalSetup: require.resolve('./global-setup.ts'),
globalTeardown: require.resolve('./global-teardown.ts'),
```

### Global Teardown (`global-teardown.ts`)

- Runs **once** after all tests
- Reserved for cleanup, reporting, notifications

🐳 Docker Support
----------------

### Why Docker?

- Eliminates “works on my machine” issues
- Same environment across Local, CI, Debugging
- Faster onboarding

### Dockerfile Highlights

- Uses official Playwright image
- Pre-installed browsers & OS deps
- CI-parity execution

### Docker Compose

- One-command execution
- Volume mounting for reports
- Ideal for local + VPN debugging

🔁 CI/CD with GitHub Actions
--------------------------

### CI Triggers

- Push to `main`/`master`
- Pull requests
- Nightly scheduled runs (`cron`)

### CI Capabilities

- Automated test execution
- Artifact storage (reports, logs)
- Email notifications
- JSON report parsing
- Secure secrets handling

### Artifacts

- `playwright-report/`
- `test-results/`
- Retained for 30 days

🧠 Debugging Strategy
--------------------

When tests fail in CI:

1.  Request & response logs attached to reports
2.  Custom framework errors logged
3.  Unique `RUN_ID` / `tracker-id`
4.  Playwright trace enabled for failures
5.  Email summary with metrics
6.  Local reproduction using Docker + VPN

This ensures fast and reliable root-cause analysis.

🌙 Nightly Jobs
--------------

- Scheduled regression or smoke runs
- Detect environment/config issues
- No dependency on code changes
- Acts as a system health check

📈 Scaling Strategy
------------------

As test count grows:

- Tag-based execution (`smoke`, `bvt`, `regression`)
- Parallel execution using workers
- Kubernetes-based pod execution (advanced)
- Each pod runs isolated test workload
- Horizontal scaling with zero contention

🔄 Shift-Left Testing
--------------------

- Automation integrated from day one
- Tests run in developer pipelines
- Early feedback on builds
- Prevents defective builds from moving forward

✅ Summary
---------

This framework is designed to be:

- **CI-first**
- **Docker-native**
- **Scalable**
- **Observable**
- **Enterprise-ready**

It supports real-world testing needs for microservices-based systems while keeping tests clean, fast, and reliable.
