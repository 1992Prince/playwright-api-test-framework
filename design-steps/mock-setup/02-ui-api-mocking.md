# UI-API-Mocking Explained

## 🔹 Pehle Clear Kar Le: Yeh Kya Type Ka Mocking Hai?

👉 **Yeh UI-level API Mocking hai**
*   Hum browser se jaane wali API calls ko intercept kar rahe hain
*   Real backend API ko touch hi nahi kar rahe hain
*   Backend-side mocking tools jaise:
    *   WireMock
    *   Mountebank
    *   MSW
👉 yahan use nahi ho rahe.

UI test ke andar hi hum API ka fake response return kar rahe hain.

---

## 🛒 Real-Time Ecommerce E2E Scenario (Core Story)

Assume karo:
Tumhare paas ek E2E UI automation scenario hai:

**Flow:**
1.  User product select karta hai
2.  Add to cart
3.  Checkout
4.  Place Order button click
5.  Payment page open hona chahiye
6.  Payment success ke baad:
    *   Order placed
    *   Order summary page
    *   Transaction ID show
    *   Order confirmation email

---

## ❌ Problem in Lower Environments (Reality)

*   Payment service available nahi hai
*   Third-party payment gateway (Bank / VISA / Mastercard)
*   UI se payment page open hi nahi hota
*   Tester ka E2E flow yahin break ho jaata hai

👉 Team bolegi:
“Backend ready hone ka wait karo”

But E2E QA ko test likhna hi likhna hai.

---

## ✅ Solution: UI API Mocking

**Approach:**
*   Jaise hi user Place Order pe click kare:
    *   UI normally `/payment` API call karegi
*   Hum kya karte hain?
    👉 Payment API ko intercept
    👉 Fake successful payment response return
*   UI ko lagta hai:
    “Payment ho gaya”

**Result:**
*   Order placed page open
*   Order summary visible
*   E2E scenario complete ✅

---

## 🔹 Mock Response Kahan Se Aata Hai?

Very important point 👇

Hum guess nahi karte response
*   Order summary ka API documentation available hota hai
*   Swagger / OpenAPI se:
    *   Fields
    *   Structure
    *   Data types
*   Uske basis pe hi mock JSON banate hain

---

## 🟢 Ab Pehle SIMPLE Example Samjhte Hain (Fruit Example)

**Code**

```typescript
test.skip("mocks a fruit and doesn't call api", async ({ page }) => {

  // 1️⃣ Mock the API BEFORE page navigation
  await page.route('**/api/v1/fruits', async route => {
    const json = [{ id: 21, name: 'Strawberry' }];

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(json)
    });
  });

  // 2️⃣ Navigate to the page
  await page.goto('https://demo.playwright.dev/api-mocking');

  // 3️⃣ Assertion - mocked data should be visible
  await expect(page.getByText('Strawberry')).toBeVisible();

  await page.pause();
});
```

---

## 🔍 Is Example Me Kya Ho Raha Hai? (Step-by-Step)

### 1️⃣ `page.route()` – API Intercept Karna
```typescript
await page.route('**/api/v1/fruits', async route => {
```
*   Matlab:
    *   Jab bhi UI `/api/v1/fruits` call kare
*   Playwright bole:
    👉 “Main real backend ko call nahi karne dunga”

### 2️⃣ Mock JSON Banana
```typescript
const json = [{ id: 21, name: 'Strawberry' }];
```
*   Assume:
    *   API se sirf 1 fruit aaya
*   Real API ho ya mock:
    *   UI ko structure same chahiye

### 3️⃣ `route.fulfill()` – Fake API Response
```typescript
await route.fulfill({
  status: 200,
  contentType: 'application/json',
  body: JSON.stringify(json)
});
```
*   API call:
    *   ❌ Backend nahi gayi
    *   ✅ Yahin complete ho gayi
*   Browser ko laga:
    “API successful response de chuki hai”

### 4️⃣ UI Page Load
```typescript
await page.goto(...)
```
*   UI internally API call karti hai
*   Lekin data mock se aata hai

### 5️⃣ Assertion
```typescript
expect(page.getByText('Strawberry')).toBeVisible()
```
*   UI ne mock data render kiya
*   Test pass ✅

---

## 🟠 Ab REAL E2E Example: Order + Payment + Order Summary

**Scenario:**
*   User Place Order click karta hai
*   Payment service unavailable
*   Hum payment + order summary dono mock karte hain

---

### 🔹 Mocked Payment + Order Summary Response (Realistic)

```typescript
await page.route('**/api/v1/payment', async route => {
  const paymentResponse = {
    paymentStatus: "SUCCESS",
    transactionId: "TXN-987654321",
    paymentMode: "CREDIT_CARD"
  };

  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(paymentResponse)
  });
});
```

---

### 🔹 Mocked Order Summary API

```typescript
await page.route('**/api/v1/order/summary', async route => {
  const orderSummary = {
    orderId: "ORD-12345",
    transactionId: "TXN-987654321",
    orderStatus: "CONFIRMED",
    items: [
      {
        productName: "iPhone 15",
        quantity: 1,
        price: 80000
      }
    ],
    totalAmount: 80000,
    deliveryAddress: {
      city: "Bangalore",
      pincode: "560001"
    }
  };

  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(orderSummary)
  });
});
```
---

## 🔍 Is E2E Mock Se Kya Achieve Hota Hai?

✔ Payment dependency removed
✔ Backend unavailable hone pe bhi test ready
✔ Order summary UI validate ho gaya
✔ Transaction ID verified
✔ Team ka E2E coverage complete

---

## 🧠 Interview / Team Explanation Line

“In our UI E2E tests, when critical backend services like payment are unavailable, we use UI-level API mocking in Playwright to intercept network calls and return contract-based responses derived from API documentation, allowing us to complete and validate the full user journey.”

---

## 🧱 Kab Yeh Approach Best Hai?

*   UI E2E tests
*   Lower environments
*   Third-party integrations
*   Parallel development
*   CI stability

---

## ❌ Kab Use Nahi Karna?

*   Backend API validation
*   Contract testing
*   Performance testing

You can see from the trace of the example test that the API was never called, it was however fulfilled with the mock data. and u can run script in trace mode on and see the response captured.
