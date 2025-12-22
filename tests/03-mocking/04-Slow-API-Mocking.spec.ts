import { test, expect } from '@playwright/test';


// Modify real API response
test('simulate backend 500 error on order api', async ({ page }) => {

  // 1️⃣ Intercept API and fetch real response
  await page.route('**/api/basicstore/products?from=1&to=10&limit=10', async route => {

    await new Promise(resolve => setTimeout(resolve,8000));
    await route.continue();

  });

  //await page.pause();

  // 2️⃣ Navigate to the page
  await page.goto('https://testpages.herokuapp.com/apps/basiccart/?page=1&limit=10');

  await page.pause();
});