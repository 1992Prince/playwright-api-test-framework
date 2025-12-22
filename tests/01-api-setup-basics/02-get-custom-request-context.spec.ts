import { test, expect, request } from '@playwright/test';

test('GET using custom APIRequestContext', async () => {
  // 👉 Creating a custom APIRequestContext
  // 👉 This is equivalent to RequestSpecification in REST Assured
  // 👉 complete endpoint - https://restful-booker.herokuapp.com/booking
  const apiContext = await request.newContext({
    baseURL: 'https://restful-booker.herokuapp.com', // hardcoded for practice
    extraHTTPHeaders: {
      'Content-Type': 'application/json'
    }
  });

  const response = await apiContext.get('/booking');
  expect(response.status()).toBe(200);

  // 👉 Always dispose custom context
  await apiContext.dispose();
});
