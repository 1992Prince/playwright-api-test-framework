import { test, expect } from '@playwright/test';

// Mock API response completely
test.skip("mocks a fruit and doesn't call api - simple one", async ({ page }) => {

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

test.skip("mocks a fruit and doesn't call api - complex one", async ({ page }) => {

    // 1️⃣ Mock the API BEFORE page navigation
    await page.route('**/api/v1/fruits', async route => {
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

    await page.pause();

    // 2️⃣ Navigate to the page
    await page.goto('https://demo.playwright.dev/api-mocking');

    // 3️⃣ Assertion - mocked data should be visible
    await expect(page.getByText('ORD-12345')).toBeVisible();

    await page.pause();
});

// Mock API response completely [IMP One- bcoz here /api/users is not called when we open reqres.in]
test('mock GET request with route', async ({ page }) => {

  // 1️⃣ Mock API response
  await page.route('**/api/users', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 1, name: 'Mocked user' }
      ])
    });
  });

  await page.pause();

  // 2️⃣ Navigate to any page (context is needed for fetch)
  await page.goto('https://reqres.in');

  await page.pause();

  // 3️⃣ Trigger fetch from browser context
  const response = await page.evaluate(async () => {
    const res = await fetch('/api/users');
    return res.json();
  });


  console.log('Response from mocked API:', response);
  // 4️⃣ Assertion
  expect(response[0].name).toBe('Mocked user');

 // await page.pause();
});