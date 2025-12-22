import {
  test,
  expect,
  request,
  APIRequestContext
} from '@playwright/test';

let apiContext: APIRequestContext;

test.beforeAll(async () => {
  // 👉 Context created ONCE before all tests
  apiContext = await request.newContext({
    baseURL: 'https://restful-booker.herokuapp.com'
  });
});

test('GET users', async () => {
  const response = await apiContext.get('/booking');
  expect(response.status()).toBe(200);
});

// in below test baseURI will be same but endpoint could be diff like /users or /names etc
test.skip('GET health check', async () => {
  const response = await apiContext.get('/health');
  expect(response.status()).toBe(200);
});

test.afterAll(async () => {
  // 👉 Context disposed ONCE after all tests
  await apiContext.dispose();
});
