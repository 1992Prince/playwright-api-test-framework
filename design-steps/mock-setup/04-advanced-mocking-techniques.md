# Advanced Mocking Techniques in Playwright

This document covers various use-cases for API mocking in Playwright beyond basic mocking.

## 1️⃣ `page.route()` and `route.fulfill()` – Basics (MOST IMPORTANT)

### 🔹 `page.route()` kya karta hai?
👉 `page.route()` browser se jaane wali network request ko intercept karta hai.

Simple words me:
*   Jab UI open hoti hai
*   UI automatically kuch APIs call karti hai
*   Playwright bolta hai:
“Agar yeh API call hui, pehle mere paas aayegi”

```typescript
await page.route('**/api/products', route => {
  // intercept yahin hota hai
});
```
⚠️ **Important**
*   Sirf wahi APIs intercept hoti hain jo UI actually call karti hai
*   Random API mock karne ka koi matlab nahi

### 🔹 `route.fulfill()` kya karta hai?
👉 `route.fulfill()` ka matlab:
“Yahin se API ka response bhej do”

Iske baad:
*   API backend tak jaati hi nahi (in case of full mock)
*   Ya real API ke response ko replace kar diya jaata hai

```typescript
await route.fulfill({
  status: 200,
  body: JSON.stringify({ status: 'SUCCESS' })
});
```

### 🔹 Golden Rule (Yaad Rakhna)
Jo API UI call karti hai, usi API ko hum mock / modify / abort / delay karte hain.

Flow always aisa hota hai:
UI open
 ↓
UI API call trigger
 ↓
Playwright intercepts (`route`)
 ↓
Mock / Modify / Abort / Delay
 ↓
UI ko wahi response milta hai
 ↓
QA validation

---

## 2️⃣ API Mocking ka Correct Mental Model

*   UI jab load hoti hai, APIs trigger hoti hain
*   Hum pehle hi `route` define kar dete hain
*   Isliye jab API call hoti hai:
    *   Wo already intercepted hoti hai
    *   Mocked response UI ko milta hai
*   UI ko lagta hai:
    “Backend ne hi response bheja”

⚠️ API mock karne ke liye
*   API ka real response structure samajhna zaroori hai
*   Same shape / contract follow karna padega

---

## 3️⃣ Playwright API Mocking – Clean Use-Cases

### 1. Full API Mocking (Clear E2E Story + Statement)

#### 🔹 What actually happens on UI (Story)
*   User UI me “Place Order” button pe click karta hai
*   UI internally `/api/payment` API call trigger karti hai
*   Normally yeh API:
    *   Third-party payment gateway
    *   Sandbox unreliable
    *   Lower env me unavailable hoti hai
👉 Is wajah se E2E flow break ho jaata hai

#### 🔹 QA / SDET Decision
“Payment gateway ko test karna hamara goal nahi hai.
Hume sirf yeh validate karna hai ki payment success ke baad UI ka behaviour sahi hai ya nahi.”

Isliye:
*   Hum real payment API call hone hi nahi dete
*   Uski jagah mocked response fulfill kar dete hain

#### 🔹 Technical Flow (Very Important)
User clicks Place Order
 ↓
UI triggers `/api/payment`
 ↓
Playwright already intercepting this API
 ↓
Real backend API is NOT called
 ↓
Mocked response is fulfilled
 ↓
UI receives success response
 ↓
Order success page is validated

#### 🔹 Code Example (Full API Mocking)
```typescript
await page.route('**/api/payment', async route => {
  // Instead of calling real payment API
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      status: 'SUCCESS',
      transactionId: 'TXN-123456'
    })
  });
});
```
#### 🔹 What exactly happened here (One-line)
When the user clicks Place Order, the UI triggers `/api/payment`, and instead of hitting the real payment service, Playwright intercepts the call and fulfills it with a mocked successful payment response.

#### 🔹 Where this is used (Real Projects)
*   Payment gateways
*   OTP services
*   Email / notification services
*   Any third-party integration

---

### 2. Modify API Response (Patch Real Data) – Deep & Clear

Ab yeh part thoda advanced hai, isliye slow & clear explain kar raha hoon.

#### 🔹 Problem Statement (Story)
*   Backend API available hai
*   Lekin response:
    *   Kabhi different hota hai
    *   Kabhi rare fields missing hote hain
*   QA ko:
    *   Specific scenario validate karna hai
    *   Bug reproduce karna hai
    *   Test ko stable banana hai
👉 Full mock karna bhi nahi chahte, kyunki backend integration important hai.

#### 🔹 QA / SDET Decision
“API ko real hi call hone do, lekin uske response ko thoda modify kar dete hain.”

#### 🔹 Important Concept (Write This)
👉 `route.fetch()`
*   Actual API call karta hai
*   Backend se real response laata hai
👉 Us response se hum:
*   Status code
*   Headers
*   Body (JSON)
sab access kar sakte hain.

#### 🔹 Technical Flow
UI triggers API
 ↓
Playwright intercepts request
 ↓
`route.fetch()` calls REAL backend
 ↓
Backend returns real response
 ↓
QA modifies response data
 ↓
`route.fulfill()` sends modified response to UI

#### 🔹 Code Example (With Status, Headers, Body)
```typescript
await page.route('**/api/order/summary', async route => {

  // 1️⃣ Call the REAL backend API
  const response = await route.fetch();

  // 2️⃣ Read status code
  const status = response.status();

  // 3️⃣ Read headers
  const headers = response.headers();

  // 4️⃣ Read JSON body
  const json = await response.json();

  // 5️⃣ Modify response data
  json.orderStatus = 'CONFIRMED';

  // 6️⃣ Fulfill with patched response
  await route.fulfill({
    status,
    headers,
    contentType: 'application/json',
    body: JSON.stringify(json)
  });
});
```
#### 🔹 Very Important Clarification
We are not creating a fake API response. We are modifying a REAL API response.
That’s why:
*   API contract remains intact
*   Backend logic is still covered
*   Tests are stable & reproducible

#### 🔹 What exactly we achieved here
*   ✔ Real API was called
*   ✔ Status code was preserved
*   ✔ Headers were preserved
*   ✔ Only required fields were modified
*   ✔ UI received controlled data

#### 🔹 One-Line Statement (Interview-Ready)
“In modify API response scenarios, we intercept the UI-triggered API call, fetch the real backend response using route.fetch(), read and optionally preserve its status and headers, patch only the required fields in the response body, and then fulfill the modified response back to the UI.”

#### 🔹 Where QA Uses This
*   Bug reproduction
*   Rare data scenarios
*   Feature partially deployed
*   Flaky E2E tests

---

### 3. Conditional Mocking (Smart E2E)

#### 🔹 Concept (Simple)
👉 Same API
👉 Different response
👉 Based on request data

UI jo data bhejti hai, uske basis pe response decide hota hai.

#### 🎯 Scenario: Payment
*   Valid card → success
*   Invalid card → failure
*   Backend sandbox unreliable

#### 🔹 Example
```typescript
await page.route('**/api/payment', async route => {
  const body = route.request().postDataJSON();

  if (body.cardNumber === '4111111111111111') {
    await route.fulfill({
      status: 200,
      body: JSON.stringify({ status: 'SUCCESS' })
    });
  } else {
    await route.fulfill({
      status: 400,
      body: JSON.stringify({ status: 'FAILED' })
    });
  }
});
```

#### 🔹 Where QA Uses
*   Payment success / failure
*   Login valid / invalid
*   Coupon valid / expired
*   Address serviceable / not

---

### 4. Error Simulation (Failure Testing)

#### 🔹 Concept
👉 Backend ko intentionally fail karwao
👉 UI ka error handling test karo

#### 🎯 Scenario
**Bug:**
“Order API fail hone par UI blank ho jaati hai”

**QA needs:**
*   Error banner
*   Retry button
*   Friendly message

#### 🔹 Example (500 Error)
```typescript
await page.route('**/api/order', route =>
  route.fulfill({
    status: 500,
    body: 'Internal Server Error'
  })
);
```

#### 🔹 Where QA Uses
*   Service down
*   Backend crash
*   Resilience testing

---

### 5. Network Delay / Slowness Simulation

#### 🔹 Concept
👉 API response slow kar do
👉 Loader / spinner behavior validate karo

#### 🎯 Scenario
**Bug:**
“Slow API pe spinner nahi dikhta”

#### 🔹 Example
```typescript
await page.route('**/api/items', async route => {
  await new Promise(r => setTimeout(r, 3000));
  await route.continue();
});
```
#### 🔹 Where QA Uses
*   Loader visibility
*   Skeleton UI
*   Timeout messages

---

### 6. Block Requests (Dependency Isolation)

#### 🔹 Concept
👉 Kuch APIs completely block kar do

Usually:
*   Analytics
*   Ads
*   Tracking scripts

#### 🔹 Example
```typescript
await page.route('**/analytics/**', route => route.abort());
```

#### 🔹 Where QA Uses
*   Faster CI
*   Less flaky tests
*   External dependency removal

---

## 🧠 Final One-Paragraph Summary (VERY IMPORTANT)
In Playwright, we intercept only those APIs which are triggered by the UI. Using `page.route`, we can mock, modify, delay, abort, or conditionally respond to these API calls based on our test scenarios. This ensures our UI receives predictable responses, allowing us to validate E2E flows, negative scenarios, performance behavior, and error handling without being blocked by backend availability or instability.
