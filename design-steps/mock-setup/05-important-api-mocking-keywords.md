# 🔑 Important Keywords in Playwright API Mocking

## 1️⃣ `page.route()` (Foundation)
✅ **What it is**

`page.route()` UI se jaane wali API request ko intercept karta hai.

✅ **Purpose**

Decide karna:
*   API ko mock karna hai
*   Modify karna hai
*   Delay karna hai
*   Block karna hai
*   Ya real backend tak jaane dena hai

✅ **Key Point**

Sirf wahi API intercept hoti hai jo UI actually trigger karti hai.

**Example**
```typescript
await page.route('**/api/users', route => {
  // request yahin intercept hoti hai
});
```

---

## 2️⃣ `route.fulfill()` (Mocking / Response Control)
✅ **What it is**

`route.fulfill()` API request ko yahin complete kar deta hai with a custom response.

✅ **Purpose**

*   Real backend API ko call hone hi nahi deta
*   UI ko mocked response deta hai

✅ **When to use**

*   Backend unavailable
*   Third-party APIs (Payment, OTP, Email)
*   Negative scenarios

**Example**
```typescript
await route.fulfill({
  status: 200,
  body: JSON.stringify({ status: 'SUCCESS' })
});
```

🔑 **Remember**

`route.fulfill()` = Full control over API response

---

## 3️⃣ `route.fetch()` (Call REAL Backend)
✅ **What it is**

`route.fetch()` intercepted request ke liye real backend API call karta hai.

✅ **Purpose**

*   Real API response laana
*   Us response ko modify / inspect karna

**What you can extract**
```typescript
const response = await route.fetch();

response.status();     // status code
response.headers();   // headers
await response.json(); // response body
```

**Example**
```typescript
const response = await route.fetch();
const json = await response.json();
json.status = 'CONFIRMED';

await route.fulfill({ response, json });
```

🔑 **Remember**

`route.fetch()` = Real API call + patch response

---

## 4️⃣ `page.evaluate() + fetch()` (Browser-Side Fetch)

```typescript
const response = await page.evaluate(async () => {
  const res = await fetch('/api/users');
  return res.json();
});
```

✅ **What it is**

Browser context ke andar API call. Same mocked / intercepted response milega.

✅ **Purpose**

*   Verify ki UI ko mocked response hi mil raha hai
*   Debugging & validation

🔑 **Important Point**

Playwright mocking browser network layer pe hoti hai, isliye `page.evaluate(fetch)` bhi mocked response hi dekhega.

---

## 5️⃣ `route.continue()` (Let Request Go to Backend)
✅ **What it is**

`route.continue()` request ko real backend tak jaane deta hai.

✅ **Purpose**

*   API ko real hi chalne dena
*   Sirf observe / delay / modify request

**Example**
```typescript
await route.continue();
```

🔑 **Use when**

*   Request payload validate karna ho
*   Headers add karne ho
*   Delay simulate karna ho

---

## 6️⃣ Artificial Delay (`setTimeout`)
```typescript
await new Promise(resolve => setTimeout(resolve, 8000));
```

✅ **What it does**

API response ko intentionally slow karta hai.

✅ **Purpose**

*   Loader / spinner validation
*   UX under slow network

**Combined Example**
```typescript
await page.route('**/api/items', async route => {
  await new Promise(resolve => setTimeout(resolve, 8000));
  await route.continue();
});
```
---

## 🧠 Golden Rule (VERY IMPORTANT)

Har intercepted request ke liye exactly ONE cheez honi chahiye:
*   `route.fulfill()`
*   `route.continue()`
*   `route.abort()`

Agar kuch bhi nahi kiya → API hang → UI freeze ❌

---

## 🔁 Quick Comparison Table

| Keyword | Backend Call | Use Case |
| :--- | :---: | :--- |
| `page.route()` | ❌ | Intercept API |
| `route.fulfill()` | ❌ | Full mock |
| `route.fetch()` | ✅ | Modify real response |
| `route.continue()` | ✅ | Pass-through |
| `page.evaluate(fetch)` | Depends | Validate mocked data |
| `setTimeout` | Depends | Delay simulation |
