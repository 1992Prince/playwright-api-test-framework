import { expect } from '@playwright/test';
import { consoleLogger } from '../../utils/consoleLoggerSingletonInstance';
import { test } from '../../fixtures/api-fixture';
import { validateSchema } from '../../utils/schema-validator';

test.beforeAll('run once before all tests', async ({ api, config }) => {

    consoleLogger.info('beforeAll: Starting auth token generation for user=%s', config.userEmail);

});

// Smoke Tests
test('Get All Articles Test @smoke1', async ({ api, config}, testInfo) => {

    consoleLogger.info(`Running test: ${testInfo.title}`);
    let response: any;

    // Step 1 - Hit the endpoint
    response = await api
            .url(config.apiUrl)
            .path('/articles')
            .params({ limit: 10, offset: 0 })
            .getRequest();

    // Step 2 - Attach logs
    const getArticlesLogs = api.getLogs();
        await testInfo.attach('API Logs', {
            body: getArticlesLogs,
            contentType: 'text/plain',
        });

    // Step 3 - Clear logs
    api.clearLogs();

    // Step 4 - Print response (for console view)
    consoleLogger.info('Response: %s', JSON.stringify(await response.json(), null, 2));

    // Step 5 - Validate response
    const json = await response.json();
    expect(response.status()).toBe(200);

    // schema validation
    await validateSchema('conduit/articles', 'GET_articles', await response.json());


});

test.skip('Get All Articles Test 2 @smoke1', async ({ api, config}, testInfo) => {

    consoleLogger.info(`Running test: ${testInfo.title}`);
    let response: any;

    // Step 1 - Hit the endpoint
    response = await api
            .url(config.apiUrl)
            .path('/articles')
            .params({ limit: 10, offset: 0 })
            .getRequest();

    // Step 2 - Attach logs
    const getArticlesLogs = api.getLogs();
        await testInfo.attach('API Logs', {
            body: getArticlesLogs,
            contentType: 'text/plain',
        });

    // Step 3 - Clear logs
    api.clearLogs();

    // Step 4 - Print response (for console view)
    consoleLogger.info('Response: %s', JSON.stringify(await response.json(), null, 2));

    // Step 5 - Validate response
    const json = await response.json();
    expect(response.status()).toBe(200);

    // schema validation
    await validateSchema('conduit/articles', 'GET_articles', await response.json());


});
test('Get All Articles Test 3 @smoke1', async ({ api, config}, testInfo) => {

    consoleLogger.info(`Running test: ${testInfo.title}`);
    let response: any;

    // Step 1 - Hit the endpoint
    response = await api
            .url(config.apiUrl)
            .path('/articles')
            .params({ limit: 10, offset: 0 })
            .getRequest();

    // Step 2 - Attach logs
    const getArticlesLogs = api.getLogs();
        await testInfo.attach('API Logs', {
            body: getArticlesLogs,
            contentType: 'text/plain',
        });

    // Step 3 - Clear logs
    api.clearLogs();

    // Step 4 - Print response (for console view)
    consoleLogger.info('Response: %s', JSON.stringify(await response.json(), null, 2));

    // Step 5 - Validate response
    const json = await response.json();
    expect(response.status()).toBe(200);

    // schema validation
    await validateSchema('conduit/articles', 'GET_articles', await response.json());


});
test('Get All Articles Test 4 @smoke1', async ({ api, config}, testInfo) => {

    consoleLogger.info(`Running test: ${testInfo.title}`);
    let response: any;

    // Step 1 - Hit the endpoint
    response = await api
            .url(config.apiUrl)
            .path('/articles')
            .params({ limit: 10, offset: 0 })
            .getRequest();

    // Step 2 - Attach logs
    const getArticlesLogs = api.getLogs();
        await testInfo.attach('API Logs', {
            body: getArticlesLogs,
            contentType: 'text/plain',
        });

    // Step 3 - Clear logs
    api.clearLogs();

    // Step 4 - Print response (for console view)
    consoleLogger.info('Response: %s', JSON.stringify(await response.json(), null, 2));

    // Step 5 - Validate response
    const json = await response.json();
    expect(response.status()).toBe(200);

    // schema validation
    await validateSchema('conduit/articles', 'GET_articles', await response.json());


});
test.skip('Get All Articles Test 5 @smoke1', async ({ api, config}, testInfo) => {

    consoleLogger.info(`Running test: ${testInfo.title}`);
    let response: any;

    // Step 1 - Hit the endpoint
    response = await api
            .url(config.apiUrl)
            .path('/articles')
            .params({ limit: 10, offset: 0 })
            .getRequest();

    // Step 2 - Attach logs
    const getArticlesLogs = api.getLogs();
        await testInfo.attach('API Logs', {
            body: getArticlesLogs,
            contentType: 'text/plain',
        });

    // Step 3 - Clear logs
    api.clearLogs();

    // Step 4 - Print response (for console view)
    consoleLogger.info('Response: %s', JSON.stringify(await response.json(), null, 2));

    // Step 5 - Validate response
    const json = await response.json();
    expect(response.status()).toBe(200);

    // schema validation
    await validateSchema('conduit/articles', 'GET_articles', await response.json());


});
