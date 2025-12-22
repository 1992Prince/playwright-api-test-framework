import { test, expect } from '@playwright/test';

/**
 * Application Under Test: Conduit API
 * Base URL: https://conduit-api.bondaracademy.com/api
 * APP URL: https://conduit.bondaracademy.com/
 * Creds: 
 *  - Email: testbondar1@gmail.com
 *  - Password: testbondar1
 */

/**
 * 4 types of hooks are supported by Playwright Test
 * 
 * test.beforeAll
 * test.afterAll
 * test.beforeEach
 * test.afterEach
 * 
 test.beforeAll('run once before all tests', async () => {});

test.afterAll('run once after all tests', async () => {});

test.beforeEach('run before each test', async () => {});

test.afterEach('run after each test', async () => {});
 */

let token: string = '';
test.beforeAll('run once before all tests', async ({ request }) => {
  console.log("**** Starting Conduit API Post Tests ****");
  console.log("**** This is executed only once before all tests ****");

  const tokenResponse = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
    data: {
      "user": {
        "email": "testbondar1@gmail.com",
        "password": "testbondar1"
      }
    }
  })
  const tokenResponseBody = await tokenResponse.json();
  //console.log(tokenResponseBody);

  token = tokenResponseBody.user.token;
  console.log("Token:", token);
  console.log();

});

test.afterAll('run once after all tests', async () => {
  console.log("**** Finished Conduit API Post Tests ****");
  console.log("**** This is executed only once after all tests ****");
});

test.beforeEach('run before each test', async () => {
  console.log("**** This is executed before each test ****");
});

test.afterEach('run after each test', async () => {
  console.log("**** This is executed after each test ****");
});




test('New Article Test - Create Article -> Delete Article', async ({ request }) => {

  // create article request
  const newArticleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles', {
    data: {
      "article": {
        "title": "AmadeusArticle - Delete Me1",
        "description": "I am Amadeus from different Universe and came to bless you - Delete Me1",
        "body": "Delete Me1",
        "tagList": ["Universe"]
      }
    },
    headers: {
      "Authorization": `Token ${token}`
    }

  });

  const newArticleResponseBody = await newArticleResponse.json();
  console.log("New Article Response Body: ", newArticleResponseBody);

  const slugId = newArticleResponseBody.article.slug;

  expect(newArticleResponse.status()).toBe(201);
  expect(newArticleResponseBody.article.title).toEqual("AmadeusArticle - Delete Me1");
  expect(newArticleResponseBody.article.description).toBe("I am Amadeus from different Universe and came to bless you - Delete Me1");
  expect(newArticleResponseBody.article.body).toBe("Delete Me1");
  expect(newArticleResponseBody.article.tagList[0]).toEqual("universe");

  // fetch all authorised articles to verify that new article is present
  // hit the get all articles endpoint with authorization header and then u can validate it



  // delete the article that was created in this test to keep the data clean
  const deleteResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`,
    {
      headers: {
        "Authorization": `Token ${token}`
      }
    }
  );
  expect(deleteResponse.status()).toBe(204);
});


test('New Article Test - Create Article -> Update Article -> Delete Article', async ({ request }) => {

  // create article request
  const newArticleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles', {
    data: {
      "article": {
        "title": "AmadeusArticle - Delete Me1",
        "description": "I am Amadeus from different Universe and came to bless you - Delete Me1",
        "body": "Delete Me1",
        "tagList": ["Universe"]
      }
    },
    headers: {
      "Authorization": `Token ${token}`
    }

  });

  const newArticleResponseBody = await newArticleResponse.json();
  console.log("New Article Response Body: ", newArticleResponseBody);

  const slugId = newArticleResponseBody.article.slug;

  expect(newArticleResponse.status()).toBe(201);
  expect(newArticleResponseBody.article.title).toEqual("AmadeusArticle - Delete Me1");
  expect(newArticleResponseBody.article.description).toBe("I am Amadeus from different Universe and came to bless you - Delete Me1");
  expect(newArticleResponseBody.article.body).toBe("Delete Me1");
  expect(newArticleResponseBody.article.tagList[0]).toEqual("universe");

  // fetch all authorised articles to verify that new article is present
  // hit the get all articles endpoint with authorization header and then u can validate it


  // update the article that was created in this test using PUT method
  const updateArticleResponse = await request.put(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`, {
    data: {
      "article": {
        "title": "TPM 4",
        "description": "TPM 3",
        "body": "TPM 3",
        "tagList": [
          "TPM 3"
        ]
      }
    },
    headers: {
      "Authorization": `Token ${token}`
    }

  });

  const updateArticleResponseBody = await updateArticleResponse.json();

  const newSlugId = updateArticleResponseBody.article.slug;

  expect(updateArticleResponse.status()).toBe(200);



  // delete the article that was created in this test to keep the data clean
  const deleteResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${newSlugId}`,
    {
      headers: {
        "Authorization": `Token ${token}`
      }
    }
  );
  expect(deleteResponse.status()).toBe(204);
});





