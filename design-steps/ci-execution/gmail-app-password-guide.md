# 🔐 Generating and Using a Gmail App Password for CI/CD

This guide explains what a Gmail App Password is, how to generate one, and how to use it securely in your GitHub Actions workflow for sending email notifications.

---

### What is an App Password?

An **App Password** is a 16-digit passcode that gives a non-Google app or device permission to access your Google Account. It's designed for use with tools and services that don't support modern security standards, such as:

-   GitHub Actions
-   Jenkins
-   Other CI/CD pipelines
-   Scripts and automation tools

Google has deprecated the use of regular account passwords for SMTP access, making App Passwords the required method for such integrations.

---

### ✅ How to Get a Gmail App Password (Step-by-Step)

#### 🔹 Prerequisite (Mandatory)

Before you can generate an App Password, **2-Step Verification must be enabled** on your Google account.

---

#### Step 1️⃣ – Open Google Account Security

Navigate to your Google Account's security settings page:
👉 [https://myaccount.google.com/security](https://myaccount.google.com/security)

---

#### Step 2️⃣ – Enable 2-Step Verification

1.  Find the section named **“How you sign in to Google”**.
2.  Click on **“2-Step Verification”** and follow the on-screen instructions to enable it.
3.  You will need to complete the setup using an OTP (One-Time Password) from your phone or an authenticator app.

---

#### Step 3️⃣ – Generate the App Password

1.  In the same **Security** section, find and click on **“App passwords”**. You may need to sign in again.
2.  On the App passwords page, configure the new password:
    -   **Select app:** Choose **Mail**.
    -   **Select device:** Choose **Other (Custom name)**.
3.  Enter a descriptive name for your password, for example:
    -   `github-actions-smtp`
4.  Click the **Generate** button.

Google will display a 16-character password in a yellow box.

⚠️ **Important:** Copy this password immediately. This is the only time Google will show it to you.

---

### ❌ What NOT to Use for SMTP Authentication

-   **DO NOT** use your regular Gmail login password.
-   **DO NOT** use your company's Single Sign-On (SSO) password.
-   **DO NOT** hardcode the App Password directly in your repository files.

---

### ✅ Correct Way to Use in GitHub Actions

#### Step 1️⃣ – Store the App Password in GitHub Secrets

1.  Go to your GitHub repository and click on **Settings**.
2.  In the left sidebar, navigate to **Secrets and variables** > **Actions**.
3.  Click the **New repository secret** button.
4.  Create a new secret with the following details:
    -   **Name:** `GMAIL_APP_PASSWORD` (or a name of your choice)
    -   **Value:** Paste the 16-character App Password you generated.

---

#### Step 2️⃣ – Reference the Secret in Your Workflow

In your workflow YAML file (e.g., `playwright.yml`), use the secret in the email sending step:

```yaml
      with:
        server_address: smtp.gmail.com
        server_port: 465
        username: your-email@gmail.com
        password: ${{ secrets.GMAIL_APP_PASSWORD }}
```

This approach is:
-   **✔ Secure:** Your credential is not exposed in the code.
-   **✔ Best practice:** It follows the recommended security guidelines.
-   **✔ Production-ready:** It is safe for use in production environments.

---

### 🔄 Jenkins Equivalent (For Your Information)

In Jenkins, the process is similar:

1.  Store the App Password in the **Credentials Manager**.
2.  You can add it as a:
    -   `Username with password` credential.
    -   `Secret text` credential.
3.  Reference the credential in your Jenkins pipeline script.

---

### 🧠 Interview One-Liner

> “For CI email notifications using Gmail SMTP, we use Google App Passwords stored securely in the CI's secret manager, not the account password.”