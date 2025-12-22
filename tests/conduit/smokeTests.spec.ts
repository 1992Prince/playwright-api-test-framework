import { test, expect } from '@playwright/test';
import { consoleLogger } from '../../utils/consoleLoggerSingletonInstance';
import { validateSchema } from '../../utils/schema-validator';

/**
 * get method return Promise<Response> object. Hover over it and you can see Promise return type.
 * And so we need to add await before request.get to get the actual Response object.
 * 
 * json() method also returns Promise<any> so we need to add await before tagsResponse.json() to get the actual response body.
 */

/**
 * In this project we have only api tests for Conduit API. And we don't need to open any browser page.
 * So we can use request fixture only without page fixture.
 * So if don't use page fixture in the test function parameter list, Playwright will not open any browser page.
 * This will make the tests run faster.
 */

// below notes are related to use block in config.ts file
// also below use properties will override the global use properties in playwright.config.ts 
// and project level use properties
// and project level use properties will override the global level use properties

test.use({
   extraHTTPHeaders: {
     // 'Authorization': `Token Value`
   }
})

test('Get Tags Test', async ({ request }) => {
   // Access Run ID from environment
  const runId = process.env.RUN_ID;

  consoleLogger.info('🧾 Current Run ID:', runId);
  consoleLogger.warn('This is warn message');
  consoleLogger.error('This is error message');
  consoleLogger.debug('This is debug message');


  const tagsResponse = await request.get('https://conduit-api.bondaracademy.com/api/tags')
  const tagsResponseBody = await tagsResponse.json();
  console.log(tagsResponseBody);

  // validating schema of tags response
  await validateSchema('conduit/tags', 'GET_tags', tagsResponseBody);


  expect(tagsResponse.status()).toBe(200);
  expect(tagsResponseBody).toHaveProperty('tags');
  expect(tagsResponseBody.tags).toBeInstanceOf(Array);
  expect(tagsResponseBody.tags[0]).toEqual('Test');
  expect(tagsResponseBody.tags.length).toBeGreaterThan(0);
  expect(tagsResponseBody.tags.length).toBeLessThan(20);
});

test('Get Articles Test', async ({ request }) => {
  const articlesResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0')
  const articlesResponseBody = await articlesResponse.json();
  console.log(articlesResponseBody);

  // validating schema of articles response
  await validateSchema('conduit/articles', 'GET_articles', articlesResponseBody);

  expect(articlesResponse.status()).toBe(200);
  expect(articlesResponseBody.articles.length).toBeLessThanOrEqual(10);
  expect(articlesResponseBody.articlesCount).toBeLessThanOrEqual(10);
  
});


