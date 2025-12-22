# 📘 Playwright + MySQL DB Validation (Docker-Based)

*Installation → Practice → Framework → Fixture → CI → Interview Story*

---

## 1️⃣ Local Installation & Practice Setup (No Framework Yet)

### 🔹 Pre-requisites

*   Windows machine
*   Docker Desktop installed & running
*   Node.js + Playwright project (already present)
*   ❗ No local MySQL installation required

### 🔹 STEP 1 — Run MySQL using Docker (Windows / PowerShell)

👉 Run this command in PowerShell / CMD:

```powershell
docker run --name mysql-test-db ^
  -e MYSQL_ROOT_PASSWORD=root123 ^
  -e MYSQL_DATABASE=testdb ^
  -p 3306:3306 ^
  -d mysql:8.0
```

**What this command does (short & clear)**

*   `mysql:8.0` → Official MySQL image
*   `MYSQL_ROOT_PASSWORD=root123` → test-only password
*   `MYSQL_DATABASE=testdb` → DB auto-created
*   `-p 3306:3306` → accessible from local machine
*   `--name mysql-test-db` → easy container reference
*   `-d` → runs in background

### ✅ STEP 1 Success Check

```sh
docker ps
```

You should see:

*   **Container name**: `mysql-test-db`
*   **Status**: `Up`

OR verify in Docker Desktop → Containers (green running).

### 📌 IMPORTANT (note this for later)

*   **DB name**: `testdb`
*   **User**: `root`
*   **Password**: `root123`
*   **Port**: `3306`

### 🛑 Stop & Restart Container (for practice)

```sh
docker stop mysql-test-db
docker start mysql-test-db
```

This teaches you that DB is disposable and controllable, just like in CI.

### 🔹 STEP 2 — Enter Interactive MySQL Mode

```sh
docker exec -it mysql-test-db mysql -uroot -proot123 testdb
```

If successful, you’ll see:

```
mysql>
```

**What this confirms**

*   Container is reachable
*   Credentials are correct
*   DB exists

👉 This itself is a learning milestone.

### 🔹 STEP 3 — Create Microservice-Style Table

Inside `mysql>` prompt:

```sql
CREATE TABLE user_account (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  email VARCHAR(100),
  status VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Verify:**

```sql
SHOW TABLES;
```

**Expected:**

*   `user_account`

**Why this table?**

This mirrors what real APIs persist:

*   identity
*   business state
*   timestamps

No over-engineering.

### 🔹 STEP 4 — Simulate API Write (Manual)

Imagine API: `POST /users`

Inside `mysql>`:

```sql
INSERT INTO user_account (user_id, email, status)
VALUES ('USR_001', 'usr001@test.com', 'ACTIVE');
```

**Verify:**

```sql
SELECT * FROM user_account;
```

**Expected:**

*   `id` auto-generated
*   `status` = `ACTIVE`
*   timestamps populated

**Why this matters (story angle)**

> “After hitting the API, we validated that a row was created in DB with correct identifier, state, and timestamps.”

You are now verifying system truth, not guessing.

### 🔹 STEP 5 — What to Validate from DB (Very Important)

✅ **Validate ONLY:**

*   **Identity**
    *   Row exists for `user_id`
*   **Business state**
    *   `status` = `ACTIVE`
*   **System timestamps**
    *   `created_at` and `updated_at` are NOT null

🚫 **Do NOT validate:**

*   Auto-increment IDs
*   Exact timestamp values
*   Column order
*   Internal DB defaults

📌 **Rule to memorize**

> Validate what the business/API owns, not DB internals.

---

## 2️⃣ Framework Setup — Playwright → MySQL (Without API)

**Goal**

Prove:

> “Playwright can connect to Dockerized MySQL and fetch data.”

### 🔹 Install dependency

```sh
npm install mysql2
```

### 🔹 DB Query Utility

**`db/dbQueries.ts`**

```typescript
export async function getUserByUserId(db: any, userId: string) {
  const [rows] = await db.execute(
    'SELECT user_id, status, created_at, updated_at FROM user_account WHERE user_id = ?',
    [userId]
  );
  return rows as any[];
}
```

### 🔹 DB Fixture (FINAL Strategy)

**`fixtures/dbFixture.ts`**

```typescript
import { test as base } from '@playwright/test';
import * as mysql from 'mysql2/promise';

type DbFixtures = {
  db: mysql.Connection;
};

export const test = base.extend<DbFixtures>({
  db: async ({}, use) => {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'root123',
      database: 'testdb'
    });
    await use(connection);
    await connection.end();
  }
});

export { expect } from '@playwright/test';
```

**Why Fixture?**

*   Clean lifecycle
*   Auto cleanup
*   Scales across tests
*   CI-ready

> “DB connectivity is managed centrally using Playwright fixtures.”

### 🔹 DB-Only Test

**`tests/user.e2e.spec.ts`**

```typescript
import { test, expect } from '../fixtures/dbFixture';
import { getUserByUserId } from '../db/dbQueries';

test('DB utility can fetch user by userId', async ({ db }) => {
  const rows = await getUserByUserId(db, 'USR_001');
  expect(rows.length).toBe(1);
  expect(rows[0].status).toBe('ACTIVE');
});
```

**Run:**

```sh
npx playwright test
```

---

## 3️⃣ CI Execution (Docker + Playwright)

**CI Flow**

1.  Start MySQL container
2.  → Run Playwright tests
3.  → Validate DB
4.  → Stop container

**Sample CI Commands**

```sh
docker run --name mysql-test-db -e MYSQL_ROOT_PASSWORD=root123 -e MYSQL_DATABASE=testdb -p 3306:3306 -d mysql:8.0
sleep 20
npx playwright test
docker rm -f mysql-test-db
```

📌 Same tests, no code change.

---

## 4️⃣ FINAL E2E Project Story (Interview-Ready)

> “We run MySQL as a Docker container to avoid local dependencies.
> Playwright triggers APIs and validates responses first.
> After API success, we validate database state using a read-only DB utility.
> DB connectivity is managed via Playwright fixtures for clean lifecycle handling.
> We validate only business-critical fields like identity, state, and timestamps.
> The same setup runs locally and in CI, making tests reliable and portable.”

---

### 🎯 What This Demonstrates

*   Infra awareness
*   Backend validation maturity
*   Clean framework design
*   CI readiness
*   SDET Lead thinking

**You now have:**

*   ✅ A practice lab
*   ✅ A framework design
*   ✅ A strong interview story

**If you want next:**

*   Retry / eventual consistency handling
*   Parallel execution safety
*   Negative DB validations
*   Kubernetes version of this story
