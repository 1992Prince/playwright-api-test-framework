import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
 import dotenv from 'dotenv';
 import path from 'path';
 dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', {open: 'never'}],
    ['json', { outputFile: 'test-results/jsonReport.json' }],
  ],

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  // This use block is available in 3 diff places:
  // 1. global level - below is example wch will be common for all projects and all tests
  // 2. project level - inside each project [see project - conduit-regression-all for example]
  // 3. test level - inside each test file [see tests/smokeTests.spec.ts for example]
  use: {

    // This use block is common for all projects [global level]
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    // trace: 'on-first-retry', [we don't have ui so no need of page trace]

    // if u have some header or some auth token that is common for all tests in this api framework
    // and u need to add this header in all requests then u can add here in use block - like below
    // extraHTTPHeaders: {
    //   'Authorization': `Token ${process.env.API_TOKEN}`
    // }
      extraHTTPHeaders: {
      'X-Run-Id': process.env.RUN_ID || 'RUN_UNKNOWN'
    }

    // and also if your apis have basic auth then you can add here like below
    // httpCredentials: {
    //   username: process.env.BASIC_AUTH_USERNAME || 'admin',
    //   password: process.env.BASIC_AUTH_PASSWORD || 'password',
    // },
  },

  globalSetup: require.resolve('./global-setup.ts'),
  globalTeardown: require.resolve('./global-teardown.ts'),



  /* below we have given testmatch for spec file but we can give also testDir name also 
     where all specs of that folder we want to run */
  projects: [
    //  {
    //   name: 'setup',
    //  // testMatch: 'global.setup.spec.ts',
    // },
    {
      name: 'conduit',
      testDir: 'tests/conduit',  // all spec files of regressionTests folder [for now I don't have this folder]
      //dependencies: ['conduit-smoke'], // this project will run after conduit-smoke project is run
      // if conduit-smoke project fails then this project will be skipped
      use: {
        // This use block is specific to this project only
        extraHTTPHeaders: {
          'x-regression-header': 'regressionHeaderValue',
        },
      },
      workers: 1,// if we will not override here then if we run this project then all spec files will run in parallel of workers 3. above workers is not applicable at project level seems
    },
    {
      name: 'mocks',
       testDir: 'tests/03-mocking',
      //dependencies: ['setup'],
    },
    {
      name: 'conduit-ci',
       testDir: 'tests/conduit-ci',
      //dependencies: ['setup'],
    },
    // {
    //   name: 'api-tests',
    //   testMatch: '**/*.spec.ts',
    // }

    /**
     * Imp Notes about projects:
     * 1. with command also we can pass wch project we want to run - npx playwright test --project=conduit-smoke
     * 
     * 2. Also we can create depdencies between projects:
     *    project conduit-regression-all will run after conduit-smoke project is run
     *    if conduit-smoke project fails then conduit-regression-all project will be skipped
     *    [useful when we have larger suite and we want to run basic ones to check if app is stable then only run larger suite]
     */
  ],

});
