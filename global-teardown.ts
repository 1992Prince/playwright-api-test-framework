import { FullConfig } from '@playwright/test/reporter';

async function globalTeardown(config: FullConfig) {
  // This function is executed once after all tests have run.
  console.log('Global teardown finished.');
}

export default globalTeardown;
