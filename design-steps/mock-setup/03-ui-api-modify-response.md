# Modify API Responses (UI-Level API Patching)

## Sabse Pehle Clear Kar Lo
👉 Yeh pure mocking nahi hai
👉 Yeh UI-level API response modification / patching hai

Difference samjho:

| Approach | Backend API Call |
| :--- | :---: |
| Full Mocking (`route.fulfill`) | ❌ API call hoti hi nahi |
| Modify Response (`route.fetch` + `fulfill`) | ✅ API call hoti hai |

Yahan:
*   Real API call hoti hai
*   Real response aata hai
*   Us response ko thoda modify karke UI ko diya jaata hai

---

## 🛒 Real-Time E2E Scenario (Why This Is Needed)

**Ecommerce Example**

Assume karo:
*   Order summary API available hai
*   Backend already deployed hai
*   Lekin:
    *   Data har run me change ho raha hai
    *   Kabhi order me coupon aata hai, kabhi nahi
    *   Kabhi item list empty hoti hai
👉 Tests flaky ho jaate hain

**QA Requirement**
*   Test reproducible hona chahiye
*   Har run me same data state mile
*   Lekin backend ko completely mock bhi nahi karna

💡 **Solution:**
Call the real API, but patch the response

---

## 🔹 Provided Example (Fruit API)

**Code**
```typescript
test('gets the json from api and adds a new fruit', async ({ page }) => {
  // Intercept the API
  await page.route('*/**/api/v1/fruits', async route => {

    // 1️⃣ Call the REAL backend API
    const response = await route.fetch();

    // 2️⃣ Convert response to JSON
    const json = await response.json();

    // 3️⃣ Patch the response (add new fruit)
    json.push({ name: 'Loquat', id: 100 });

    // 4️⃣ Fulfill with modified response
    await route.fulfill({ response, json });
  });

  // 5️⃣ Navigate to UI
  await page.goto('https://demo.playwright.dev/api-mocking');

  // 6️⃣ Assert patched data
  await expect(page.getByText('Loquat', { exact: true })).toBeVisible();
});
```
---

## 🔍 Step-by-Step Hinglish Explanation

### 1️⃣ `page.route()` – API Intercept
```typescript
await page.route('*/**/api/v1/fruits', async route => {
```
*   UI `/api/v1/fruits` call karti hai
*   Playwright bolta hai:
    👉 “Request pehle mere paas aayegi”

### 2️⃣ `route.fetch()` – REAL API Call
```typescript
const response = await route.fetch();
```
⚠️ Yahin sabse bada difference hai
*   Real backend API hit hoti hai
*   Live data milta hai
*   Koi fake response nahi

### 3️⃣ JSON Extract Karna
```typescript
const json = await response.json();
```
*   Backend se jo fruits aaye
*   Unko JS object me convert kar liya

### 4️⃣ Response Patch Karna
```typescript
json.push({ name: 'Loquat', id: 100 });
```
*   Existing data ko touch kiya
*   Ek extra fruit add kar diya
👉 Backend ne yeh fruit kabhi bheja hi nahi

### 5️⃣ Modified Response UI Ko Dena
```typescript
await route.fulfill({ response, json });
```
*   Status code, headers → original response se
*   Body → modified JSON
UI ko lagta hai:
“Backend ne hi yeh data bheja”

### 6️⃣ Assertion
```typescript
expect(page.getByText('Loquat')).toBeVisible()
```
*   UI patched data render karti hai

---

## ✅ UI Feature Not Deployed Yet – E2E Automation Kaise Complete Hui

### 🔹 Actual Scenario (Clear & Simple)
**New Feature:**
*   UI me ek naya item list me add hone wala hai
*   Example:
    *   Existing list: Apple, Banana, Orange
    *   New item: Loquat

**QA Requirement:**
*   E2E automation me validate karna hai:
    *   Naya item list me show ho
    *   UI render sahi ho
    *   Search / selection kaam kare

---

### ❌ Problem
*   Backend API abhi deploy nahi hui
*   API response me naya item nahi aa raha
*   UI already updated hai
*   Automation blocked ❌

QA bole:
“Backend deploy hone ka wait karo”
But automation timeline wait nahi kar sakti.

---

### ✅ QA / SDET Approach (Smart & Practical)

#### Step 1️⃣: UI Developer Tools Se API Identify Ki
*   Browser DevTools → Network tab
*   Page load hone par dekha:
*   `GET /api/v1/items`
*   Response:
    ```json
    [
      { "id": 1, "name": "Apple" },
      { "id": 2, "name": "Banana" }
    ]
    ```

#### Step 2️⃣: API Contract Samjha
QA ne confirm kiya:
*   UI array list expect karti hai
*   Har item me:
    *   `id`
    *   `name`

#### Step 3️⃣: API Response Modify Kiya (UI-Level)
QA ne Playwright me API intercept karke:
*   Real API call hone di
*   Response me naya item inject kar diya

```typescript
await page.route('**/api/v1/items', async route => {
  const response = await route.fetch();
  const json = await response.json();

  // Add new item which is not yet deployed
  json.push({ id: 99, name: 'Loquat' });

  await route.fulfill({ response, json });
});
```

#### Step 4️⃣: E2E Automation Complete Ki
```typescript
await page.goto('/items');

await expect(page.getByText('Loquat')).toBeVisible();
```
✔ UI me naya item visible
✔ Automation pass
✔ Feature behavior validated

---

### 🎯 Isse QA / SDET Ko Kya Benefit Mila?

✔ **Automation Block Nahi Hui**
*   Backend deploy ka wait nahi kiya
*   Parallel development possible hua
✔ **UI Feature Validate Ho Gaya**
*   New item rendering
*   UI flow sahi hai ya nahi
✔ **Scripts Future-Proof Ban Gaye**
*   Script already production-ready

---

### 🔄 Deployment Ke Baad Kya Hua?
*   Backend deploy ho gaya
*   Real API response me Loquat aane laga
*   QA ne:
    *   `page.route(...)` // removed
*   Script dobara run ki:
    ✔ Still pass
    ✔ Koi change nahi chahiye

---

### 🧠 Most Important Line (Tumhare Words Me)
“We used UI-level API response modification to validate a new list item feature before backend deployment. This allowed us to complete E2E automation early, and once the feature was deployed, we removed the mock without changing the test logic.”

---

### 🔑 Interview-Friendly Summary
*   ❌ Backend dependency removed
*   ✅ E2E coverage completed early
*   ✅ UI validated against future contract
*   ✅ Zero rework after deployment

---

### 🏁 Final Thought (Coach Mode)
Yeh scenario dikhaata hai:
*   Tum sirf automation nahi likhte
*   Tum delivery unblock karte ho
*   Tum QA + Engineering dono sochte ho
