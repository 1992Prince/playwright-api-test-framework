import { test, expect } from '@playwright/test';


// Modify real API response
test('gets the json from api and adds a new fruit', async ({ page }) => {

  // 1️⃣ Intercept API and fetch real response
  await page.route('**/api/v1/fruits', async route => {

    // Fetch the original response
    const response = await route.fetch();
    const json = await response.json();

    // Modify the response
    json.push({ name: 'Java', id: 100 });

    // Fulfill with patched response
    await route.fulfill({
      response,
      json
    });
  });

  // 2️⃣ Navigate to the page
  await page.goto('https://demo.playwright.dev/api-mocking');

  // 3️⃣ Assertion
  await expect(
    page.getByText('Java', { exact: true })
  ).toBeVisible();

  //await page.pause();
});