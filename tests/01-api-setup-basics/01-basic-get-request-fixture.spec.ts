import { test, expect } from '@playwright/test';

test('GET using request fixture', async ({ request }) => {
  // 👉 Here we are using Playwright's built-in request fixture
  // 👉 No custom APIRequestContext is created

  const response = await request.get('https://restful-booker.herokuapp.com/booking');

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.length).toBeGreaterThan(0);
});
