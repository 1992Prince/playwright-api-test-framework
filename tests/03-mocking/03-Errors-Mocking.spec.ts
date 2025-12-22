import { test, expect } from '@playwright/test';


// Modify real API response
test('simulate backend 500 error on order api', async ({ page }) => {

  // 1️⃣ Intercept API and fetch real response
  await page.route('**/api/basicstore/products?from=1&to=10&limit=10', async route => {

     await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({
        message: 'Internal Server Error'
      })
    });

  });

  await page.pause();

  // 2️⃣ Navigate to the page
  await page.goto('https://testpages.herokuapp.com/apps/basiccart/?page=1&limit=10');

  // 3️⃣ Assertion
  await expect(
    page.getByText('Internal Server Error', { exact: true })
  ).toBeVisible();

  await page.pause();
});