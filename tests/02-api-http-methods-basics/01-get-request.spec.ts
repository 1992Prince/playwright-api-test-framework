import { test, expect } from '@playwright/test';

test('GET request - fetch users', async ({ request }) => {
  const response = await request.get('https://restful-booker.herokuapp.com/booking');

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.length).toBeGreaterThan(0);
});
