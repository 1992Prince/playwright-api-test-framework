import { test, expect } from '@playwright/test';

test.skip('DELETE request - delete user', async ({ request }) => {
  const response = await request.delete(
    'https://api.example.com/users/10'
  );

  // Common delete responses: 200 / 204
  expect([200, 204]).toContain(response.status());
});
