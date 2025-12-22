import { test, expect } from '@playwright/test';
import { fetchUsers } from '../../db/dbSmokeTest';

test('Playwright can connect to MySQL Docker DB', async () => {
  const rows = await fetchUsers();

  console.log(rows);

  expect(Array.isArray(rows)).toBeTruthy();
});
