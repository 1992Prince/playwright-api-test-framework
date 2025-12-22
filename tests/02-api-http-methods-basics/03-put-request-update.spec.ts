import { test, expect } from '@playwright/test';

test.skip('PUT request - update entire user', async ({ request }) => {
  const updatedPayload = {
    id: 10,
    name: 'John Updated',
    email: 'john.updated@test.com',
    role: 'admin'
  };

  const response = await request.put(
    'https://api.example.com/users/10',
    {
      data: updatedPayload
    }
  );

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.name).toBe(updatedPayload.name);
});
