import { expect } from '@playwright/test';
import { APILogger } from '../../utils/logger';
import { consoleLogger } from '../../utils/consoleLoggerSingletonInstance';
import { test } from '../../fixtures/api-fixture';
import testData from '../../resources/test-data/conduit-data.json';
import { Article } from '../../resources/models/article';
import { validateSchema } from '../../utils/schema-validator';
import { TestDataGenerator } from '../../utils/test-data-generator';
import { getUserByUserId } from '../../db/userQueries';

test.beforeAll('run once before all tests', async ({ api, config }) => {

    consoleLogger.info('beforeAll: Starting auth token generation for user=%s', config.userEmail);
    

});

//test.only('Get All Articles Test @smoke', async ({ api, config, db }, testInfo) => {
// once you run db container then add db fixture in the test or uncomment above line and
// comment below line
test.only('Get All Articles Test @smoke', async ({ api, config, db }, testInfo) => {

    let response: any;

    // Step 1 - Hit the endpoint
    await test.step('Hitting GET /articles endpoint', async () => {
        response = await api
            .url(config.apiUrl)
            .path('/articles')
            .params({ limit: 10, offset: 0 })
            .getRequest();
    });

    // Step 2 - Attach logs
    await test.step('Attach API logs to report', async () => {
        const getArticlesLogs = api.getLogs();
        await testInfo.attach('API Logs', {
            body: getArticlesLogs,
            contentType: 'text/plain',
        });
    });

    // Step 3 - Clear logs
    await test.step('Clear API logs', async () => {
        api.clearLogs();
    });

    // Step 4 - Print response (for console view)
    await test.step('Print response in console', async () => {
        console.log('Response:', await response.json());
    });

    // Step 5 - Validate response
    await test.step('Validate response data', async () => {
        const json = await response.json();
        expect(response.status()).toBe(200);
    });

    // schema validation
    await validateSchema('conduit/articles', 'GET_articles', await response.json());

    // DB Validation
    const userId = 'USR_001'; // existing DB value
    
    const rows = await getUserByUserId(db, userId);
    
    console.log(rows);
    
    expect(rows.length).toBe(1);
    expect(rows[0].user_id).toBe(userId);

});


test.skip('Create And Delete Article [with no change in payload] Test', async ({ api, config, authToken }, testInfo) => {

    // here we don't want to change any payload
    const payload = testData["Create And Delete Article Test"];

    const baseUrl = config.apiUrl;

    // 🔹 STEP 1: CREATE ARTICLE
    consoleLogger.info('Step start: Create Article');
    //consoleLogger.debug('POST /articles baseUrl=%s maskedAuth=%s', baseUrl, maskedToken);

    const startCreate = Date.now();

    try {
        const newArticleResponse = await api
            .url(baseUrl)
            .path('/articles')
            .headers({ Authorization: authToken }) // other headers still u can pass
            .body(payload)
            .postRequest();

        const timeCreate = Date.now() - startCreate;
        consoleLogger.info('POST /articles status=%s timeMs=%s', newArticleResponse.status(), timeCreate);

        const newArticleResponseBody = await newArticleResponse.json();
        const slugId = newArticleResponseBody.article.slug;

        consoleLogger.debug('Created article slug=%s', slugId);

        // Attach API logs to report (optional)
        const createLogs = api.getLogs();
        await testInfo.attach('createArticleLogs', {
            body: createLogs,
            contentType: 'text/plain',
        });

        api.clearLogs();

        // ✅ ASSERTS
        expect(newArticleResponse.status()).toBe(201);
        expect(newArticleResponseBody.article.title).toEqual('AmadeusArticle - Delete Me1');

        // schema validation
        await validateSchema('conduit/articles', 'POST_article', newArticleResponseBody);

        consoleLogger.info('Step success: Article created slug=%s', slugId);

        // 🔹 STEP 2: DELETE ARTICLE
        consoleLogger.info('Step start: Delete Article %s', slugId);
        const startDelete = Date.now();

        const deleteResponse = await api
            .url(baseUrl)
            .path(`/articles/${slugId}`)
            //.clearAuth()
            .headers({ Authorization: authToken })
            .deleteRequest();

        const timeDelete = Date.now() - startDelete;
        consoleLogger.info('DELETE /articles/%s status=%s timeMs=%s', slugId, deleteResponse.status(), timeDelete);

        // Attach delete logs
        const deleteLogs = api.getLogs();
        await testInfo.attach('deleteArticleLogs', {
            body: deleteLogs,
            contentType: 'text/plain',
        });

        api.clearLogs();

        expect(deleteResponse.status()).toBe(204);
        consoleLogger.info('Step success: Article deleted slug=%s', slugId);
    } catch (err: any) {
        // 🔹 ERROR handling
        consoleLogger.error('Test failed: Create/Delete Article error=%s', err?.message ?? err);
        throw err;
    }
});

test.skip('Create And Delete Article [with modified payload] Test', async ({ api, config, authToken }, testInfo) => {

    // modify the payload [avoid directly make change in testData, first store it in payload and then change its values]
    //const payload = testData["Create And Delete Article Test"];

    // we will convert obj to string and then convert string back to obj
    // this is how we broke the dependency to modify original json obj and if u run scripts in parallel
    const payload = JSON.parse(JSON.stringify(testData["Create And Delete Article Test"]));

    const title = TestDataGenerator.getTitle();
    const description = TestDataGenerator.getDescription();
    const body = TestDataGenerator.getBody();

    payload.article.title = title;
    payload.article.description = description;
    payload.article.body = body;
    payload.article.tagList = ["Modified json payload"]

    const baseUrl = config.apiUrl;

    // 🔹 STEP 1: CREATE ARTICLE
    consoleLogger.info('Step start: Create Article');
    //consoleLogger.debug('POST /articles baseUrl=%s maskedAuth=%s', baseUrl, maskedToken);

    const startCreate = Date.now();

    try {
        const newArticleResponse = await api
            .url(baseUrl)
            .path('/articles')
            .headers({ Authorization: authToken }) // other headers still u can pass
            .body(payload)
            .postRequest();

        const timeCreate = Date.now() - startCreate;
        consoleLogger.info('POST /articles status=%s timeMs=%s', newArticleResponse.status(), timeCreate);

        const newArticleResponseBody = await newArticleResponse.json();
        const slugId = newArticleResponseBody.article.slug;

        consoleLogger.debug('Created article slug=%s', slugId);

        // Attach API logs to report (optional)
        const createLogs = api.getLogs();
        await testInfo.attach('createArticleLogs', {
            body: createLogs,
            contentType: 'text/plain',
        });

        api.clearLogs();


        consoleLogger.info('Step success: Article created slug=%s', slugId);

        // 🔹 STEP 2: DELETE ARTICLE
        consoleLogger.info('Step start: Delete Article %s', slugId);
        const startDelete = Date.now();

        const deleteResponse = await api
            .url(baseUrl)
            .path(`/articles/${slugId}`)
            //.clearAuth()
            .headers({ Authorization: authToken })
            .deleteRequest();

        const timeDelete = Date.now() - startDelete;
        consoleLogger.info('DELETE /articles/%s status=%s timeMs=%s', slugId, deleteResponse.status(), timeDelete);

        // Attach delete logs
        const deleteLogs = api.getLogs();
        await testInfo.attach('deleteArticleLogs', {
            body: deleteLogs,
            contentType: 'text/plain',
        });

        api.clearLogs();

        // expect(deleteResponse.status()).toBe(204); // correct one
        expect(deleteResponse.status()).toBe(201);
        consoleLogger.info('Step success: Article deleted slug=%s', slugId);
    } catch (err: any) {
        // 🔹 ERROR handling
        consoleLogger.error('Test failed: Create/Delete Article error=%s', err?.message ?? err);
        throw err;
    }
});

test.skip('Create And Delete Article [with simple POJO] Test', async ({ api, config, authToken }, testInfo) => {

    const testDataObj = testData["Create And Delete Article Test"].article;

    // payload via POJO Article object - to make sure mandatory objs and contract
    const payload: Article = {
        title: testDataObj.title,
        description: testDataObj.description,
        body: testDataObj.body,
        tagList: testDataObj.tagList
    };

    const baseUrl = config.apiUrl;

    // 🔹 STEP 1: CREATE ARTICLE
    consoleLogger.info('Step start: Create Article');
    //consoleLogger.debug('POST /articles baseUrl=%s maskedAuth=%s', baseUrl, maskedToken);

    const startCreate = Date.now();

    try {
        const newArticleResponse = await api
            .url(baseUrl)
            .path('/articles')
            .headers({ Authorization: authToken }) // other headers still u can pass
            .body({"article": payload})
            .postRequest();

        const timeCreate = Date.now() - startCreate;
        consoleLogger.info('POST /articles status=%s timeMs=%s', newArticleResponse.status(), timeCreate);

        const newArticleResponseBody = await newArticleResponse.json();
        const slugId = newArticleResponseBody.article.slug;

        consoleLogger.debug('Created article slug=%s', slugId);

        // Attach API logs to report (optional)
        const createLogs = api.getLogs();
        await testInfo.attach('createArticleLogs', {
            body: createLogs,
            contentType: 'text/plain',
        });

        api.clearLogs();


        consoleLogger.info('Step success: Article created slug=%s', slugId);

        // 🔹 STEP 2: DELETE ARTICLE
        consoleLogger.info('Step start: Delete Article %s', slugId);
        const startDelete = Date.now();

        const deleteResponse = await api
            .url(baseUrl)
            .path(`/articles/${slugId}`)
            //.clearAuth()
            .headers({ Authorization: authToken })
            .deleteRequest();

        const timeDelete = Date.now() - startDelete;
        consoleLogger.info('DELETE /articles/%s status=%s timeMs=%s', slugId, deleteResponse.status(), timeDelete);

        // Attach delete logs
        const deleteLogs = api.getLogs();
        await testInfo.attach('deleteArticleLogs', {
            body: deleteLogs,
            contentType: 'text/plain',
        });

        api.clearLogs();

        expect(deleteResponse.status()).toBe(204);
        consoleLogger.info('Step success: Article deleted slug=%s', slugId);
    } catch (err: any) {
        // 🔹 ERROR handling
        consoleLogger.error('Test failed: Create/Delete Article error=%s', err?.message ?? err);
        throw err;
    }
});

test.skip('Create Update And Delete Article Test', async ({ api, config, authToken }) => {

    const newArticleResponse = await api
        .url(config.apiUrl)
        .path('/articles')
        .headers({ 'Authorization': authToken, })
        .body({
            "article": {
                "title": "AmadeusArticle - Delete Me1",
                "description": "I am Amadeus from different Universe and came to bless you - Delete Me1",
                "body": "Delete Me1",
                "tagList": ["Universe"]
            }
        })
        .postRequest();

    const newArticleResponseBody = await newArticleResponse.json();
    const slugId = newArticleResponseBody.article.slug;

    expect(newArticleResponse.status()).toBe(201);
    expect(newArticleResponseBody.article.title).toEqual("AmadeusArticle - Delete Me1");

    // update article
    const updateArticleResponse = await api
        .url(config.apiUrl)
        .path(`/articles/${slugId}`)
        .headers({ 'Authorization': authToken, })
        .body({
            "article": {
                "title": "TPM 4",
                "description": "TPM 3",
                "body": "TPM 3",
                "tagList": [
                    "TPM 3"
                ]
            }
        })
        .putRequest();

    const updateArticleResponseBody = await updateArticleResponse.json();

    const newSlugId = updateArticleResponseBody.article.slug;

    expect(updateArticleResponse.status()).toBe(200);


    // delete article
    const deleteResponse = await api
        .url(config.apiUrl)
        .path(`/articles/${newSlugId}`)
        .headers({ 'Authorization': authToken, })
        .deleteRequest();

    expect(deleteResponse.status()).toBe(204);

});


test.skip('Logger utility Test', () => {
    const logger = new APILogger();
    logger.logRequest('POST', 'https://api.perfecto.com/users', { 'Accept': 'application/json' }, { foo: 'data' });
    logger.logResponse(200, { users: [{ id: 1, name: 'Param' }] });
    const logs = logger.getRecentLogs();
    console.log(logs);
});