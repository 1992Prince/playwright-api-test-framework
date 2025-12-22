# 📘 Document–2: Playwright → MySQL DB Validation (Smoke Test → Fixture-Based Design)

---

## 🎯 Purpose of This Document

Before building API + DB E2E automation, a mature SDET always validates:

> “Can my automation framework reliably connect to the database?”

This document explains:

*   DB smoke test approach (direct connection)
*   Why we do it before fixtures
*   How we graduate to fixture-based design
*   How this supports E2E testing and CI

---

## 1️⃣ Why DB Smoke Test First (Very Important)

❌ **Common mistake**

People directly jump to:

*   Fixtures
*   `beforeAll`
*   API + DB combined tests

When it fails, root cause becomes unclear.

✅ **Correct engineering approach**

Break it into layers:

1.  **DB connectivity works**
2.  DB query utilities work
3.  Lifecycle management via fixture
4.  API + DB E2E

📌 This reduces compound failures.

---

## 2️⃣ DB Smoke Test (Direct DB Connectivity)

**Goal**

Prove only one thing:

> “Playwright running on local Windows can connect to MySQL running in Docker and fetch data.”

No API. No fixtures. No abstractions.

### 📁 File: `db/dbSmokeTest.ts`

```typescript
import * as mysql from 'mysql2/promise';

export async function fetchUsers() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root123',
    database: 'testdb'
  });

  const [rows] = await connection.execute(
    'SELECT user_id, status FROM user_account'
  );

  await connection.end();
  return rows;
}
```

**Code walkthrough (what’s happening)**

*   `mysql.createConnection` → Opens direct connection to Dockerized MySQL
*   `execute()` → Runs read-only `SELECT` query
*   `connection.end()` → Ensures clean shutdown (no leaks)

📌 This file is temporary by design.

### 📁 File: `tests/db-connection.spec.ts`

```typescript
import { test, expect } from '@playwright/test';
import { fetchUsers } from '../../db/dbSmokeTest';

test('Playwright can connect to MySQL Docker DB', async () => {
  const rows = await fetchUsers();
  console.log(rows);
  expect(Array.isArray(rows)).toBeTruthy();
});
```

**Test purpose**

*   Confirms DB connectivity
*   Confirms query execution
*   Confirms async handling in Playwright

**✅ Expected Output**

```json
[
  { "user_id": "USR_001", "status": "ACTIVE" }
]
```

**What this proves**

*   ✔ Windows → Docker networking works
*   ✔ MySQL credentials are correct
*   ✔ Playwright async flow is correct

**❗ Why this test exists**

> “Before building framework abstractions, we validated DB connectivity in isolation.”

This sentence itself is interview gold.

---

## 3️⃣ Why Smoke Test Is NOT Enough

Problems with direct DB calls in tests:

*   Repeated connections
*   Manual cleanup
*   Poor scalability
*   Not CI-friendly

So we evolve the design.

---

## 4️⃣ Fixture-Based DB Connectivity (Final Design)

**Why Fixtures?**

*   Central lifecycle management
*   Auto cleanup
*   Clean test signatures
*   Works across test files
*   CI-ready

📌 This is the production-grade solution.

### 📁 File: `fixtures/dbFixture.ts`

```typescript
import { test as base } from '@playwright/test';
import * as mysql from 'mysql2/promise';

type DbFixtures = {
  db: mysql.Connection;
};

export const test = base.extend<DbFixtures>({
  db: async ({}, use) => {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root123',
      database: process.env.DB_NAME || 'testdb'
    });
    await use(connection);
    await connection.end();
  }
});

export { expect } from '@playwright/test';
```

**Fixture walkthrough**

*   DB connection created before test
*   Injected as `db` into test
*   Automatically closed after test
*   Environment-configurable (local / CI)

---

## 5️⃣ DB Query Utility (Business-Focused)

### 📁 File: `db/userQueries.ts`

```typescript
export async function getUserByUserId(
  db: any,
  userId: string
) {
  const [rows] = await db.execute(
    'SELECT user_id, status, created_at, updated_at FROM user_account WHERE user_id = ?',
    [userId]
  );
  return rows;
}
```

**Design principles**

*   Read-only
*   Business-driven
*   No lifecycle logic
*   Reusable across tests

---

## 6️⃣ Test Using Fixture (DB-Only Validation)

### 📁 Test file

```typescript
import { test, expect } from '../../fixtures/dbFixture';
import { getUserByUserId } from '../../db/userQueries';

test('DB validation using fixture', async ({ db }) => {
  const userId = 'USR_001'; // existing DB value
  const rows = await getUserByUserId(db, userId);
  console.log(rows);
  expect(rows.length).toBe(1);
  expect(rows[0].user_id).toBe(userId);
});
```

**What this test demonstrates**

*   Fixture injection works
*   DB utility works
*   Query returns expected business data

---

## 7️⃣ How This Evolves into API + DB E2E

**Final E2E Flow**

1.  Playwright Test
2.  → API call
3.  → API response validation
4.  → Extract business ID
5.  → DB validation using fixture

**DB is:**

*   Read-only
*   Post-condition verification
*   Business-focused

---

## 8️⃣ Interview-Ready Explanation (Memorize This)

> “We first validated DB connectivity using a smoke test to isolate infrastructure issues. After confirming connectivity, we moved DB access into Playwright fixtures for clean lifecycle management. DB queries are read-only and business-focused. This design scales across local and CI environments and supports true API + DB E2E validation.”

### ✅ What This Shows About You

*   Engineering discipline
*   Layered debugging mindset
*   Framework design maturity
*   CI awareness
*   SDET Lead thinking

---

## If you want, next we can:

*   Convert this into Markdown for GitHub
*   Create architecture diagram
*   Add retry / eventual consistency handling
*   Prepare interview Q&A from this project

Just say 👍

---

## 1️⃣ Can you import two fixtures in the same test?

❌ Technically possible, but **NOT** recommended

**Example (don’t do this):**

```typescript
import { test as apiTest } from '../fixtures/autoApiFixture';
import { test as dbTest } from '../fixtures/dbFixture';
```

**Problems:**

*   Two `test` objects → confusion
*   Hard to maintain
*   Hard to scale
*   Interview red flag

✅ **Industry-standard rule**

> One project = one extended `test`

So yes — we will **MERGE** DB fixture into your existing fixture.

---

## 2️⃣ FINAL MERGED FIXTURE (Your exact fixture + DB added)

Below is your fixture with minimal, correct changes.
Nothing unnecessary touched.
