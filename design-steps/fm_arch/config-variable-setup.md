# Config Variable Setup KT

## 1️⃣ What this config file is doing (How it works)

### Step 1: Load environment variables
```javascript
require('dotenv').config();
```
- Loads variables from `.env` file into `process.env`
- Only works locally
- In CI, env vars already exist → `.env` is not needed

### Step 2: Decide which environment to run on
```javascript
const processEnv = process.env.TEST_ENV;
const env = processEnv || 'dev';
```
**Priority**
1. `TEST_ENV` from system / CI / terminal
2. Default → `dev`

So:
- No `TEST_ENV` → `dev`
- `TEST_ENV=qa` → `qa`
- `TEST_ENV=prod` → `prod`

### Step 3: Log environment
```javascript
console.log('Running tests on environment:', env);
```
- Helps debugging:
- Confirms which environment is active
- Very useful in CI logs

### Step 4: Create default config (DEV baseline)
```javascript
const config = {
  apiUrl: process.env.API_URL || 'https://conduit-api.bondaracademy.com/api',
  userEmail: process.env.USER_EMAIL || 'testbondar1@gmail.com',
  //...
  Env: env
};
```
- **Important design pattern**: ENV VAR > Default value
- Same config file works everywhere
- Secrets never hardcoded for real environments

### Step 5: Environment-based overrides (QA / PROD)
**QA override**
```javascript
if (env === 'qa') {
  config.apiUrl = process.env.API_URL || 'https://qa-conduit-api...';
  //...
}
```
**PROD override**
```javascript
if (env === 'prod') {
  config.apiUrl = process.env.API_URL || 'https://prod-conduit-api...';
  //...
}
```
**Key rule**:
Even inside QA / PROD, env vars still win.

This allows:
- CI to override values
- Secure secret injection

### Step 6: Export single source of truth
```javascript
export { config };
```
Used everywhere:
`import { config } from '../config/config';`

---

## 2️⃣ Running locally WITH .env

### Step 1: Create .env file
```
TEST_ENV=qa
API_URL=https://custom-qa-api.com/api
USER_EMAIL=local@test.com
USER_PASSWORD=local123
```

### Step 2: Run tests
```bash
npm test
```
**Result**
- `.env` loads automatically
- `TEST_ENV=qa`
- `.env` values override defaults
- QA block runs
- ✅ Best for local dev & debugging

---

## 3️⃣ Running locally WITHOUT .env

### Option 1: No env variables at all
```bash
npm test
```
**Result:**
- `TEST_ENV` missing → defaults to `dev`
- Uses hardcoded DEV defaults

### Option 2: Pass env from command line
```bash
TEST_ENV=qa npm test
```
or (Windows PowerShell):
```powershell
$env:TEST_ENV="qa"; npm test
```
**Result:**
- QA config activated
- No `.env` required
- ✅ Useful for quick validation

---

## 4️⃣ Running in CI (CI overrides everything)

Example: GitHub Actions / Jenkins
```yaml
env:
  TEST_ENV: qa
  API_URL: https://ci-qa-api.company.com
  USER_EMAIL: ci-user@test.com
  USER_PASSWORD: ${{ secrets.QA_PASSWORD }}
```
**What happens internally**
- CI injects env vars
- `dotenv` does nothing (no `.env`)
- `process.env` already populated
- CI values override defaults + QA block
- ⚠️ `.env` should NOT be committed or used in CI

---

## 5️⃣ Precedence order (VERY IMPORTANT)

**Highest → Lowest priority**
1. CI / System env variables
2. `.env` file (local only)
3. Environment-specific defaults (qa/prod blocks)
4. DEV defaults in base config

This makes the framework:
- Secure
- Flexible
- CI-friendly
- Interview-safe

---

## 6️⃣ Why this design is industry standard

- ✅ Same code for DEV / QA / PROD
- ✅ No secrets in repo
- ✅ CI can override anything
- ✅ Easy local debugging
- ✅ Scales to Docker, Kubernetes, cloud runners

---

## 7️⃣ One-line interview explanation (use this 🔥)
> “We use a layered configuration where CI or runtime env vars override .env, which in turn override environment-specific defaults, ensuring secure and consistent execution across local and CI environments.”

---
<br>

## 8️⃣ How to Manage Configuration

This section explains the practical steps for managing configuration variables in `api-test.config.ts`.

### How to Add a New Variable

1.  **Add to Default Config:** Open `api-test.config.ts` and add your new variable to the main `config` object. Always use the pattern `process.env.YOUR_VARIABLE || 'default-value'`.
    ```javascript
    const config = {
      // ... existing variables
      myNewVariable: process.env.MY_NEW_VARIABLE || 'some-default',
    };
    ```

2.  **Add to `.env`:** For local testing, add the new variable to your `.env` file.
    ```
    MY_NEW_VARIABLE=local-value
    ```

3.  **(Optional) Add Environment-Specific Overrides:** If the variable has a different value for `qa` or `prod`, add it inside the corresponding `if` block.
    ```javascript
    if (env === 'qa') {
      // ... existing qa overrides
      config.myNewVariable = process.env.MY_NEW_VARIABLE || 'qa-specific-value';
    }
    ```

4.  **Update CI/CD:** Ensure the variable is added to your CI environment's configuration (e.g., in GitHub Actions secrets or variables).

### How to Modify a Variable for a Different Environment

1.  **Locate the Environment Block:** In `api-test.config.ts`, find the `if` block for the environment you want to change (e.g., `if (env === 'qa')`).

2.  **Set the New Value:** Inside the block, set the new value for the property. The `process.env` check is still recommended to allow for CI overrides.
    ```javascript
    // Example: Changing the user email for QA
    if (env === 'qa') {
      config.userEmail = process.env.USER_EMAIL || 'new-qa-user@example.com';
      // ... other qa values
    }
    ```

### Configuration Approach: Secrets and Overrides

The configuration follows a layered approach to be secure and flexible:

-   **Local Secrets (`.env`):** For local development, sensitive data (API keys, passwords) and local-specific settings are stored in the `.env` file. This file is **not committed to Git** (it's in `.gitignore`), so secrets never leave your machine.

-   **CI Overrides:** In a CI/CD environment (like GitHub Actions), variables are injected directly into the execution environment. These can be set as repository secrets or variables. Because `process.env` has the highest precedence in the code, **CI values automatically override any defaults from the config file or values from a local `.env` file** (which shouldn't exist in CI anyway).

This design ensures that production secrets are managed securely by the CI/CD platform and are never hardcoded in the repository.