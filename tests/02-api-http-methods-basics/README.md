# Playwright API – 02 HTTP Methods (CRUD) Basics

## Purpose of This Folder

This folder focuses on practicing **core HTTP methods** used in API testing
using Playwright with TypeScript.

The goal is to clearly understand:

- When to use GET, POST, PUT, PATCH, DELETE
- How request payloads differ
- How to validate responses
- How to explain PUT vs PATCH in interviews

---

## Folder Structure

02-api-http-methods-basics/
├── 01-get-request.spec.ts
├── 02-post-request-with-payload.spec.ts
├── 03-put-request-update.spec.ts
├── 04-patch-request-partial-update.spec.ts
├── 05-delete-request.spec.ts
└── README.md

---

## What Each File Covers

### 01-get-request.spec.ts

- GET request (runnable example)
- Fetching resources
- No request body

**Run this example:**

```bash
npx playwright test tests/02-api-http-methods-basics/01-get-request.spec.ts
```

### 02-post-request-with-payload.spec.ts

- POST request (runnable example)
- Sending JSON payload
- Validating response data

**Run this example:**

```bash
npx playwright test tests/02-api-http-methods-basics/02-post-request-with-payload.spec.ts
```

### 03-put-request-update.spec.ts

- PUT request (syntax-only)
- Updating entire resource
- Full payload required

> This file is provided for syntax/reference and is marked `test.skip` in the source (so it will not run by default). To execute it, remove `test.skip` or change it to a non-skip test.

### 04-patch-request-partial-update.spec.ts

- PATCH request (syntax-only)
- Partial updates
- Only changed fields sent

> This file is provided for syntax/reference and is marked `test.skip` in the source (so it will not run by default). To execute it, remove `test.skip` or change it to a non-skip test.

### 05-delete-request.spec.ts

- DELETE request (syntax-only)
- No request body
- Status code validation

> This file is provided for syntax/reference and is marked `test.skip` in the source (so it will not run by default). To execute it, remove `test.skip` or change it to a non-skip test.

---

## Important Interview Notes

- GET → Fetch data
- POST → Create resource
- PUT → Replace entire resource
- PATCH → Update specific fields
- DELETE → Remove resource

PUT vs PATCH:

- PUT requires full payload
- PATCH sends only changed fields

---

**Note:** The `PUT`, `PATCH`, and `DELETE` specs in this folder are intentionally provided as *syntax/reference* and are marked `test.skip` in their source files, so they will not run by default. For working, end-to-end examples of updates and deletes (with real flows and auth), see the `tests/conduit` folder.

---

## How to Run Tests

Run a single file:

```bash
npx playwright test tests/02-api-http-methods-basics/01-get-request.spec.ts
```
