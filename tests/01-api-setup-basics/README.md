# 01 — API Setup Basics 🧪

A small folder to learn how Playwright supports API testing without launching a browser and how to manage API request contexts.

---

## 🧠 What you'll learn

- How Playwright supports API testing without a browser
- The difference between the built-in `request` fixture and a custom `APIRequestContext`
- When to use each approach and how they scale
- API request lifecycle in Playwright
- How to reuse and properly dispose of an API request context

---

## 📁 Files in this folder

### 1) `01-basic-get-request-fixture.spec.ts`

**What it teaches:**
- Making a basic GET API call using Playwright's built-in `request` fixture
- No custom `APIRequestContext` is created — Playwright manages lifecycle for you

**When to use:**
- Small or simple API tests where minimal configuration is needed

**Pros:**
- Very simple and low boilerplate
- Lifecycle managed automatically

**Cons:**
- Limited control over headers, auth, and baseURL

---

### 2) `02-get-custom-request-context.spec.ts`

**What it teaches:**
- Creating a custom `APIRequestContext` with `request.newContext()`
- Manually setting headers, baseURL, and other options

**When to use:**
- When you need consistent configuration across multiple requests or tests

**Pros:**
- Full control and reusability
- Scales well for larger test suites

**Cons:**
- Must create and dispose the context manually

---

### 3) `03-reuse-custom-context-with-hooks.spec.ts`

**What it teaches:**
- Reusing the same `APIRequestContext` across tests using `beforeAll` and `afterAll`
- Proper lifecycle management: create once, share, then dispose once

**Why it matters:**
- Improves test performance and reduces setup duplication

---

## ⚙️ Important notes

- This folder **hardcodes `baseURL` in tests for clarity**. In real projects, prefer configuring `baseURL` via `playwright.config.ts` or environment variables.
- This repository defines an `api-tests` project in `playwright.config.ts` with `testMatch: '**/*.spec.ts'`. Use `npx playwright test --project=api-tests` to run all spec files that match `*.spec.ts`.
- If many tests share the same API configuration, create a **custom fixture** that provides a shared `APIRequestContext` and disposes it automatically.
- The examples here are intentionally simple for learning and interview practice.

---

## ▶ Run the tests

Run a single test file:

```bash
npx playwright test tests/01-api-setup-basics/01-basic-get-request-fixture.spec.ts
```

Run all tests in this folder:

```bash
npx playwright test tests/01-api-setup-basics
```

Run all spec files across the repository (the `api-tests` project matches `**/*.spec.ts`):

```bash
npx playwright test --project=api-tests
```

---

> Tip: Use `npx playwright test -g "pattern"` to run specific tests by name or `--reporter=list` for concise output.
