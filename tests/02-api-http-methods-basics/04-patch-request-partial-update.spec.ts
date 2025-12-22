import { test, expect } from '@playwright/test';

test.skip('PATCH request - partial update', async ({ request }) => {
  const patchPayload = {
    name: 'John Patched'
  };

  const response = await request.patch(
    'https://api.example.com/users/10',
    {
      data: patchPayload
    }
  );

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.name).toBe(patchPayload.name);
});
